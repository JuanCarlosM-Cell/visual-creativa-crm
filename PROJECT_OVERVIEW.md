# Visual Creativa CRM - Guía Completa de Funcionamiento

¡Bienvenido a **Visual Creativa CRM**! Este documento explica detalladamente qué es, cómo funciona y qué hay "bajo el capó" de tu nuevo sistema.

## 🌟 ¿Qué es este sistema?

Es una plataforma web hecha a medida para gestionar el flujo de trabajo de tu agencia audiovisual. Su objetivo principal es organizar **Clientes** y **Proyectos** de una manera visual y eficiente, reemplazando hojas de cálculo o herramientas genéricas.

---

## 🏗️ Arquitectura: ¿Cómo está construido?

El sistema funciona con tres "piezas" principales que hablan entre sí:

### 1. El Frontend (Lo que ves)
*   **Tecnología:** React + Vite + Tailwind CSS.
*   **Función:** Es la interfaz visual. Cuando haces clic en un botón o arrastras una tarea, es el Frontend trabajando.
*   **Diseño:** Estilo "Dark Mode" con acentos neón (cian/rosa) para dar esa sensación moderna y creativa.

### 2. El Backend (El Cerebro)
*   **Tecnología:** Node.js + Express.
*   **Función:** Es el guardia de seguridad y el gestor.
    *   Verifica si tu contraseña es correcta.
    *   Decide si tienes permiso para borrar algo (¿Eres admin?).
    *   Recibe los datos del Frontend y los manda a guardar.

### 3. La Base de Datos (La Memoria)
*   **Tecnología:** PostgreSQL (vía Supabase).
*   **Función:** Aquí se guardan físicamente los datos: usuarios, contraseñas (encriptadas), nombres de clientes, tareas, etc.

---

## 🎮 Recorrido por las Funciones

### 1. El Dashboard (Tu Centro de Mando)
Al iniciar sesión, aterrizas en el **Kanban**.
*   **¿Qué es?** Una vista panorámica de todos los proyectos activos.
*   **Estados:**
    *   🟢 **Lead:** Posibles proyectos, primer contacto.
    *   🟡 **Cotización:** Presupuesto enviado, esperando aprobación.
    *   🔵 **En Producción:** El trabajo está en curso.
    *   🟣 **Entregado:** Proyecto finalizado.
*   **Acción:** Puedes ver rápidamente en qué etapa está cada trabajo.

### 2. Gestión de Clientes
*   Tienes una agenda digital de todas las empresas con las que trabajas.
*   **Ficha de Cliente:** Si entras a "Netflix", verás:
    *   Datos de contacto.
    *   **Historial:** Lista de todos los proyectos que has hecho con ellos (pasados y presentes).

### 3. Detalles de Proyecto
Es donde ocurre el trabajo diario. Cada proyecto tiene:
*   **Checklist de Tareas:** Una lista simple de "To-Do". Puedes marcar tareas como completadas o agregar nuevas sobre la marcha.
*   **Links de Entregables:** Un lugar seguro para guardar los enlaces a Drive, Dropbox, Frame.io o Vimeo. Nunca más perderás el link de la carpeta final.

### 4. Sistema de Usuarios y Roles
El sistema protege tu información con niveles de acceso:

*   **👑 Admin (Tú):**
    *   Poder absoluto.
    *   Puede crear/borrar usuarios.
    *   Puede eliminar clientes y proyectos.
*   **👤 User (Equipo):**
    *   Puede crear y editar información.
    *   Puede marcar tareas.
    *   **NO** puede borrar proyectos ni clientes (protección contra accidentes).
    *   **NO** puede acceder al panel de usuarios.

---

## 🔄 Flujo de Trabajo Típico

1.  **Llega un cliente:** Entras a "Clientes" y creas "Coca-Cola".
2.  **Piden un video:** Entras a "Coca-Cola" y creas nuevo proyecto "Comercial Navidad".
3.  **Seguimiento:** El proyecto aparece en el Dashboard como "Lead" o "Cotización".
4.  **Producción:** Cuando aceptan, cambias el estado a "En Producción".
5.  **Tareas:** Entras al proyecto y agregas tareas: "Guion", "Casting", "Rodaje".
6.  **Entrega:** Pegas el link de Frame.io en la sección "Links" y cambias el estado a "Entregado".

---

## 🛡️ Seguridad y Tecnología

*   **Autenticación:** Usamos **JWT (JSON Web Tokens)**. Es como un pasaporte digital que te da el sistema al hacer login. Dura 7 días.
*   **Encriptación:** Las contraseñas NO se guardan como texto. Se transforman en códigos imposibles de descifrar (hashing) antes de guardarse.
*   **Validación:** El sistema revisa cada dato que entra (ej. que un email tenga @, que una fecha sea válida) para evitar errores.
