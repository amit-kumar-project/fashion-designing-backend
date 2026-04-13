#!/bin/bash

set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:8080/api}"
TEST_EMAIL="${TEST_EMAIL:-}"
TEST_PASSWORD="${TEST_PASSWORD:-}"
ACCESS_TOKEN="${ACCESS_TOKEN:-}"
IMAGE_PATH="${IMAGE_PATH:-}"
AUTO_SIGNUP="${AUTO_SIGNUP:-false}"

TEMP_IMAGE_FILE=""
RESPONSE_STATUS=""
RESPONSE_BODY=""
UPLOADED_KEY=""
SIGNED_URL=""

print_title() {
  echo
  echo "========================================"
  echo "$1"
  echo "========================================"
}

cleanup() {
  if [[ -n "$TEMP_IMAGE_FILE" && -f "$TEMP_IMAGE_FILE" ]]; then
    rm -f "$TEMP_IMAGE_FILE"
  fi
}

trap cleanup EXIT

parse_json_field() {
  local json="$1"
  local field_path="$2"

  node -e "
    const data = JSON.parse(process.argv[1]);
    const path = process.argv[2].split('.');
    let value = data;
    for (const key of path) {
      value = value?.[key];
    }
    if (value === undefined || value === null) process.exit(2);
    if (typeof value === 'object') {
      console.log(JSON.stringify(value));
    } else {
      console.log(String(value));
    }
  " "$json" "$field_path" 2>/dev/null || true
}

url_encode() {
  node -e "console.log(encodeURIComponent(process.argv[1]))" "$1"
}

request_json() {
  local method="$1"
  local url="$2"
  local body="${3:-}"
  local token="${4:-}"

  local headers=(-H "Content-Type: application/json")
  if [[ -n "$token" ]]; then
    headers+=(-H "Authorization: Bearer $token")
  fi

  local response
  if [[ -n "$body" ]]; then
    response=$(curl -sS -X "$method" "$url" "${headers[@]}" -d "$body" -w "\nHTTP_STATUS:%{http_code}")
  else
    response=$(curl -sS -X "$method" "$url" "${headers[@]}" -w "\nHTTP_STATUS:%{http_code}")
  fi

  RESPONSE_STATUS=$(echo "$response" | sed -n 's/^HTTP_STATUS://p')
  RESPONSE_BODY=$(echo "$response" | sed '/^HTTP_STATUS:/d')
}

request_multipart() {
  local method="$1"
  local url="$2"
  local file_path="$3"
  local token="$4"

  local response
  response=$(curl -sS -X "$method" "$url" \
    -H "Authorization: Bearer $token" \
    -F "file=@${file_path}" \
    -w "\nHTTP_STATUS:%{http_code}")

  RESPONSE_STATUS=$(echo "$response" | sed -n 's/^HTTP_STATUS://p')
  RESPONSE_BODY=$(echo "$response" | sed '/^HTTP_STATUS:/d')
}

create_temp_test_image() {
  TEMP_IMAGE_FILE="/tmp/storage-test-$(date +%s)-$$.png"

  cat <<'B64' | base64 --decode > "$TEMP_IMAGE_FILE"
iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO7ZxXkAAAAASUVORK5CYII=
B64

  echo "$TEMP_IMAGE_FILE"
}

