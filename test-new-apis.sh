#!/bin/bash

set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:8080/api}"
RANDOM_ID="$(date +%s)"
TEST_EMAIL="${TEST_EMAIL:-test_${RANDOM_ID}@example.com}"
TEST_PHONE="${TEST_PHONE:-92000${RANDOM_ID: -5}}"
TEST_PASSWORD="${TEST_PASSWORD:-Amit@123}"
TEST_NAME="${TEST_NAME:-Test User}"

ADMIN_EMAIL="${ADMIN_EMAIL:-}"
ADMIN_PASSWORD="${ADMIN_PASSWORD:-}"

print_title() {
  echo
  echo "========================================"
  echo "$1"
  echo "========================================"
}

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

request() {
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

print_title "1) Health Check"
request GET "$BASE_URL/health"
echo "Status: $RESPONSE_STATUS"
echo "Body: $RESPONSE_BODY"

print_title "2) Signup (Normal User, isAdmin=false)"
SIGNUP_BODY=$(cat <<JSON
{
  "name": "$TEST_NAME",
  "email": "$TEST_EMAIL",
  "phoneNumber": "$TEST_PHONE",
  "password": "$TEST_PASSWORD",
  "confirmPassword": "$TEST_PASSWORD"
}
JSON
)
request POST "$BASE_URL/auth/signup" "$SIGNUP_BODY"
echo "Status: $RESPONSE_STATUS"
echo "Body: $RESPONSE_BODY"

if [[ "$RESPONSE_STATUS" != "201" && "$RESPONSE_STATUS" != "400" ]]; then
  echo "Unexpected signup status. Stopping."
  exit 1
fi

print_title "3) Login (Receive accessToken)"
LOGIN_BODY=$(cat <<JSON
{
  "email": "$TEST_EMAIL",
  "password": "$TEST_PASSWORD"
}
JSON
)
request POST "$BASE_URL/auth/login" "$LOGIN_BODY"
echo "Status: $RESPONSE_STATUS"
echo "Body: $RESPONSE_BODY"

if [[ "$RESPONSE_STATUS" != "200" ]]; then
  echo "Login failed. Stopping."
  exit 1
fi

ACCESS_TOKEN=$(parse_json_field "$RESPONSE_BODY" "accessToken")
IS_ADMIN=$(parse_json_field "$RESPONSE_BODY" "data.isAdmin")

if [[ -z "$ACCESS_TOKEN" ]]; then
  echo "Could not extract accessToken from login response."
  exit 1
fi

echo "Extracted token: ${ACCESS_TOKEN:0:25}..."
echo "User isAdmin: ${IS_ADMIN:-unknown}"

print_title "4) Admin API with Normal User Token (Expected 403)"
request GET "$BASE_URL/admin/users" "" "$ACCESS_TOKEN"
echo "Status: $RESPONSE_STATUS"
echo "Body: $RESPONSE_BODY"

print_title "5) Optional Admin Login + Admin APIs"
if [[ -n "$ADMIN_EMAIL" && -n "$ADMIN_PASSWORD" ]]; then
  ADMIN_LOGIN_BODY=$(cat <<JSON
{
  "email": "$ADMIN_EMAIL",
  "password": "$ADMIN_PASSWORD"
}
JSON
)

  request POST "$BASE_URL/auth/login" "$ADMIN_LOGIN_BODY"
  echo "Admin login status: $RESPONSE_STATUS"
  echo "Admin login body: $RESPONSE_BODY"

  if [[ "$RESPONSE_STATUS" == "200" ]]; then
    ADMIN_TOKEN=$(parse_json_field "$RESPONSE_BODY" "accessToken")

    request GET "$BASE_URL/admin/users" "" "$ADMIN_TOKEN"
    echo "GET /admin/users status: $RESPONSE_STATUS"

    request GET "$BASE_URL/admin/designs" "" "$ADMIN_TOKEN"
    echo "GET /admin/designs status: $RESPONSE_STATUS"
  else
    echo "Admin login failed; skipping admin endpoint checks."
  fi
else
  echo "ADMIN_EMAIL / ADMIN_PASSWORD not provided, skipping admin-success checks."
  echo "Tip: ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=secret ./test-new-apis.sh"
fi

print_title "Done"
echo "API smoke tests completed against: $BASE_URL"
