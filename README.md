# 🍕 Food Store - TPI Parcial 1

Aplicación de comercio electrónico frontend desarrollada para el Primer Parcial de la materia **Programación III** — Tecnicatura Universitaria en Programación (**UTN**).

**Autor:** Víctor Manuel Barroeta Almedo

Este proyecto es una Single Page Application (SPA) simulada, construida con Vite y TypeScript, enfocada en la manipulación dinámica del DOM, el uso avanzado de `localStorage` para persistencia de datos y la gestión de roles de usuario, cumpliendo con los estándares y requerimientos de la cátedra.

---

## 🚀 Funcionalidades Implementadas

### 🔒 Autenticación y Seguridad
- **Protección de rutas:** Sistema de redirección basado en roles (`admin` y `client`) para evitar accesos no autorizados a las distintas vistas.
- **Login y Registro:** Validación de usuarios utilizando una base de datos simulada en `localStorage`. 

### 🛍️ Catálogo de Productos (Store)
- **Renderizado dinámico:** Los productos se inyectan en el DOM desde arreglos tipados (`Product[]`).
- **Búsqueda en tiempo real:** Filtrado de productos por nombre (HU-P1-01).
- **Filtrado por categorías:** Menú lateral dinámico que permite aislar productos según su categoría usando el método `.some()` (HU-P1-02).

### 🛒 Carrito de Compras
- **Persistencia local:** Los ítems agregados se guardan en `localStorage` (HU-P1-03).
- **Gestión inteligente de cantidades:** Si un producto ya existe en el carrito, se suma la cantidad en lugar de duplicar la tarjeta de producto.
- **Cálculo de totales:** Muestra subtotales por producto y un total general usando `.reduce()` (HU-P1-04 y HU-P1-05).
- **Eliminación individual o total** de los ítems del carrito.

### ⚙️ Panel de Administración
- **Renderizado condicional:** El botón de acceso al panel solo es visible si el usuario tiene rol `admin`.
- **Gestión de Inventario:** Tabla dinámica para visualizar el stock.
- **Creación de productos con imágenes:** Uso de la API `FileReader` para convertir imágenes locales a formato **Base64** y previsualizarlas antes de guardarlas en memoria.
- **Edición y Eliminación:** Uso de *Delegación de Eventos* para optimizar el rendimiento al modificar o borrar filas de la tabla.

### 🔔 Interfaz de Usuario (UX)
- **Notificaciones Toast Custom:** Se eliminaron los `alert()` nativos para reemplazarlos por notificaciones emergentes creadas con CSS y TS puro, mejorando la inmersión del usuario.
- **Scroll automático:** Desplazamiento inteligente hacia el formulario al querer editar o crear un producto nuevo.

---

## 🛠️ Tecnologías utilizadas

- **HTML5 & CSS3** (Implementación de Variables CSS y Flexbox/Grid)
- **TypeScript** (Tipado estricto, Interfaces)
- **Vite** (Bundler y entorno de desarrollo rápido)
> *Nota: No se utilizaron frameworks ni librerías externas (React, Angular, Bootstrap, etc.) por requerimiento del Trabajo Práctico.*

---

## 💻 Instalación y ejecución

### Requisitos previos
- [Node.js](https://nodejs.org/) (v18 o superior)
- [pnpm](https://pnpm.io/) — gestor de paquetes utilizado en este proyecto.

### Pasos

```bash
# 1. Clonar el repositorio
git clone [https://github.com/victormbar/TPI_Parcial1_VictorBarroeta]

cd TPI_Parcial1_VictorBarroeta

# 2. Instalar dependencias
pnpm install

# 3. Iniciar el servidor de desarrollo
pnpm dev
```

La aplicación estará disponible en `http://localhost:5173`.

### Credenciales de prueba

Podés registrarte desde la pantalla de inicio o usar una cuenta ya creada:

| Rol    | Email                  | Contraseña |
|--------|------------------------|------------|
| Admin  | admin@admin.com        | admin2803  |
| Client | test@test.com          | test1234   |

---

## 📁 Estructura del Proyecto

```
src/
├── data/
│     └── data.ts            ← Base de datos fija inicial
├── pages/
│   ├── store/
│   │   ├── home/
│   │   │   ├── home.html   ← Catálogo principal
│   │   │   └── home.ts     ← Lógica: render, búsqueda, filtros
│   │   └── cart/
│   │       ├── cart.html   ← Vista del carrito
│   │       └── cart.ts     ← Lógica: cálculos, persistencia
│   ├── auth/
│   │   ├── login/          ← Inicio de sesión
│   │   └── registro/       ← Creación de clientes
│   └── admin/home			  ← Panel CRUD
│       ├── home.html       ← Vista del panel admin
│       └── home.ts         ← Lógica: agregador, edición, eliminado
├── types/
│   ├── product.ts          ← Interfaces Product y CartItem
│   └── category.ts         ← Interface ICategory
├── utils/
│   ├── auth.ts             ← Protección de rutas
│   ├── localStorage.ts     ← Helpers de lectura/escritura
│   ├── navigate.ts         ← Lógica de enrutamiento
│   └── toast.ts            ← Sistema de notificaciones custom
public/
├── assets/			     ← Imágenes del catalogo
└── css/
    ├── styles.css          ← Hoja de estilos centralizada global
    └── login.css			 ← Hoja de estilos del login y registro
    └── admin.css			 ← Hoja de estilos del panel admin

```
