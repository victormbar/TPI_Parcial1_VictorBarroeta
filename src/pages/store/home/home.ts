import { getUSer } from "../../../utils/localStorage";
import { logout } from "../../../utils/auth";
import { PRODUCTS, getCategories } from "../../../data/data";
import type { Product, CartItem } from "../../../types/product";

// Referencias a elementos del DOM
const mainProductos = document.getElementById("main-productos") as HTMLElement;
const formBusqueda = document.querySelector(".search-form") as HTMLFormElement;
const inputBusqueda = document.getElementById("buscarProducto") as HTMLInputElement;

// Se crea una función para modificar el menu de navegación si es admin 
const navLista = document.getElementById("nav-lista") as HTMLElement; 
const listaCategoriasUI = document.getElementById("lista-categorias") as HTMLElement; 

const verificarAdminParaNav = () => {
    const userRaw = getUSer(); // Usamos tu utilidad para obtener el usuario
    if (userRaw) {
        const user = JSON.parse(userRaw)
        // Si el usuario es admin, inyectamos el link al panel
        if (user.role === "admin") {
            const liAdmin = document.createElement("li");
            liAdmin.innerHTML = `<a href="/src/pages/admin/home/home.html" class="link-admin">⚙️ Panel Admin</a>`;
            navLista.appendChild(liAdmin); // Se agrega el nuevo item al menú de navegación
        }
    }
};

// Función para agregar al carrito
const agregarAlCarrito = (producto: Product) => {
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

// Se separa la función exclusiva para renderizar el menú lateral con las categorías dinámicamente.
const renderizarMenuCategorias = () => {
    const categorias = getCategories(); 
    // Se agrega la opción para mostrar todas las categorías al inicio del menú.
    listaCategoriasUI.innerHTML = '<li><a href="#" class="filtro-cat" data-id="all">Todas las Categorías</a></li>';

     //Se agrega cada categoría al menú lateral con un enlace a data-id
    categorias.forEach(cat => {
        const li = document.createElement("li"); 
        li.innerHTML = `<a href="#" class="filtro-cat" data-id="${cat.nombre}">${cat.nombre}</a>`;
        listaCategoriasUI.appendChild(li); // Se agrega cada categoría al menú lateral
    });
};

// Función para renderizar los productos en el DOM
const renderizarProductos = (productosParaMostrar: Product[]) => {
    mainProductos.innerHTML = "";  
    const fragmento = document.createDocumentFragment(); 

    // Reutilizamos la estructura de clases del CSS
    const divGrid = document.createElement("div");
    divGrid.className = "productos-grid";

    // Se muestra un mensaje si no hay productos para mostrar
    if (productosParaMostrar.length === 0) {
        mainProductos.innerHTML = "<p>No se encontraron productos.</p>";
        return;
    }
    // Se itera sobre los productos filtrados para crear las tarjetas correspondientes
    productosParaMostrar.forEach((producto) => {
        const article = document.createElement("article");
        article.className = "tarjeta-producto";
        
        //Se verifica si la imagen es agregada de los assets o si es una imagen subida por el admin.
        const srcImg = producto.imagen.startsWith("data:") ? producto.imagen : `/assets/img/${producto.imagen}`;

        // Se inyecta el HTM de cada producto, con su información y el botón para agregar al carrito.
        article.innerHTML = `
            <div class="info-producto">
                <h3>${producto.nombre}</h3>
                <p>${producto.descripcion}</p>
                <div class="precio-boton">
                    <strong>$${producto.precio}</strong>
                    <button class="btn-agregar">Agregar</button>
                </div>
            </div>
            <img src="${srcImg}" alt="${producto.nombre}"> 
            `;

        // Añadimos el evento al botón de esta tarjeta
        const btnAgregar = article.querySelector(".btn-agregar") as HTMLButtonElement;
        btnAgregar.addEventListener("click", () => agregarAlCarrito(producto));

        divGrid.appendChild(article);
    });

    fragmento.appendChild(divGrid);
    mainProductos.appendChild(fragmento);
};

// Lógica del Buscador
formBusqueda.addEventListener("submit", (e: Event) => {
    e.preventDefault();
    const termino = inputBusqueda.value.toLowerCase();
    
    const filtrados = PRODUCTS.filter((p) => 
        p.nombre.toLowerCase().includes(termino) && !p.eliminado
    );
    
    renderizarProductos(filtrados);
});

// Se agrega la lógica para filtrar los productos al hacer clic en una categoría del menú (HU-P1-02).
listaCategoriasUI.addEventListener("click", (e: MouseEvent) => {
    e.preventDefault();
    const target = e.target as HTMLElement;
    
    // Se verifica que el clic haya sido sobre un enlace de categoría
    if (target.classList.contains("filtro-cat")) {
        const catSeleccionada = target.getAttribute("data-id");
        
        if (catSeleccionada === "all") {
            // Se muestran todos los productos no eliminados
            renderizarProductos(PRODUCTS.filter(p => !p.eliminado));
        } else {
            // Se filtran los productos que contengan la categoría seleccionada
            const filtrados = PRODUCTS.filter(p => 
                p.categorias.some(c => c.nombre === catSeleccionada) && !p.eliminado
            );
            renderizarProductos(filtrados);
        }
    }
});

// NUEVO: Lógica para manejar el cierre de sesión desde el navbar.
document.getElementById("logoutButton")?.addEventListener("click", (e) => {
    e.preventDefault();
    logout();
});

// Inicialización: Renderizamos todos los productos no eliminados al inicio
document.addEventListener("DOMContentLoaded", () => {
     //Se inicializan las funciones de navegación y menú antes de cargar los productos.
    verificarAdminParaNav();
    renderizarMenuCategorias();

    const productosDisponibles = PRODUCTS.filter(p => !p.eliminado);
    renderizarProductos(productosDisponibles);
});