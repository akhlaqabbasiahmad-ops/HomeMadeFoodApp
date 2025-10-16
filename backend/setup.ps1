# HomeMadeFood Backend Setup Script (PowerShell)

Write-Host "🍕 HomeMadeFood Backend Setup" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js $nodeVersion found" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js (v18+) first." -ForegroundColor Red
    exit 1
}

# Check if PostgreSQL is available
try {
    $null = Get-Command psql -ErrorAction Stop
    Write-Host "✅ PostgreSQL found" -ForegroundColor Green
} catch {
    Write-Host "⚠️  PostgreSQL CLI not found. Make sure PostgreSQL is installed." -ForegroundColor Yellow
}

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Cyan
npm install

# Create environment file if it doesn't exist
if (!(Test-Path ".env")) {
    Write-Host "🔧 Creating .env file from example..." -ForegroundColor Cyan
    Copy-Item ".env.example" ".env"
    Write-Host "⚠️  Please update the .env file with your database credentials!" -ForegroundColor Yellow
} else {
    Write-Host "✅ .env file already exists" -ForegroundColor Green
}

Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Update your .env file with database credentials"
Write-Host "2. Create PostgreSQL database: CREATE DATABASE homemadefood_db;"
Write-Host "3. Run database migrations: npm run migration:run"
Write-Host "4. Start development server: npm run start:dev"
Write-Host ""
Write-Host "🚀 API will be available at: http://localhost:3000/api/v1" -ForegroundColor Green
Write-Host "📖 Documentation at: http://localhost:3000/api/docs" -ForegroundColor Green