print_title "0) Resolve auth token"
if [[ -z "$ACCESS_TOKEN" ]]; then
  if [[ -z "$TEST_EMAIL" || -z "$TEST_PASSWORD" ]]; then
    echo "Provide ACCESS_TOKEN OR (TEST_EMAIL + TEST_PASSWORD)."
    echo "Example: ACCESS_TOKEN=<token> bash scripts/test-storage-api.sh"
    echo "Example: TEST_EMAIL=user@gmail.com TEST_PASSWORD=Pass@123 bash scripts/test-storage-api.sh"
    exit 1
  fi

  if [[ "$AUTO_SIGNUP" == "true" ]]; then
    RANDOM_ID="$(date +%s)"
    SIGNUP_BODY=$(cat <<JSON
{
  "name": "Storage Test User",
  "email": "$TEST_EMAIL",
  "phoneNumber": "92000${RANDOM_ID: -5}",
  "password": "$TEST_PASSWORD",
  "confirmPassword": "$TEST_PASSWORD"
}
JSON
)

    request_json POST "$BASE_URL/auth/signup" "$SIGNUP_BODY"
    echo "Signup status: $RESPONSE_STATUS"
  fi

  LOGIN_BODY=$(cat <<JSON
{
  "email": "$TEST_EMAIL",
  "password": "$TEST_PASSWORD"
}
JSON
)

  request_json POST "$BASE_URL/auth/login" "$LOGIN_BODY"
  echo "Login status: $RESPONSE_STATUS"
  echo "Login body: $RESPONSE_BODY"

  if [[ "$RESPONSE_STATUS" != "200" ]]; then
    echo "Login failed. Stopping."
    exit 1
  fi

  ACCESS_TOKEN=$(parse_json_field "$RESPONSE_BODY" "accessToken")

  if [[ -z "$ACCESS_TOKEN" ]]; then
    echo "Could not extract accessToken from login response."
    exit 1
  fi
fi

echo "Using token: ${ACCESS_TOKEN:0:25}..."

if [[ -z "$IMAGE_PATH" ]]; then
  IMAGE_PATH=$(create_temp_test_image)
  echo "Generated temp image: $IMAGE_PATH"
fi

if [[ ! -f "$IMAGE_PATH" ]]; then
  echo "Image not found: $IMAGE_PATH"
  exit 1
fi

print_title "1) Upload image (POST /storage/upload)"
request_multipart POST "$BASE_URL/storage/upload" "$IMAGE_PATH" "$ACCESS_TOKEN"
echo "Status: $RESPONSE_STATUS"
echo "Body: $RESPONSE_BODY"

if [[ "$RESPONSE_STATUS" != "201" ]]; then
  echo "Upload failed. Stopping."
  exit 1
fi

UPLOADED_KEY=$(parse_json_field "$RESPONSE_BODY" "data.key")
SIGNED_URL=$(parse_json_field "$RESPONSE_BODY" "data.signedUrl")

if [[ -z "$UPLOADED_KEY" || -z "$SIGNED_URL" ]]; then
  echo "Failed to extract uploaded key or signedUrl."
  exit 1
fi

echo "Uploaded key: $UPLOADED_KEY"

auth_key=$(url_encode "$UPLOADED_KEY")

print_title "2) Generate signed URL (GET /storage/signed-url)"
request_json GET "$BASE_URL/storage/signed-url?key=$auth_key" "" "$ACCESS_TOKEN"
echo "Status: $RESPONSE_STATUS"
echo "Body: $RESPONSE_BODY"

if [[ "$RESPONSE_STATUS" != "200" ]]; then
  echo "Signed URL generation failed. Stopping."
  exit 1
fi

SIGNED_URL_2=$(parse_json_field "$RESPONSE_BODY" "data.signedUrl")
if [[ -z "$SIGNED_URL_2" ]]; then
  echo "No signed URL in signed-url response."
  exit 1
fi

print_title "3) Open signed URL (direct GET)"
DIRECT_STATUS=$(curl -sS -o /dev/null -w "%{http_code}" "$SIGNED_URL_2")
echo "Direct signed URL HTTP status: $DIRECT_STATUS"

print_title "4) Delete image (DELETE /storage/object)"
DELETE_BODY=$(cat <<JSON
{
  "key": "$UPLOADED_KEY"
}
JSON
)
request_json DELETE "$BASE_URL/storage/object" "$DELETE_BODY" "$ACCESS_TOKEN"
echo "Status: $RESPONSE_STATUS"
echo "Body: $RESPONSE_BODY"

if [[ "$RESPONSE_STATUS" != "200" ]]; then
  echo "Delete failed."
  exit 1
fi

print_title "Done"
echo "Storage API smoke test completed successfully against: $BASE_URL"
