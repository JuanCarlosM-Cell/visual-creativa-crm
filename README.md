# Visual Creativa CRM

Sistema de Gestión de Proyectos y Clientes (CRM) para empresas audiovisuales creativas.

## 🚀 Stack Tecnológico

### Frontend
- **React 18** con TypeScript
- **Vite** - Build tool
- **Tailwind CSS** - Estilos modernos
- **React Router** - Navegación
- **Axios** - Cliente HTTP

### Backend
- **Node.js** + **Express** con TypeScript
- **Prisma** - ORM
- **PostgreSQL** - Base de datos
- **JWT** - Autenticación
- **Bcrypt** - Hash de contraseñas
- **Zod** - Validación de datos

## 📋 Características

- ✅ Autenticación con JWT
- ✅ Gestión de usuarios (solo admin)
- ✅ CRUD de clientes
- ✅ CRUD de proyectos con estados (Lead, Cotización, En Producción, Entregado)
- ✅ Tablero Kanban para visualizar proyectos
- ✅ Checklist de tareas por proyecto
- ✅ Links de entregables (Drive, Dropbox, Frame.io, etc.)
- ✅ Control de acceso basado en roles (admin/user)
- ✅ Interfaz moderna y oscura con gradientes

## 🛠️ Requisitos Previos

- **Node.js** 18+ y npm
- **PostgreSQL** 14+
- **Git**

## 📦 Instalación

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd CRM
```

### 2. Configurar Backend

```bash
cd backend
npm install
```

Crear archivo `.env` basado en `.env.example`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/visual_creativa_crm?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### 3. Configurar Base de Datos

```bash
# Ejecutar migraciones
npm run migrate

# Poblar con datos de prueba
npm run seed
```

### 4. Configurar Frontend

```bash
cd ../frontend
npm install
```

Crear archivo `.env` basado en `.env.example`:

```env
VITE_API_URL=http://localhost:3001
```

## 🚀 Ejecutar en Desarrollo

### Opción 1: Manualmente

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Opción 2: Con Docker Compose (Recomendado)

```bash
docker-compose up
```

Acceder a:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3001

## 👥 Cuentas de Prueba

Después de ejecutar el seed, puedes usar estas credenciales:

**Administrador:**
- Email: `admin@visualcreativa.com`
- Password: `Admin123!`

**Usuarios:**
- Email: `user1@visualcreativa.com` / Password: `User123!`
- Email: `user2@visualcreativa.com` / Password: `User123!`

## 🏗️ Estructura del Proyecto

```
CRM/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma      # Esquema de base de datos
│   │   └── seed.ts            # Datos de prueba
│   ├── src/
│   │   ├── middleware/        # Auth y error handling
│   │   ├── routes/            # Endpoints API
│   │   └── index.ts           # Servidor Express
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/        # Componentes reutilizables
│   │   ├── pages/             # Páginas de la app
│   │   ├── api.ts             # Cliente API
│   │   ├── types.ts           # Tipos TypeScript
│   │   ├── AuthContext.tsx    # Contexto de autenticación
│   │   ├── App.tsx            # Componente principal
│   │   └── main.tsx           # Entry point
│   ├── .env.example
│   └── package.json
│
├── docker-compose.yml
└── README.md
```

## 📡 API Endpoints

### Autenticación
- `POST /auth/login` - Iniciar sesión
- `GET /auth/me` - Obtener usuario actual

### Usuarios (Admin only)
- `GET /users` - Listar usuarios
- `POST /users` - Crear usuario
- `PATCH /users/:id` - Actualizar usuario
- `DELETE /users/:id` - Eliminar usuario

### Clientes
- `GET /clients` - Listar clientes
- `POST /clients` - Crear cliente
- `GET /clients/:id` - Obtener cliente
- `PATCH /clients/:id` - Actualizar cliente
- `DELETE /clients/:id` - Eliminar cliente (admin)

### Proyectos
- `GET /projects` - Listar proyectos
- `POST /projects` - Crear proyecto
- `GET /projects/:id` - Obtener proyecto
- `PATCH /projects/:id` - Actualizar proyecto
- `DELETE /projects/:id` - Eliminar proyecto (admin)
- `POST /projects/:id/tasks` - Crear tarea
- `POST /projects/:id/links` - Crear link

### Tareas
- `PATCH /tasks/:id` - Actualizar tarea
- `DELETE /tasks/:id` - Eliminar tarea

### Links
- `DELETE /links/:id` - Eliminar link

## 🔨 Comandos Útiles

### Backend
```bash
npm run dev          # Desarrollo
npm run build        # Compilar TypeScript
npm start            # Producción
npm run migrate      # Ejecutar migraciones
npm run seed         # Poblar base de datos
npm run studio       # Abrir Prisma Studio
```

### Frontend
```bash
npm run dev          # Desarrollo
npm run build        # Build de producción
npm run preview      # Preview del build
```

## 🌐 Build para Producción

### Backend
```bash
cd backend
npm run build
npm start
```

### Frontend
```bash
cd frontend
npm run build
# Los archivos estarán en dist/
```

## 🚢 Despliegue

Ver el archivo `DEPLOYMENT.md` para instrucciones detalladas de despliegue en:
- Frontend: Vercel / Netlify
- Backend: Render / Railway
- Base de datos: Supabase / Neon / Render

## 🔒 Seguridad

- ✅ Contraseñas hasheadas con bcrypt
- ✅ Autenticación JWT
- ✅ Validación de inputs con Zod
- ✅ CORS configurado
- ✅ Variables de entorno para secretos
- ✅ Control de acceso basado en roles

## 📝 Licencia

MIT

## 👨‍💻 Autor

Visual Creativa Team
