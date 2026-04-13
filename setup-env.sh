#!/bin/bash

# Environment Setup Script for Fashion Design API
# This script helps you set up environment files for different environments

echo "🚀 Fashion Design API - Environment Setup"
echo "=========================================="
echo ""

# Function to create env file from example
create_env_file() {
    local env_type=$1
    local example_file=".env.prod.${env_type}.example"
    local target_file=".env.prod.${env_type}"
    
    if [ -f "$target_file" ]; then
        echo "⚠️  $target_file already exists."
        read -p "Do you want to overwrite it? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            echo "⏭️  Skipping $target_file"
            return
        fi
    fi
    
    if [ -f "$example_file" ]; then
        cp "$example_file" "$target_file"
        echo "✅ Created $target_file from $example_file"
    else
        echo "❌ Error: $example_file not found"
    fi
}

# Main menu
echo "Which environment(s) do you want to set up?"
echo ""
echo "1) Local Development (.env.prod.local)"
echo "2) Development (.env.prod.dev)"
echo "3) Production (.env.prod.prod)"
echo "4) All environments"
echo "5) Exit"
echo ""
read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        echo ""
        create_env_file "local"
        ;;
    2)
        echo ""
        create_env_file "dev"
        ;;
    3)
        echo ""
        create_env_file "prod"
        ;;
    4)
        echo ""
        create_env_file "local"
        create_env_file "dev"
        create_env_file "prod"
        ;;
    5)
        echo "👋 Exiting..."
        exit 0
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "✨ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Edit your .env files with your actual configuration"
echo "2. For local: Update MONGODB_URI if needed"
echo "3. For dev/prod: Update MONGODB_URI with your MongoDB Atlas credentials"
echo "4. Update JWT_SECRET with a strong secret key"
echo ""
echo "🚀 Run your application:"
echo "   npm run dev          # Local development"
echo "   npm run start:dev    # Development environment"
echo "   npm run start:prod   # Production environment"
echo ""
echo "📖 For more details, see ENVIRONMENT_SETUP.md"
