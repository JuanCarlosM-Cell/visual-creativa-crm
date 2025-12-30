$envFile = "backend\.env"

Write-Host "📧 Configuración de Correo para CRM" -ForegroundColor Cyan
Write-Host "====================================="
Write-Host "Para enviar correos reales, necesitamos una cuenta de Gmail y una Contraseña de Aplicación."
Write-Host "Guía: https://support.google.com/accounts/answer/185833?hl=es"
Write-Host ""

$email = Read-Host "Introduce tu correo de Gmail (ej. tucorreo@gmail.com)"
$password = Read-Host "Introduce tu Contraseña de Aplicación de 16 caracteres (sin espacios)"

if ([string]::IsNullOrWhiteSpace($email) -or [string]::IsNullOrWhiteSpace($password)) {
    Write-Host "❌ Datos inválidos. Operación cancelada." -ForegroundColor Red
    exit
}

# Leer el contenido actual si existe
if (Test-Path $envFile) {
    $content = Get-Content $envFile
} else {
    Write-Host "⚠️ No se encontró backend\.env, copiando desde .env.example..." -ForegroundColor Yellow
    Copy-Item "backend\.env.example" $envFile
    $content = Get-Content $envFile
}

# Filtrar líneas antiguas de email
$newContent = $content | Where-Object { $_ -notmatch "^EMAIL_" }

# Añadir nuevas credenciales
$newContent += ""
$newContent += "EMAIL_USER=$email"
$newContent += "EMAIL_PASS=$password"

# Guardar
$newContent | Set-Content $envFile

Write-Host ""
Write-Host "✅ ¡Configuración guardada en backend\.env!" -ForegroundColor Green
Write-Host "⚠️ IMPORTANTE: Debes REINICIAR el servidor backend para que los cambios surtan efecto." -ForegroundColor Yellow
Write-Host "   (Ve a la terminal del backend, presiona Ctrl+C y ejecuta 'npm run dev' de nuevo)"
