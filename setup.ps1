# Setup Script for Visual Creativa CRM
# Run this script to set up the project for local development

Write-Host "🚀 Visual Creativa CRM - Setup Script" -ForegroundColor Cyan
Write-Host ""

# Backend setup
Write-Host "📦 Setting up Backend..." -ForegroundColor Yellow
Set-Location backend

# Create .env file
Write-Host "Creating .env file..." -ForegroundColor Gray
@"
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/visual_creativa_crm?schema=public"
JWT_SECRET="dev-secret-change-in-production-use-crypto-random-bytes"
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
"@ | Out-File -FilePath .env -Encoding utf8

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Gray
npm install

# Generate Prisma Client
Write-Host "Generating Prisma Client..." -ForegroundColor Gray
npx prisma generate

Write-Host "✅ Backend setup complete!" -ForegroundColor Green
Write-Host ""

# Frontend setup
Set-Location ../frontend
Write-Host "📦 Setting up Frontend..." -ForegroundColor Yellow

# Create .env file
Write-Host "Creating .env file..." -ForegroundColor Gray
@"
VITE_API_URL=http://localhost:3001
"@ | Out-File -FilePath .env -Encoding utf8

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Gray
npm install

Write-Host "✅ Frontend setup complete!" -ForegroundColor Green
Write-Host ""

Set-Location ..

Write-Host "🎉 Setup complete!" -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️  IMPORTANT: You need PostgreSQL running on localhost:5432" -ForegroundColor Yellow
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Make sure PostgreSQL is running" -ForegroundColor White
Write-Host "2. Run migrations: cd backend && npm run migrate" -ForegroundColor White
Write-Host "3. Seed database: npm run seed" -ForegroundColor White
Write-Host "4. Start backend: npm run dev" -ForegroundColor White
Write-Host "5. In another terminal, start frontend: cd frontend && npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Or use Docker Compose: docker-compose up" -ForegroundColor White
