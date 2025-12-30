# Script de Inicio Rápido - Visual Creativa CRM
# Este script te ayuda a iniciar el proyecto paso a paso

Write-Host "╔═══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║     Visual Creativa CRM - Asistente de Inicio Local      ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Verificar PostgreSQL
Write-Host "🔍 Verificando PostgreSQL..." -ForegroundColor Yellow
$pgService = Get-Service -Name postgresql* -ErrorAction SilentlyContinue

if ($pgService) {
    Write-Host "✅ PostgreSQL encontrado: $($pgService.Name)" -ForegroundColor Green
    Write-Host "   Estado: $($pgService.Status)" -ForegroundColor Gray
    
    if ($pgService.Status -ne "Running") {
        Write-Host "⚠️  PostgreSQL no está corriendo. Intentando iniciar..." -ForegroundColor Yellow
        Start-Service $pgService.Name
        Write-Host "✅ PostgreSQL iniciado" -ForegroundColor Green
    }
} else {
    Write-Host "❌ PostgreSQL NO encontrado" -ForegroundColor Red
    Write-Host ""
    Write-Host "Necesitas instalar PostgreSQL. Tienes 3 opciones:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "1. Supabase (Gratis, sin instalación) - MÁS RÁPIDO" -ForegroundColor White
    Write-Host "   → Ve a https://supabase.com y crea un proyecto" -ForegroundColor Gray
    Write-Host "   → Copia la Connection String a backend/.env" -ForegroundColor Gray
    Write-Host ""
    Write-Host "2. Instalar PostgreSQL localmente" -ForegroundColor White
    Write-Host "   → Descarga: https://www.postgresql.org/download/windows/" -ForegroundColor Gray
    Write-Host "   → Instala con usuario 'postgres' y password 'postgres'" -ForegroundColor Gray
    Write-Host ""
    Write-Host "3. Usar Docker Desktop" -ForegroundColor White
    Write-Host "   → Instala Docker Desktop" -ForegroundColor Gray
    Write-Host "   → Ejecuta: docker-compose up" -ForegroundColor Gray
    Write-Host ""
    Write-Host "📖 Ver guía completa en: INSTALL_POSTGRES.md" -ForegroundColor Cyan
    Write-Host ""
    Read-Host "Presiona Enter después de configurar PostgreSQL"
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Verificar archivos .env
Write-Host "🔍 Verificando archivos de configuración..." -ForegroundColor Yellow

$backendEnv = Test-Path "backend\.env"
$frontendEnv = Test-Path "frontend\.env"

if ($backendEnv) {
    Write-Host "✅ backend/.env existe" -ForegroundColor Green
} else {
    Write-Host "⚠️  Creando backend/.env..." -ForegroundColor Yellow
    Copy-Item "backend\.env.example" "backend\.env"
    Write-Host "✅ backend/.env creado" -ForegroundColor Green
}

if ($frontendEnv) {
    Write-Host "✅ frontend/.env existe" -ForegroundColor Green
} else {
    Write-Host "⚠️  Creando frontend/.env..." -ForegroundColor Yellow
    Copy-Item "frontend\.env.example" "frontend\.env"
    Write-Host "✅ frontend/.env creado" -ForegroundColor Green
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Menú de opciones
Write-Host "¿Qué deseas hacer?" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Configurar base de datos (migraciones + seed)" -ForegroundColor White
Write-Host "2. Iniciar solo el backend" -ForegroundColor White
Write-Host "3. Iniciar solo el frontend" -ForegroundColor White
Write-Host "4. Iniciar backend Y frontend (2 terminales)" -ForegroundColor White
Write-Host "5. Ver estado de los servicios" -ForegroundColor White
Write-Host "6. Salir" -ForegroundColor White
Write-Host ""

$opcion = Read-Host "Selecciona una opción (1-6)"

switch ($opcion) {
    "1" {
        Write-Host ""
        Write-Host "🗄️  Configurando base de datos..." -ForegroundColor Yellow
        Write-Host ""
        
        Set-Location backend
        
        Write-Host "📋 Ejecutando migraciones..." -ForegroundColor Gray
        npm run migrate
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Migraciones completadas" -ForegroundColor Green
            Write-Host ""
            Write-Host "🌱 Poblando base de datos..." -ForegroundColor Gray
            npm run seed
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✅ Base de datos poblada exitosamente" -ForegroundColor Green
                Write-Host ""
                Write-Host "📧 Credenciales de prueba:" -ForegroundColor Cyan
                Write-Host "   Admin: admin@visualcreativa.com / Admin123!" -ForegroundColor White
                Write-Host "   User1: user1@visualcreativa.com / User123!" -ForegroundColor White
                Write-Host "   User2: user2@visualcreativa.com / User123!" -ForegroundColor White
            } else {
                Write-Host "❌ Error al poblar la base de datos" -ForegroundColor Red
            }
        } else {
            Write-Host "❌ Error en las migraciones" -ForegroundColor Red
            Write-Host "Verifica tu conexión a PostgreSQL en backend/.env" -ForegroundColor Yellow
        }
        
        Set-Location ..
    }
    
    "2" {
        Write-Host ""
        Write-Host "🚀 Iniciando backend..." -ForegroundColor Yellow
        Write-Host "   URL: http://localhost:3001" -ForegroundColor Gray
        Write-Host "   Presiona Ctrl+C para detener" -ForegroundColor Gray
        Write-Host ""
        
        Set-Location backend
        npm run dev
    }
    
    "3" {
        Write-Host ""
        Write-Host "🎨 Iniciando frontend..." -ForegroundColor Yellow
        Write-Host "   URL: http://localhost:5173" -ForegroundColor Gray
        Write-Host "   Presiona Ctrl+C para detener" -ForegroundColor Gray
        Write-Host ""
        
        Set-Location frontend
        npm run dev
    }
    
    "4" {
        Write-Host ""
        Write-Host "🚀 Iniciando backend y frontend..." -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Se abrirán 2 ventanas de terminal:" -ForegroundColor Cyan
        Write-Host "  1. Backend en http://localhost:3001" -ForegroundColor White
        Write-Host "  2. Frontend en http://localhost:5173" -ForegroundColor White
        Write-Host ""
        
        # Iniciar backend en nueva terminal
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; Write-Host '🚀 Backend - Visual Creativa CRM' -ForegroundColor Cyan; npm run dev"
        
        Start-Sleep -Seconds 2
        
        # Iniciar frontend en nueva terminal
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\frontend'; Write-Host '🎨 Frontend - Visual Creativa CRM' -ForegroundColor Cyan; npm run dev"
        
        Write-Host "✅ Servicios iniciados en terminales separadas" -ForegroundColor Green
        Write-Host ""
        Write-Host "📱 Accede a la aplicación en: http://localhost:5173" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "📧 Credenciales:" -ForegroundColor Yellow
        Write-Host "   Admin: admin@visualcreativa.com / Admin123!" -ForegroundColor White
        Write-Host "   User1: user1@visualcreativa.com / User123!" -ForegroundColor White
    }
    
    "5" {
        Write-Host ""
        Write-Host "📊 Estado de los servicios:" -ForegroundColor Yellow
        Write-Host ""
        
        # PostgreSQL
        $pgService = Get-Service -Name postgresql* -ErrorAction SilentlyContinue
        if ($pgService) {
            Write-Host "PostgreSQL: $($pgService.Status)" -ForegroundColor Green
        } else {
            Write-Host "PostgreSQL: No instalado" -ForegroundColor Red
        }
        
        # Backend
        $backendRunning = Test-NetConnection -ComputerName localhost -Port 3001 -InformationLevel Quiet -WarningAction SilentlyContinue
        if ($backendRunning) {
            Write-Host "Backend (3001): Corriendo ✅" -ForegroundColor Green
        } else {
            Write-Host "Backend (3001): Detenido ❌" -ForegroundColor Red
        }
        
        # Frontend
        $frontendRunning = Test-NetConnection -ComputerName localhost -Port 5173 -InformationLevel Quiet -WarningAction SilentlyContinue
        if ($frontendRunning) {
            Write-Host "Frontend (5173): Corriendo ✅" -ForegroundColor Green
        } else {
            Write-Host "Frontend (5173): Detenido ❌" -ForegroundColor Red
        }
    }
    
    "6" {
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
