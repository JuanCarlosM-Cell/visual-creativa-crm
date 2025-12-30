# Plan de Despliegue - Visual Creativa CRM

Este documento describe el plan recomendado para desplegar Visual Creativa CRM en producción.

## 🎯 Arquitectura Recomendada

### Opción 1: Vercel + Render (Recomendado)

- **Frontend:** Vercel
- **Backend:** Render
- **Base de datos:** Render PostgreSQL (o Supabase/Neon)

### Opción 2: Railway (Todo en uno)

- **Frontend, Backend y DB:** Railway

### Opción 3: Netlify + Railway

- **Frontend:** Netlify
- **Backend + DB:** Railway

---

## 📋 Preparación Previa

### 1. Repositorio Git

Asegúrate de que tu código esté en un repositorio Git (GitHub, GitLab, Bitbucket):

```bash
git init
git add .
git commit -m "Initial commit - Visual Creativa CRM"
git remote add origin <your-repo-url>
git push -u origin main
```

### 2. Variables de Entorno

Prepara las siguientes variables de entorno:

**Backend:**
- `DATABASE_URL` - URL de conexión a PostgreSQL
- `JWT_SECRET` - Secreto para JWT (genera uno seguro)
- `PORT` - Puerto (usualmente 3001 o el que asigne el servicio)
- `NODE_ENV` - "production"
- `FRONTEND_URL` - URL del frontend desplegado

**Frontend:**
- `VITE_API_URL` - URL del backend desplegado

---

## 🚀 Opción 1: Vercel + Render (RECOMENDADO)

### Paso 1: Desplegar Base de Datos en Render

