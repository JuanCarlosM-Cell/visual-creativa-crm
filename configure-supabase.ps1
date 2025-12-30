# Script para configurar Supabase
# Ejecuta este script después de pegar tu contraseña de Supabase

param(
    [Parameter(Mandatory=$true)]
    [string]$SupabasePassword
)

Write-Host "🔧 Configurando backend con Supabase..." -ForegroundColor Cyan
Write-Host ""

$connectionString = "postgresql://postgres:$SupabasePassword@db.fqphfgaxmxfihebsgdpt.supabase.co:5432/postgres"

$envContent = @"
DATABASE_URL="$connectionString"
JWT_SECRET="dev-secret-change-in-production-use-crypto-random-bytes"
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
"@

Set-Content -Path "backend\.env" -Value $envContent

Write-Host "✅ Archivo backend/.env actualizado" -ForegroundColor Green
Write-Host ""
Write-Host "DATABASE_URL configurado con Supabase" -ForegroundColor Gray
Write-Host ""
Write-Host "Siguiente paso: Ejecutar migraciones" -ForegroundColor Yellow
Write-Host ""
Write-Host "cd backend" -ForegroundColor White
Write-Host "npm run migrate" -ForegroundColor White
Write-Host "npm run seed" -ForegroundColor White
Write-Host "npm run dev" -ForegroundColor White
