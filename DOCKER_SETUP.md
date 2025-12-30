# Instalación y Configuración con Docker - Visual Creativa CRM

## 🐳 Paso 1: Instalar Docker Desktop

### Descargar Docker Desktop

1. **Descarga Docker Desktop para Windows:**
   - Ve a: https://www.docker.com/products/docker-desktop/
   - Click en "Download for Windows"
   - O descarga directamente: https://desktop.docker.com/win/main/amd64/Docker%20Desktop%20Installer.exe

2. **Ejecutar el Instalador:**
   - Ejecuta el archivo descargado `Docker Desktop Installer.exe`
   - Acepta los términos y condiciones
   - Asegúrate de que esté marcado "Use WSL 2 instead of Hyper-V" (recomendado)
   - Click en "Ok"
   - Espera a que termine la instalación (puede tomar varios minutos)

3. **Reiniciar tu PC:**
   - Docker Desktop te pedirá reiniciar
   - **IMPORTANTE:** Reinicia tu computadora

4. **Iniciar Docker Desktop:**
   - Después del reinicio, abre Docker Desktop desde el menú de inicio
   - Espera a que Docker se inicie completamente (verás un ícono de ballena en la barra de tareas)
   - Puede pedirte aceptar el acuerdo de servicio
   - Puede pedirte crear una cuenta (puedes omitir esto)

5. **Verificar Instalación:**
   ```powershell
   docker --version
   docker-compose --version
   ```
   
   Deberías ver algo como:
   ```
   Docker version 24.x.x
   Docker Compose version v2.x.x
   ```

---

## 🚀 Paso 2: Levantar el Proyecto con Docker Compose

Una vez que Docker Desktop esté corriendo:

### Opción A: Usar el Script Automatizado

```powershell
# Desde la raíz del proyecto
.\start-docker.ps1
```

### Opción B: Manual

```powershell
# Desde la raíz del proyecto CRM
docker-compose up
```

Esto hará automáticamente:
- ✅ Descargar la imagen de PostgreSQL
- ✅ Crear y configurar la base de datos
- ✅ Instalar dependencias del backend
- ✅ Ejecutar migraciones de Prisma
- ✅ Poblar la base de datos con seed
- ✅ Iniciar el servidor backend en puerto 3001
- ✅ Instalar dependencias del frontend
- ✅ Iniciar el servidor frontend en puerto 5173

**La primera vez tomará varios minutos** porque tiene que descargar imágenes y instalar dependencias.

---

## 📱 Paso 3: Acceder a la Aplicación

Una vez que veas en la consola:

```
visual-creativa-backend  | 🚀 Servidor corriendo en http://localhost:3001
visual-creativa-frontend | ➜  Local:   http://localhost:5173/
```

Abre tu navegador en: **http://localhost:5173**

**Credenciales de prueba:**
- Admin: `admin@visualcreativa.com` / `Admin123!`
- User1: `user1@visualcreativa.com` / `User123!`
- User2: `user2@visualcreativa.com` / `User123!`

---

## 🛑 Detener los Servicios

Para detener todo:

```powershell
# Presiona Ctrl+C en la terminal donde corre docker-compose

# O desde otra terminal:
docker-compose down
```

---

## 🔄 Reiniciar los Servicios

```powershell
# Iniciar de nuevo
docker-compose up

# O en segundo plano (detached mode)
docker-compose up -d

# Ver logs
docker-compose logs -f
```

---

## 🧹 Limpiar Todo (si necesitas empezar de cero)

```powershell
# Detener y eliminar contenedores, redes y volúmenes
docker-compose down -v

# Volver a iniciar
docker-compose up
```

---

## ❌ Troubleshooting

### Error: "Docker daemon is not running"
- Abre Docker Desktop desde el menú de inicio
- Espera a que el ícono de la ballena aparezca en la barra de tareas

### Error: "Port 5432 is already in use"
- Tienes PostgreSQL instalado localmente corriendo en ese puerto
- Opción 1: Detén PostgreSQL local
- Opción 2: Cambia el puerto en docker-compose.yml

### Error: "WSL 2 installation is incomplete"
- Ejecuta en PowerShell como Administrador:
  ```powershell
  wsl --install
  ```
- Reinicia tu PC

### Los contenedores no inician
```powershell
# Ver logs de errores
docker-compose logs

# Reconstruir contenedores
docker-compose up --build
```

---

## 📊 Comandos Útiles

```powershell
# Ver contenedores corriendo
docker ps

# Ver logs de un servicio específico
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres

# Entrar a un contenedor
docker exec -it visual-creativa-backend sh

# Ver base de datos con Prisma Studio
docker exec -it visual-creativa-backend npx prisma studio
```

---

## ✅ Ventajas de Docker

- ✅ No necesitas instalar PostgreSQL
- ✅ No necesitas instalar Node.js
- ✅ Todo está aislado y no afecta tu sistema
- ✅ Un solo comando para levantar todo
- ✅ Fácil de limpiar y reiniciar
- ✅ Mismo entorno en cualquier máquina

---

## 🎯 Siguiente Paso

Una vez que Docker Desktop esté instalado y corriendo, ejecuta:

```powershell
docker-compose up
```

Y accede a http://localhost:5173 para ver la aplicación funcionando.