1. Ve a [render.com](https://render.com) y crea una cuenta
2. Click en "New +" → "PostgreSQL"
3. Configura:
   - **Name:** visual-creativa-db
   - **Database:** visual_creativa_crm
   - **User:** (generado automáticamente)
   - **Region:** Elige la más cercana
   - **Plan:** Free (para pruebas) o Starter
4. Click en "Create Database"
5. **Guarda la "Internal Database URL"** - la necesitarás para el backend

### Paso 2: Desplegar Backend en Render

1. En Render, click en "New +" → "Web Service"
2. Conecta tu repositorio Git
3. Configura:
   - **Name:** visual-creativa-backend
   - **Root Directory:** `backend`
   - **Environment:** Node
   - **Build Command:** `npm install && npx prisma generate && npm run build`
   - **Start Command:** `npx prisma migrate deploy && npm start`
   - **Plan:** Free (para pruebas) o Starter

4. Agrega las variables de entorno:
   ```
   DATABASE_URL=<internal-database-url-from-step-1>
   JWT_SECRET=<genera-un-secreto-seguro-aqui>
   NODE_ENV=production
   FRONTEND_URL=https://tu-app.vercel.app
   ```

5. Click en "Create Web Service"
6. **Guarda la URL del backend** (ej: `https://visual-creativa-backend.onrender.com`)

### Paso 3: Poblar Base de Datos

Una vez desplegado el backend, ejecuta el seed:

1. En Render, ve a tu servicio backend
2. Click en "Shell" (en el menú lateral)
3. Ejecuta:
   ```bash
   npm run seed
   ```

### Paso 4: Desplegar Frontend en Vercel

1. Ve a [vercel.com](https://vercel.com) y crea una cuenta
2. Click en "Add New..." → "Project"
3. Importa tu repositorio Git
4. Configura:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

5. Agrega la variable de entorno:
   ```
   VITE_API_URL=<url-del-backend-from-step-2>
   ```

6. Click en "Deploy"
7. **Guarda la URL del frontend** (ej: `https://visual-creativa.vercel.app`)

### Paso 5: Actualizar CORS en Backend

1. Ve a Render → Tu servicio backend → Environment
2. Actualiza `FRONTEND_URL` con la URL real de Vercel
3. El backend se redesplegar automáticamente

---

## 🚂 Opción 2: Railway (Todo en uno)

### Paso 1: Crear Proyecto en Railway

1. Ve a [railway.app](https://railway.app) y crea una cuenta
2. Click en "New Project"
3. Selecciona "Deploy from GitHub repo"
4. Conecta tu repositorio

### Paso 2: Agregar PostgreSQL

1. En tu proyecto, click en "+ New"
2. Selecciona "Database" → "PostgreSQL"
3. Railway creará la base de datos automáticamente
4. Copia la "DATABASE_URL" de las variables

### Paso 3: Desplegar Backend

1. Click en "+ New" → "GitHub Repo"
2. Selecciona tu repositorio
3. Configura:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install && npx prisma generate && npm run build`
   - **Start Command:** `npx prisma migrate deploy && npm start`

4. Agrega variables de entorno:
   ```
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   JWT_SECRET=<genera-un-secreto-seguro>
   NODE_ENV=production
   FRONTEND_URL=<se-agregara-despues>
   ```

5. Genera un dominio público para el backend

### Paso 4: Desplegar Frontend

1. Click en "+ New" → "GitHub Repo"
2. Selecciona tu repositorio
3. Configura:
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run preview`

4. Agrega variable de entorno:
   ```
   VITE_API_URL=<url-del-backend>
   ```

5. Genera un dominio público para el frontend

### Paso 5: Actualizar URLs

1. Actualiza `FRONTEND_URL` en el backend con la URL del frontend
2. Ejecuta seed desde el terminal de Railway

---

## ✅ Checklist de Verificación Post-Despliegue

### Backend
- [ ] El healthcheck responde: `GET https://tu-backend.com/health`
- [ ] Las migraciones se ejecutaron correctamente
- [ ] El seed pobló la base de datos
- [ ] CORS permite peticiones desde el frontend
- [ ] Las variables de entorno están configuradas correctamente

### Frontend
- [ ] La aplicación carga correctamente
- [ ] El login funciona con las credenciales de prueba
- [ ] La API se conecta correctamente (verifica en DevTools → Network)
- [ ] Todas las páginas son accesibles
- [ ] El Kanban board muestra proyectos

### Base de Datos
- [ ] La conexión es estable
- [ ] Las tablas se crearon correctamente
- [ ] Los datos de seed están presentes
- [ ] Los backups están configurados (si es producción)

---

## 🔒 Seguridad en Producción

### Obligatorio antes de producción:

1. **Cambiar JWT_SECRET:**
   ```bash
   # Genera un secreto seguro
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

2. **Configurar CORS correctamente:**
   - Solo permitir el dominio del frontend
   - No usar `*` en producción

3. **Variables de entorno:**
   - Nunca commitear archivos `.env`
   - Usar secretos del servicio de hosting

4. **Base de datos:**
   - Usar conexiones SSL
   - Configurar backups automáticos
   - Limitar acceso por IP si es posible

5. **Monitoreo:**
   - Configurar logs
   - Alertas de errores
   - Monitoreo de uptime

---

## 🆘 Troubleshooting

### Error: "Cannot connect to database"
- Verifica que `DATABASE_URL` sea correcta
- Asegúrate de usar la "Internal URL" si backend y DB están en el mismo servicio
- Verifica que la DB esté corriendo

### Error: "CORS policy"
- Verifica que `FRONTEND_URL` en backend coincida con la URL real del frontend
- Asegúrate de incluir `https://` en la URL

### Error: "Module not found"
- Ejecuta `npm install` en el build command
- Verifica que `node_modules` no esté en `.gitignore` del build

### Frontend no conecta con Backend
- Verifica `VITE_API_URL` en variables de entorno del frontend
- Asegúrate de incluir `https://` en la URL
- Verifica en DevTools → Network que las peticiones vayan a la URL correcta

---

## 📊 Costos Estimados

### Opción Free (Desarrollo/Pruebas)
- **Vercel:** Free
- **Render:** Free (con limitaciones)
- **Total:** $0/mes

### Opción Starter (Producción pequeña)
- **Vercel:** Free
- **Render Web Service:** $7/mes
- **Render PostgreSQL:** $7/mes
- **Total:** ~$14/mes

### Opción Railway
- **Railway:** $5/mes + uso
- **Total:** ~$10-20/mes

---

## 📞 Soporte

Para problemas específicos de cada plataforma:
- **Vercel:** [vercel.com/docs](https://vercel.com/docs)
- **Render:** [render.com/docs](https://render.com/docs)
- **Railway:** [docs.railway.app](https://docs.railway.app)

---

## ⚠️ IMPORTANTE

**Antes de desplegar, asegúrate de:**
1. Tener el código en un repositorio Git
2. Haber probado todo localmente
3. Tener las credenciales de las cuentas de hosting
4. Haber leído este documento completo

**¿Listo para desplegar?** Sigue los pasos de la opción que elegiste y verifica cada checklist.
