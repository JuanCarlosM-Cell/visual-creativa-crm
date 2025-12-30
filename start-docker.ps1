# Script de Inicio con Docker - Visual Creativa CRM

Write-Host "╔═══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   Visual Creativa CRM - Inicio con Docker Compose        ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Verificar Docker
Write-Host "🔍 Verificando Docker..." -ForegroundColor Yellow

try {
    $dockerVersion = docker --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Docker instalado: $dockerVersion" -ForegroundColor Green
    } else {
        throw "Docker no encontrado"
    }
} catch {
    Write-Host "❌ Docker NO está instalado" -ForegroundColor Red
    Write-Host ""
    Write-Host "Necesitas instalar Docker Desktop:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "1. Descarga: https://www.docker.com/products/docker-desktop/" -ForegroundColor White
    Write-Host "2. Ejecuta el instalador" -ForegroundColor White
    Write-Host "3. Reinicia tu PC" -ForegroundColor White
    Write-Host "4. Abre Docker Desktop" -ForegroundColor White
    Write-Host "5. Vuelve a ejecutar este script" -ForegroundColor White
    Write-Host ""
    Write-Host "📖 Ver guía completa en: DOCKER_SETUP.md" -ForegroundColor Cyan
    Write-Host ""
    
    $openGuide = Read-Host "¿Abrir guía de instalación? (s/n)"
    if ($openGuide -eq "s") {
        Start-Process "DOCKER_SETUP.md"
    }
    
    Read-Host "Presiona Enter para salir"
    exit
}

# Verificar que Docker Desktop esté corriendo
Write-Host "🔍 Verificando Docker Desktop..." -ForegroundColor Yellow

try {
    docker ps 2>$null | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Docker Desktop está corriendo" -ForegroundColor Green
    } else {
        throw "Docker Desktop no está corriendo"
    }
} catch {
    Write-Host "❌ Docker Desktop NO está corriendo" -ForegroundColor Red
    Write-Host ""
    Write-Host "Por favor:" -ForegroundColor Yellow
    Write-Host "1. Abre Docker Desktop desde el menú de inicio" -ForegroundColor White
    Write-Host "2. Espera a que el ícono de la ballena aparezca en la barra de tareas" -ForegroundColor White
    Write-Host "3. Vuelve a ejecutar este script" -ForegroundColor White
    Write-Host ""
    Read-Host "Presiona Enter para salir"
    exit
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Menú
Write-Host "¿Qué deseas hacer?" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Iniciar todo (PostgreSQL + Backend + Frontend)" -ForegroundColor White
Write-Host "2. Iniciar en segundo plano (detached mode)" -ForegroundColor White
Write-Host "3. Detener todos los servicios" -ForegroundColor White
Write-Host "4. Ver logs de los servicios" -ForegroundColor White
Write-Host "5. Reconstruir y reiniciar (si hay cambios)" -ForegroundColor White
Write-Host "6. Limpiar todo y empezar de cero" -ForegroundColor White
Write-Host "7. Ver estado de los contenedores" -ForegroundColor White
Write-Host "8. Salir" -ForegroundColor White
Write-Host ""

$opcion = Read-Host "Selecciona una opción (1-8)"

switch ($opcion) {
    "1" {
        Write-Host ""
        Write-Host "🚀 Iniciando todos los servicios..." -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Esto puede tomar varios minutos la primera vez..." -ForegroundColor Gray
        Write-Host "Se descargarán imágenes e instalarán dependencias." -ForegroundColor Gray
        Write-Host ""
        Write-Host "Una vez que veas:" -ForegroundColor Cyan
        Write-Host "  'Servidor corriendo en http://localhost:3001'" -ForegroundColor White
        Write-Host "  'Local: http://localhost:5173/'" -ForegroundColor White
        Write-Host ""
        Write-Host "Abre tu navegador en: http://localhost:5173" -ForegroundColor Green
        Write-Host ""
        Write-Host "Presiona Ctrl+C para detener todos los servicios" -ForegroundColor Yellow
        Write-Host ""
        
        docker-compose up
    }
    
    "2" {
        Write-Host ""
        Write-Host "🚀 Iniciando servicios en segundo plano..." -ForegroundColor Yellow
        
        docker-compose up -d
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "✅ Servicios iniciados exitosamente" -ForegroundColor Green
            Write-Host ""
            Write-Host "📱 Accede a la aplicación en: http://localhost:5173" -ForegroundColor Cyan
            Write-Host ""
            Write-Host "Ver logs: docker-compose logs -f" -ForegroundColor Gray
            Write-Host "Detener: docker-compose down" -ForegroundColor Gray
        }
    }
    
    "3" {
        Write-Host ""
        Write-Host "🛑 Deteniendo servicios..." -ForegroundColor Yellow
        
        docker-compose down
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Servicios detenidos" -ForegroundColor Green
        }
    }
    
    "4" {
        Write-Host ""
        Write-Host "📋 Mostrando logs (Ctrl+C para salir)..." -ForegroundColor Yellow
        Write-Host ""
        
        docker-compose logs -f
    }
    
    "5" {
        Write-Host ""
        Write-Host "🔄 Reconstruyendo y reiniciando..." -ForegroundColor Yellow
        
        docker-compose up --build
    }
    
    "6" {
        Write-Host ""
        Write-Host "⚠️  ADVERTENCIA: Esto eliminará todos los datos" -ForegroundColor Red
        $confirmar = Read-Host "¿Estás seguro? (s/n)"
        
        if ($confirmar -eq "s") {
            Write-Host ""
            Write-Host "🧹 Limpiando todo..." -ForegroundColor Yellow
            
            docker-compose down -v
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✅ Todo limpio. Ejecuta opción 1 para empezar de nuevo" -ForegroundColor Green
            }
        } else {
            Write-Host "Operación cancelada" -ForegroundColor Gray
        }
    }
    
    "7" {
        Write-Host ""
        Write-Host "📊 Estado de los contenedores:" -ForegroundColor Yellow
        Write-Host ""
        
        docker-compose ps
        
        Write-Host ""
        Write-Host "Contenedores de Docker:" -ForegroundColor Yellow
        docker ps -a --filter "name=visual-creativa"
    }
    
    "8" {
        Write-Host ""
        Write-Host "👋 ¡Hasta luego!" -ForegroundColor Cyan
        exit
    }
    
    default {
        Write-Host ""
        Write-Host "❌ Opción inválida" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Read-Host "Presiona Enter para salir"
