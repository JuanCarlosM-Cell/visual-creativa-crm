# Guía de Ejecución Local - Visual Creativa CRM

## ✅ Estado Actual
- Backend: Dependencias instaladas ✅
- Frontend: Dependencias instaladas ✅

## 📋 Pasos para Ejecutar Localmente

### 1. Verificar PostgreSQL

Necesitas PostgreSQL corriendo en tu máquina. Verifica con:

```powershell
# Verificar si PostgreSQL está corriendo
Get-Service -Name postgresql*
```

Si no tienes PostgreSQL instalado, tienes dos opciones:

**Opción A: Instalar PostgreSQL**
- Descarga desde: https://www.postgresql.org/download/windows/
- Instala con usuario `postgres` y password `postgres`

**Opción B: Usar Docker (más fácil)**
```powershell
docker run --name visual-creativa-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=visual_creativa_crm -p 5432:5432 -d postgres:15-alpine
```

### 2. Configurar Backend

Ya creé el archivo `.env.example`. Ahora copia y ajusta:

```powershell
cd backend
copy .env.example .env
```

El archivo `.env` debe contener:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/visual_creativa_crm?schema=public"
JWT_SECRET="dev-secret-change-in-production-use-crypto-random-bytes"
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**Ajusta el DATABASE_URL si tu PostgreSQL usa credenciales diferentes.**

### 3. Ejecutar Migraciones

```powershell
# Desde la carpeta backend
npm run migrate
```

Esto creará todas las tablas en la base de datos.

### 4. Poblar Base de Datos

```powershell
npm run seed
```

Esto creará:
- 3 usuarios (1 admin, 2 users)
- 3 clientes
- 6 proyectos
- 9 tareas
- 4 links de entregables

### 5. Iniciar Backend

```powershell
npm run dev
```

Deberías ver:
```
🚀 Servidor corriendo en http://localhost:3001
📊 Entorno: development
```

### 6. Configurar Frontend (en otra terminal)

```powershell
cd frontend
copy .env.example .env
```

El archivo `.env` debe contener:
```env
VITE_API_URL=http://localhost:3001
```

### 7. Iniciar Frontend

```powershell
npm run dev
```

Deberías ver:
```
VITE v6.x.x ready in xxx ms

➜  Local:   http://localhost:5173/
```

### 8. Acceder a la Aplicación

Abre tu navegador en: **http://localhost:5173**

**Credenciales de prueba:**
- Admin: `admin@visualcreativa.com` / `Admin123!`
- User1: `user1@visualcreativa.com` / `User123!`
- User2: `user2@visualcreativa.com` / `User123!`

---

## 🧪 Qué Probar

### Como Admin:
1. Login con credenciales de admin
2. Ver Dashboard con Kanban (6 proyectos en 4 columnas)
3. Cambiar estado de proyectos desde el Kanban
4. Ir a Clientes → Ver 3 clientes
5. Crear un nuevo cliente
6. Entrar a un cliente → Crear un proyecto
7. Entrar a un proyecto → Agregar tareas y links
8. Ir a Usuarios (menú lateral) → Crear/editar/eliminar usuarios

### Como Usuario Normal:
1. Login con user1 o user2
2. Ver Dashboard (mismo que admin)
3. Gestionar clientes y proyectos
4. **NO** debería ver el menú "Usuarios"
5. **NO** debería poder eliminar clientes/proyectos

---

## ❌ Troubleshooting

### Error: "Cannot connect to database"
```powershell
# Verifica que PostgreSQL esté corriendo
Get-Service -Name postgresql*

# O si usas Docker:
docker ps | findstr visual-creativa-db
```

### Error: "Port 3001 already in use"
```powershell
# Encuentra el proceso usando el puerto
netstat -ano | findstr :3001

# Mata el proceso (reemplaza PID)
taskkill /PID <PID> /F
```

### Error: "Port 5173 already in use"
Similar al anterior, pero con puerto 5173.

### Frontend no conecta con Backend
1. Verifica que el backend esté corriendo en http://localhost:3001
2. Verifica que `.env` en frontend tenga `VITE_API_URL=http://localhost:3001`
3. Reinicia el servidor de Vite

---

## 📝 Comandos Útiles

```powershell
# Ver logs de Prisma
cd backend
npx prisma studio  # Abre interfaz visual de la DB

# Resetear base de datos
npx prisma migrate reset  # Borra todo y vuelve a crear

# Ver estructura de la DB
npx prisma db pull
```

---

## ✅ Checklist de Verificación

- [ ] PostgreSQL corriendo
- [ ] Backend: .env creado y configurado
- [ ] Backend: Migraciones ejecutadas
- [ ] Backend: Seed ejecutado
- [ ] Backend: Servidor corriendo en :3001
- [ ] Frontend: .env creado
- [ ] Frontend: Servidor corriendo en :5173
- [ ] Login funciona
- [ ] Dashboard muestra proyectos
- [ ] Kanban permite cambiar estados
- [ ] CRUD de clientes funciona
- [ ] CRUD de proyectos funciona
- [ ] Tareas y links funcionan
- [ ] Admin puede gestionar usuarios
- [ ] User NO puede gestionar usuarios

---

Una vez que todo funcione correctamente, me confirmas y procedemos con el despliegue.
