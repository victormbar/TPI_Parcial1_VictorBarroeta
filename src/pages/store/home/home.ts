import { getUSer } from "../../../utils/localStorage";
import { PRODUCTS } from "../../../data/data";
import type { Product, CartItem } from "../../../types/product";
import "../../../css/styles.css";

// Ojo: Asegúrate de exportar también 'categorias' desde data.ts si quieres renderizar el menú lateral

const mainProductos = document.getElementById("main-productos") as HTMLElement;
const formBusqueda = document.querySelector(".search-form") as HTMLFormElement;
const inputBusqueda = document.getElementById("buscarProducto") as HTMLInputElement;

// En el caso de ser administrador, podríamos agregar funcionalidades extra como editar o eliminar productos,
//  pero eso lo veremos en la sección de administración.

const navLista = document.querySelector("nav ul") as HTMLElement;

// Creamos una función para verificar si el usuario es admin y se modifica el menu de navegación con el panel admin

const verificarAdminParaNav = () => {
    const userRaw = getUSer(); // Usamos tu utilidad para obtener el usuario
    if (userRaw) {
        const user = JSON.parse(userRaw)
        // Si el usuario es admin, inyectamos el link al panel
        if (user.role === "admin") {
            const liAdmin = document.createElement("li");
            liAdmin.innerHTML = `<a href="/src/pages/admin/home/home.html" style="color: #FF6347; font-weight: bold;">⚙️ Panel Admin</a>`;
            navLista.appendChild(liAdmin); // Se agrega el nuevo item al menú de navegación
        }
    }
};

// Llamamos a la función
verificarAdminParaNav();

// Función para agregar al carrito (Persistencia)
const agregarAlCarrito = (producto: Product) => {
    // Leemos el array actual o creamos uno nuevo
    const carritoActual: CartItem[] = JSON.parse(localStorage.getItem("carrito") || "[]");
    
    // Verificamos si el producto ya está en el carrito
    const indiceExistente = carritoActual.findIndex(item => item.id === producto.id);
    
    if (indiceExistente !== -1) {
        carritoActual[indiceExistente].cantidad += 1; // Aumentamos cantidad
    } else {
        carritoActual.push({ ...producto, cantidad: 1 }); // Lo agregamos nuevo
    }
    
    // Guardamos de nuevo en localStorage
    localStorage.setItem("carrito", JSON.stringify(carritoActual));
    alert(`🛒 ¡${producto.nombre} agregado al carrito!`);
};

// Función para renderizar los productos en la grilla[cite: 10]
const renderizarProductos = (productosParaMostrar: Product[]) => {
    mainProductos.innerHTML = ""; // Limpiamos el contenedor
    const fragmento = document.createDocumentFragment();

    // Reutilizamos la estructura de clases del CSS
    const divGrid = document.createElement("div");
    divGrid.className = "productos-grid";

    if (productosParaMostrar.length === 0) {
        mainProductos.innerHTML = "<p>No se encontraron productos.</p>";
        return;
    }

    productosParaMostrar.forEach((producto) => {
        const article = document.createElement("article");
        article.className = "tarjeta-producto";
        
        article.innerHTML = `
            <div class="info-producto">
                <h3>${producto.nombre}</h3>
                <p>${producto.descripcion}</p>
                <div class="precio-boton">
                    <strong>$${producto.precio}</strong>
                    <button class="btn-agregar">Agregar</button>
                </div>
            </div>
            <img src="/assets/img/${producto.imagen}" alt="${producto.nombre}"> 
            <!-- NOTA: Ajusta la ruta de la imagen según dónde las tengas en la carpeta public -->
        `;

        // Añadimos el evento al botón de esta tarjeta[cite: 10]
        const btnAgregar = article.querySelector(".btn-agregar") as HTMLButtonElement;
        btnAgregar.addEventListener("click", () => agregarAlCarrito(producto));

        divGrid.appendChild(article);
    });

    fragmento.appendChild(divGrid);
    mainProductos.appendChild(fragmento);
};

// Lógica del Buscador[cite: 15]
formBusqueda.addEventListener("submit", (e: Event) => {
    e.preventDefault();
    const termino = inputBusqueda.value.toLowerCase();
    
    const filtrados = PRODUCTS.filter((p) => 
        p.nombre.toLowerCase().includes(termino) && !p.eliminado
    );
    
    renderizarProductos(filtrados);
});

// Inicialización: Renderizamos todos los productos no eliminados al inicio
document.addEventListener("DOMContentLoaded", () => {
    const productosDisponibles = PRODUCTS.filter(p => !p.eliminado);
    renderizarProductos(productosDisponibles);
});

