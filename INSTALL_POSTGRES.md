# Instalación de PostgreSQL en Windows

## Opción 1: PostgreSQL Portable (Más Rápido - Recomendado)

Si quieres algo rápido sin instalación completa, puedes usar una versión portable o usar un servicio en la nube gratuito.

### Usar Supabase (Gratis, Sin Instalación)

1. Ve a https://supabase.com
2. Crea una cuenta gratis
3. Crea un nuevo proyecto
4. Copia la "Connection String" (URI de conexión)
5. Pégala en `backend/.env` en la variable `DATABASE_URL`

**Ventaja:** No necesitas instalar nada, funciona inmediatamente.

---

## Opción 2: Instalar PostgreSQL Localmente

### Descarga e Instalación

1. **Descargar PostgreSQL:**
   - Ve a: https://www.postgresql.org/download/windows/
   - Descarga el instalador (PostgreSQL 15 o 16)
   - O descarga directamente: https://www.enterprisedb.com/downloads/postgres-postgresql-downloads

2. **Ejecutar el Instalador:**
   - Ejecuta el archivo descargado
   - Click en "Next"
   - Deja el directorio por defecto
   - Selecciona todos los componentes
   - Deja el puerto **5432** (importante)
   - Establece la contraseña para el usuario `postgres`: **postgres**
   - Deja el locale por defecto
   - Click en "Next" hasta finalizar

3. **Verificar Instalación:**
   ```powershell
   # Verifica que el servicio esté corriendo
   Get-Service -Name postgresql*
   
   # Deberías ver algo como:
   # Status   Name               DisplayName
   # ------   ----               -----------
   # Running  postgresql-x64-15  postgresql-x64-15 - PostgreSQL Server 15
   ```

4. **Crear la Base de Datos:**
   ```powershell
   # Abre PowerShell como Administrador y ejecuta:
   
   # Conectar a PostgreSQL (te pedirá la contraseña: postgres)
   psql -U postgres
   
   # Dentro de psql, ejecuta:
   CREATE DATABASE visual_creativa_crm;
   
   # Verifica que se creó:
   \l
   
   # Sal de psql:
   \q
   ```

5. **Configurar Backend:**
   
   El archivo `backend/.env` ya está creado con:
   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/visual_creativa_crm?schema=public"
   ```
   
   Si usaste una contraseña diferente, ajusta la URL.

---

## Opción 3: Usar Docker Desktop (Si quieres aprender Docker)

1. **Instalar Docker Desktop:**
   - Descarga: https://www.docker.com/products/docker-desktop/
   - Instala y reinicia tu PC
   - Abre Docker Desktop

2. **Levantar PostgreSQL:**
   ```powershell
   docker run --name visual-creativa-db `
     -e POSTGRES_PASSWORD=postgres `
     -e POSTGRES_DB=visual_creativa_crm `
     -p 5432:5432 `
     -d postgres:15-alpine
   ```

3. **Verificar:**
   ```powershell
   docker ps
   ```

---

## ¿Cuál Opción Elegir?

- **¿Quieres lo más rápido?** → Opción 1 (Supabase)
- **¿Quieres tenerlo local?** → Opción 2 (PostgreSQL instalado)
- **¿Ya usas Docker?** → Opción 3 (Docker)

---

## Siguiente Paso

Una vez que tengas PostgreSQL funcionando (cualquier opción), continúa con:

```powershell
# Desde la carpeta backend
cd backend

# Ejecutar migraciones
npm run migrate

# Poblar base de datos
npm run seed

# Iniciar servidor
npm run dev
```

Luego en otra terminal:

```powershell
# Desde la carpeta frontend
cd frontend

# Iniciar app
npm run dev
```

Accede a http://localhost:5173
