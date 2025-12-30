# 🚀 Guía de Despliegue Rápido (Cheat Sheet)

Sigue estos 3 pasos exactos para subir tu CRM a internet.

## PASO 1: Subir Código a GitHub
*(Necesitas una cuenta en [github.com](https://github.com))*

1.  Crea un **Nuevo Repositorio** en GitHub (llámalo `visual-creativa-crm`).
2.  **No** marques "Add README" ni ".gitignore" (déjalo vacío).
3.  Copia los 3 comandos que te da GitHub bajo el título **"…or push an existing repository from the command line"**.
4.  Pégalos en tu terminal aquí (o usa la terminal de VS Code). Serán algo así:
    ```bash
    git remote add origin https://github.com/TU_USUARIO/visual-creativa-crm.git
    git branch -M main
    git push -u origin main
    ```

---

## PASO 2: Backend (Render.com)
*(Esto es el cerebro y la base de datos)*

1.  Crea cuenta en [render.com](https://render.com).
2.  Haz clic en **"New +" -> "Web Service"**.
3.  Selecciona tu repo de GitHub (`visual-creativa-crm`).
4.  Llena estos datos:
    *   **Name:** `visual-creativa-backend`
    *   **Root Directory:** `backend`
    *   **Build Command:** `npm install && npx prisma generate && npm run build`
    *   **Start Command:** `npm start`
    *   **Plan:** Free
5.  **IMPORTANTE:** Baja a **"Environment Variables"** y añade:
    *   `DATABASE_URL`: *(La misma de Supabase que actualizamos: `postgresql://...:6543/postgres?pgbouncer=true`)*
    *   `JWT_SECRET`: `cualquier_cosa_secreta`
    *   `EMAIL_USER`: `aquilesmt930@gmail.com`
    *   `EMAIL_PASS`: `kmiz iwga uxyy exzg`
    *   `NODE_ENV`: `production`
6.  Dale a **"Create Web Service"**.
7.  **Copia la URL que te dan** (ej: `https://visual-creativa-backend.onrender.com`).

---

## PASO 3: Frontend (Vercel)
*(Esto es lo que verán los clientes)*

1.  Crea cuenta en [vercel.com](https://vercel.com).
2.  Haz clic en **"Add New..." -> "Project"**.
3.  Importa tu repo (`visual-creativa-crm`).
4.  En **"Root Directory"**, dale a **Edit** y selecciona la carpeta `frontend`.
5.  En **"Environment Variables"**, añade:
    *   `VITE_API_URL`: *(Pega la URL de Render del paso anterior)*
6.  Dale a **"Deploy"**.

¡Listo! En unos minutos tu CRM estará en vivo en `https://visual-creativa-crm.vercel.app`.
