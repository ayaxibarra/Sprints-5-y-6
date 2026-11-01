# 🪑 Mueblería Jota — Plataforma Web MERN

Aplicación web integral para la exhibición, comercialización y gestión de muebles de diseño artesanal. El proyecto forma parte del desarrollo de los Sprints 5 y 6, implementando una arquitectura desacoplada full stack basada en el stack **MERN** (MongoDB, Express, React y Node.js) con un catálogo dinámico y un panel de administración con operaciones CRUD completas.

> 🚀 **Sitio web en vivo (Frontend):** [https://incredible-seahorse-a143a5.netlify.app](https://incredible-seahorse-a143a5.netlify.app)  
> 🔌 **API REST en vivo (Backend):** [https://sprints-5-y-6.onrender.com](https://sprints-5-y-6.onrender.com) (Salud: [`/api/health`](https://sprints-5-y-6.onrender.com/api/health) · Productos: [`/api/productos`](https://sprints-5-y-6.onrender.com/api/productos))

---

## 📋 Tabla de Contenidos

1. [Descripción del Proyecto](#-descripción-del-proyecto)
2. [Tecnologías Utilizadas](#-tecnologías-utilizadas)
3. [Arquitectura del Sistema](#-arquitectura-del-sistema)
4. [Estructura del Proyecto](#-estructura-del-proyecto)
5. [Funcionalidades Implementadas](#-funcionalidades-implementadas)
6. [API REST y Endpoints](#-api-rest-y-endpoints)
7. [Requisitos Previos](#-requisitos-previos)
8. [Configuración de Variables de Entorno](#-configuración-de-variables-de-entorno)
9. [Instalación y Ejecución Local](#-instalación-y-ejecución-local)
10. [Visualización de Datos con MongoDB Compass](#-visualización-de-datos-con-mongodb-compass)
11. [Estado del Despliegue](#-estado-del-despliegue)
12. [Equipo y Créditos](#-equipo-y-créditos)

---

## 📖 Descripción del Proyecto

**Mueblería Jota** (también identificada en la experiencia de marca como *Hermanos Jota*) es una plataforma de comercio electrónico orientada a la venta de mobiliario artesanal de alta gama.

El objetivo principal de la aplicación es brindar:
- A los **usuarios y clientes**: una experiencia visual atractiva, intuitiva y accesible para explorar el catálogo de muebles, filtrar y ordenar productos, consultar fichas técnicas detalladas, gestionar un carrito de compras y validar consultas de contacto.
- A los **administradores**: un panel de control centralizado para dar de alta nuevos productos, consultar el inventario existente, editar información comercial (precios, stock, imágenes y descripciones) y eliminar productos con confirmación.

---

## 🛠 Tecnologías Utilizadas

Las versiones listadas corresponden a las dependencias declaradas en los archivos `package.json` del proyecto.

### Backend (Servidor de API)
| Tecnología | Versión | Propósito |
| :--- | :--- | :--- |
| **Node.js** | `>= 18.0.0` | Entorno de ejecución en el servidor (CommonJS) |
| **Express** | `^5.3.0` | Framework web y enrutamiento para la API REST |
| **Mongoose** | `^9.11.4` | ODM para modelado y validación de esquemas en MongoDB |
| **CORS** | `^2.8.6` | Middleware para gestión de Cross-Origin Resource Sharing |
| **Dotenv** | `^18.0.9` | Carga de variables de entorno desde archivos `.env` |
| **Nodemon** | `^3.1.14` | Herramienta de desarrollo para reinicio automático del servidor |

### Frontend (Cliente Web)
| Tecnología | Versión | Propósito |
| :--- | :--- | :--- |
| **React** | `^19.3.1` | Biblioteca declarativa para interfaces de usuario (ES Modules) |
| **React DOM** | `^19.3.1` | Renderizado para el navegador web |
| **Vite** | `^8.3.5` | Bundler y servidor de desarrollo ultra-rápido con HMR |
| **React Router DOM** | `^7.18.5` | Enrutamiento del lado del cliente (SPA) |
| **Fetch API** | Nativa | Cliente HTTP nativo del navegador utilizado en `productService.js` |
| **ESLint** | `^10.13.0` | Linter de código con soporte para React Hooks |
| **CSS3** | Nativo | Estilos globales, variables de diseño y CSS Modules |

### Persistencia y Base de Datos
| Tecnología | Propósito |
| :--- | :--- |
| **MongoDB Atlas** | Base de datos NoSQL multicloud alojada en la nube |
| **MongoDB Compass** | Interfaz gráfica oficial para administración, consulta e inspección |

> [!NOTE]
> El frontend no utiliza librerías externas de peticiones como Axios; las llamadas HTTP están centralizadas mediante la API nativa `fetch` en el servicio `src/services/productService.js`.

---

## 🏛 Arquitectura del Sistema

El proyecto implementa una arquitectura desacoplada cliente-servidor:

```
┌────────────────────────────────────────────────────────┐
│               React SPA (Frontend / Vite)              │
│  - Vistas Públicas (Home, ProductList, ProductDetail) │
│  - Vistas Admin (AdminProductos, Create, Edit)        │
│  - Custom Hooks (useProducts, useProduct)              │
│  - Adaptador de Datos (aVistaPublica / utils)          │
└───────────────────────────▲────────────────────────────┘
                            │
               HTTP / JSON (REST Requests)
                            │
┌───────────────────────────▼────────────────────────────┐
│              Express API (Backend / Node.js)           │
│  - Enrutamiento (/api/productos, /api/health)          │
│  - Controladores con manejo de errores centralizado    │
│  - Middleware de CORS y parseo de JSON                 │
└───────────────────────────▲────────────────────────────┘
                            │
               Mongoose ODM (Schema & Validation)
                            │
┌───────────────────────────▼────────────────────────────┐
│            MongoDB Atlas (Base de Datos NoSQL)         │
│  - Colección: "products" (Documentos BSON)             │
│  - Gestión gráfica opcional: MongoDB Compass           │
└────────────────────────────────────────────────────────┘
```

### Flujo de Datos y Transformación
1. **Frontend Público**: Para mantener compatibilidad con las especificaciones visuales previas, las páginas públicas utilizan propiedades en inglés (`id`, `name`, `desc`, `price`, `img`), las cuales son transformadas desde los documentos de la API mediante la función adaptadora `aVistaPublica` (`client/src/utils/producto.js`).
2. **Frontend Administrativo**: Las pantallas de administración (`AdminProductos`, `ProductForm`, `CreateProduct`, `EditProduct`) consumen directamente los nombres de campos en español definidos en el modelo Mongoose (`nombre`, `descripcion`, `precio`, `stock`, `imagenUrl`).
3. **Servicio Centralizado**: Toda solicitud HTTP pasa por `client/src/services/productService.js`, garantizando control de errores, soporte para cancelación mediante `AbortController`, normalización de respuestas y validación de identificadores ObjectId antes de despachar peticiones.

---

## 📂 Estructura del Proyecto

El repositorio está organizado con el backend y el cliente en carpetas independientes:

```plaintext
Sprints-5-y-6/
├── backend/                         # Servidor API REST (Node.js + Express)
│   ├── config/                      # Conexión a MongoDB Atlas (db.js)
│   ├── controllers/                 # Controladores CRUD de productos
│   ├── models/                      # Esquema Mongoose (Product.js)
│   ├── routes/                      # Enrutador Express (/api/productos)
│   ├── .env                         # Variables de entorno locales (no versionadas)
│   ├── index.js                     # Punto de entrada del servidor
│   └── package.json                 # Dependencias del servidor
│
├── client/                          # Aplicación Frontend SPA (React 19 + Vite)
│   ├── public/                      # Assets estáticos (imágenes, logos, íconos, _redirects)
│   ├── src/
│   │   ├── components/              # Componentes UI (Navbar, Footer, ProductForm, Cart)
│   │   ├── hooks/                   # Custom Hooks (useProducts, useProduct)
│   │   ├── pages/                   # Vistas (Home, ProductList, ProductDetail, Admin)
│   │   ├── services/                # Servicio centralizado de API (productService.js)
│   │   ├── utils/                   # Utilidades puras (carrito, precios, imágenes)
│   │   ├── App.jsx                  # Enrutador principal y estado del carrito
│   │   └── main.jsx                 # Montaje en el DOM
│   ├── .env                         # Variables de entorno locales (no versionadas)
│   ├── .env.example                 # Plantilla de variables de entorno del cliente
│   ├── index.html                   # HTML base de Vite
│   └── package.json                 # Dependencias del cliente
│
├── postman/                         # Colecciones, especificaciones y skills de Postman
├── .gitignore                       # Exclusiones de Git (node_modules, .env, dist, etc.)
└── README.md                        # Documentación principal del proyecto
```

---

## ⚡ Funcionalidades Implementadas

### Experiencia Pública (Cliente)
- **Página de Inicio (`Home.jsx`)**: Hero banner promocional, selección de productos destacados, presentación del programa institucional "Herencia Viva" y sección de opiniones/testimonios.
- **Catálogo de Muebles (`ProductList.jsx`)**:
  - Obtención de productos en tiempo real desde la API.
  - Barra de búsqueda interactiva por nombre (insensible a tildes y mayúsculas).
  - Ordenamiento dinámico: Precio (Menor a Mayor / Mayor a Menor) y Más recientes.
  - Indicadores de estado: cargando (`loader`), catálogo vacío, error de conexión con botón de reintento.
- **Detalle de Producto (`ProductDetail.jsx`)**:
  - Consulta del documento por ID extraído del parámetro de ruta `/productos/:id`.
  - Visualización de fotografía, nombre, descripción, precio en moneda local (ARS) y control de stock.
  - Manejo de estados de carga, producto inexistente (404) y fallos de servidor con reintento selectivo.
- **Carrito de Compras (`Cart.jsx`)**:
  - Control de unidades añadidas, cálculo de subtotales por producto y total general.
  - Capacidad de quitar elementos y visualización sincronizada en el badge del Navbar.
- **Formulario de Contacto (`Contact.jsx`)**:
  - Validación de campos en tiempo real (nombre, email válido, asunto y mensaje).
  - Gestión accesible de errores con atributos `aria-invalid` y `aria-describedby`.

### Panel de Administración (Gestión de Inventario)
- **Listado y Búsqueda Administrativa (`AdminProductos.jsx`)**:
  - Tabla completa con miniatura de imagen, nombre, precio, stock disponible (con badge de agotado) y acciones.
  - Filtrado en tiempo real por nombre de producto.
  - Mensajes de confirmación temporizados al crear, editar o eliminar registros.
- **Creación de Productos (`CreateProduct.jsx` + `ProductForm.jsx`)**:
  - Formulario con validación de longitud de nombre (2 a 100 caracteres), descripción (hasta 1000 caracteres), precio positivo y stock entero.
  - Previsualización dinámica de la imagen según la URL o ruta local ingresada.
- **Edición de Productos (`EditProduct.jsx`)**:
  - Carga previa de los valores del producto a editar mediante su identificador.
  - Actualización en MongoDB mediante petición `PUT`.
- **Eliminación Segura**:
  - Mecanismo de confirmación en dos pasos antes de ejecutar la eliminación física del documento en la base de datos.

---

## 🔌 API REST y Endpoints

La API responde en formato JSON y expone los siguientes endpoints:

| Método | Endpoint | Descripción | Códigos HTTP |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Verifica la salud del servidor y el estado de la conexión a MongoDB | `200` |
| `GET` | `/api/productos` | Obtiene el listado completo de productos registrados | `200`, `400` |
| `GET` | `/api/productos/:id` | Obtiene el detalle de un producto específico según su ObjectId | `200`, `404`, `400` |
| `POST` | `/api/productos` | Crea un nuevo producto validando el esquema en MongoDB | `201`, `400` |
| `PUT` | `/api/productos/:id` | Modifica los campos de un producto existente y revalida reglas | `200`, `404`, `400` |
| `DELETE` | `/api/productos/:id` | Elimina definitivamente un producto de la colección | `200`, `404`, `400` |

### Estructura del Documento (`Product`)
```json
{
  "_id": "67b9a5f1e8a2c410d9f00123",
  "nombre": "Aparador Uspallata",
  "descripcion": "Aparador artesanal fabricado en madera maciza de petiribí con terminación natural.",
  "precio": 385000,
  "stock": 4,
  "imagenUrl": "img/Aparador Uspallata.png",
  "createdAt": "2026-02-22T10:15:00.000Z",
  "updatedAt": "2026-02-22T10:15:00.000Z"
}
```

---

## 💻 Requisitos Previos

Antes de ejecutar la aplicación, asegúrate de tener instalado en tu sistema:

1. **Node.js** (versión LTS 18.x o superior):  
   🔗 [Descargar Node.js](https://nodejs.org/)
2. **npm** (gestor de paquetes incluido con Node.js).
3. **Cuenta en MongoDB Atlas** (base de datos en la nube):  
   🔗 [MongoDB Atlas Database](https://www.mongodb.com/products/platform/atlas-database)
4. **MongoDB Compass** (interfaz gráfica para administración de MongoDB):  
   🔗 [Descargar MongoDB Compass](https://www.mongodb.com/products/tools/compass)

### Instalación y Uso de MongoDB Compass en Windows
MongoDB Compass es una herramienta gráfica oficial para explorar e interactuar con tus datos en MongoDB Atlas sin necesidad de instalar o iniciar un servicio de MongoDB local.

1. Accede al sitio oficial de [MongoDB Compass](https://www.mongodb.com/try/download/community).
2. Selecciona la versión recomendada para tu sistema operativo (**Windows (64-bit)**) en formato ejecutable o instalador `.exe`.
3. Ejecuta el archivo descargado y sigue los pasos del asistente de instalación.
4. Selecciona Setup Type **Complete**.
5. Tilda **Install MongoDB As a Service**.
6. Tilda **Install MongoDB Compass**.
7. Descarga `mongosh` aparte mediante su instalador oficial o usando en PowerShell/CMD como administrador:
   ```powershell
   winget install MongoDB.Shell
   ```
8. Abre **MongoDB Compass** desde el menú de inicio.
9. En la pantalla principal, copia la cadena de conexión URI proporcionada por tu clúster de MongoDB Atlas y pégala en el campo **New Connection**.
10. Haz clic en el botón **Connect**.

---

## 🔐 Configuración de Variables de Entorno

> [!WARNING]
> **¿Por qué los archivos `.env` están en `.gitignore`?**  
> Por estándares de seguridad universales (OWASP y 12-Factor App), los archivos `.env` nunca deben subirse a GitHub, ya que contienen credenciales privadas (como usuario y contraseña de MongoDB Atlas). Si alguien clona este proyecto, debe crear sus archivos `.env` siguiendo las indicaciones a continuación.

El proyecto requiere dos archivos `.env` independientes: uno en el **backend** y otro en el **cliente** (`client/`).

### 1. Backend (`backend/.env`)
Crea un archivo llamado `.env` dentro de la carpeta `backend/` (`Sprints-5-y-6/backend/.env`):

```env
# Puerto en el que se ejecutará el servidor Express local
PORT=3000

# Cadena de conexión obligatoria a tu clúster de MongoDB Atlas (reemplaza credenciales y clúster)
MONGODB_URI=mongodb+srv://<USUARIO>:<PASSWORD>@<TU-CLUSTER>.mongodb.net/<NOMBRE_DB>?retryWrites=true&w=majority

# URL permitida por CORS (origen del frontend local o de producción)
FRONTEND_URL=http://localhost:5173
```

- `PORT`: Puerto de escucha local (por defecto `3000`).
- `MONGODB_URI`: Cadena obligatoria de conexión a MongoDB Atlas. Si no se define, el backend no iniciará.
- `FRONTEND_URL`: Origen permitido para solicitudes web del frontend (en producción en Render se configura como `https://incredible-seahorse-a143a5.netlify.app`).

### 2. Frontend (`client/.env`)
Crea un archivo llamado `.env` dentro de la carpeta `client/` (`Sprints-5-y-6/client/.env`). Tienes dos alternativas según lo que desees hacer:

#### Opción A: Conectar con tu Backend Local (Desarrollo completo)
Si vas a levantar el servidor Express en tu máquina en el puerto 3000:
```env
VITE_API_URL=http://localhost:3000
```

#### Opción B: Conectar directamente con la API en Producción (Render)
Si solo quieres probar el cliente frontend sin tener que levantar el backend local ni configurar credenciales de MongoDB:
```env
VITE_API_URL=https://sprints-5-y-6.onrender.com
```

> [!TIP]
> `VITE_API_URL` se debe colocar **sin barra `/` al final** y **sin `/api`**, ya que el servicio `productService.js` añade automáticamente `/api/productos`.

---

## 🚀 Instalación y Ejecución Local

Para levantar el proyecto en un entorno local de desarrollo, es fundamental seguir el orden: **iniciar primero el backend y luego el frontend**, utilizando dos terminales independientes.

### Terminal 1 — Backend (Servidor de API)

1. Abre una terminal y dirígete a la carpeta `backend`:
   ```bash
   cd Sprints-5-y-6/backend
   ```
2. Instala las dependencias del backend:
   ```bash
   npm install
   ```
3. Verifica que el archivo `backend/.env` contenga tu variable `MONGODB_URI` válida.
4. Inicia el servidor en modo desarrollo:
   ```bash
   npm run dev
   ```
   *(También puedes utilizar `npm start` para ejecutar mediante `node index.js`).*

5. **Verificación de éxito:** La consola debe mostrar los siguientes mensajes:
   ```
   MongoDB conectado correctamente: <NOMBRE_DB>
   Servidor iniciado en http://localhost:3000
   ```
   *Puedes comprobar que el servicio está activo abriendo en tu navegador:* `http://localhost:3000/api/health`

---

### Terminal 2 — Frontend (Cliente React)

1. Abre una segunda ventana de terminal y navega hasta la carpeta `client`:
   ```bash
   cd Sprints-5-y-6/client
   ```
2. Instala las dependencias del cliente:
   ```bash
   npm install
   ```
3. Verifica que `client/.env` contenga `VITE_API_URL=http://localhost:3000`.
4. Inicia el servidor de desarrollo de Vite:
   ```bash
   npm run dev
   ```
5. **Verificación de éxito:** La consola indicará que Vite está listo:
   ```
     VITE v8.3.5  ready in ... ms

     ➜  Local:   http://localhost:5173/
     ➜  Network: use --host to expose
   ```
6. Abre en tu navegador `http://localhost:5173/` para comenzar a interactuar con la tienda.

> [!IMPORTANT]
> Recuerda mantener **ambas terminales en ejecución simultánea**. Si detienes la terminal del backend, el frontend mostrará mensajes de error de conexión.

---

## 🔍 Visualización de Datos con MongoDB Compass

Para verificar la persistencia y manipulación de datos desde la interfaz de MongoDB Compass:

1. Inicia **MongoDB Compass**.
2. Conéctate ingresando tu URI de MongoDB Atlas y haz clic en **Connect**.
3. En el panel izquierdo de navegación, localiza la base de datos indicada en tu URI de conexión.
4. Haz clic sobre la colección **`products`** (nombre generado automáticamente por Mongoose a partir del modelo `Product`).
5. En la pestaña **Documents**, podrás ver todos los productos guardados.
6. Realiza una prueba desde la aplicación:
   - Dirígete en el navegador a `/admin/crear-producto` (en local `http://localhost:5173/admin/crear-producto` o en producción en `https://incredible-seahorse-a143a5.netlify.app/admin/crear-producto`).
   - Completa el formulario y presiona **Crear producto**.
   - En MongoDB Compass, pulsa el botón **Refresh (ícono de recarga)** y confirma que el nuevo documento aparece con su `_id` generado.
   - De igual manera, prueba editar o eliminar registros y verifica los cambios en Compass.
   - También puedes utilizar Postman para probar los métodos `GET` / `POST` / `PUT` / `DELETE` probando tanto en `http://localhost:3000/api/productos` como en la URL de producción `https://sprints-5-y-6.onrender.com/api/productos`.

---

## 🌐 Estado del Despliegue

El proyecto se encuentra **desplegado y en producción**:

| Componente | Plataforma | Estado | Enlace en Vivo | Observaciones |
| :--- | :--- | :---: | :--- | :--- |
| **Frontend** | **Netlify** | 🟢 **Activo** | [https://incredible-seahorse-a143a5.netlify.app](https://incredible-seahorse-a143a5.netlify.app) | Single Page Application (React 19 + Vite) con redirecciones SPA configuradas (`_redirects`). |
| **Backend** | **Render** | 🟢 **Activo** | [https://sprints-5-y-6.onrender.com](https://sprints-5-y-6.onrender.com) | Web Service en Node.js + Express conectado a MongoDB Atlas. Ruta de salud: [`/api/health`](https://sprints-5-y-6.onrender.com/api/health). |
| **Base de Datos** | **MongoDB Atlas** | 🟢 **Conectado** | Nube (Atlas Cluster) | Persistencia de datos en la nube con acceso restringido y seguro mediante `MONGODB_URI`. |

---

## 👥 Equipo y Créditos

Proyecto desarrollado como parte de las entregas académicas de los Sprints 5 y 6 para el Curso Fullstack en ITBA.

- **Proyecto**: Mueblería Jota / Hermanos Jota
- **Integrantes**: Ayax Ibarra - Franco Lepera - Daiana Pereyra - Micaela Perez - Franco Gil
