import { logout } from "../../../utils/auth";
import type { CartItem } from "../../../types/product";
import { mostrarToast } from "../../../utils/toast";

// Se seleccionan las referencias a elementos del DOM del carrito
const contenedorCarrito = document.getElementById("contenedor-carrito") as HTMLElement;
const resumenTotal = document.getElementById("resumen-total") as HTMLElement;
const btnVaciar = document.getElementById("btn-vaciar") as HTMLButtonElement;

// Se crea una función para traer los datos del carrito guardados en localStorage
const obtenerCarrito = (): CartItem[] => {
    const datos = localStorage.getItem("carrito");
    return datos ? JSON.parse(datos) : [];
};

// Se crea la función para sumar todo y mostrar el total 
const actualizarTotal = (carrito: CartItem[]) => {
    // Se usa reduce para sumar el precio por la cantidad de cada producto
    const total = carrito.reduce((acumulador, item) => acumulador + (item.precio * item.cantidad), 0);
    resumenTotal.innerHTML = `<h3>Total de la compra: $${total}</h3>`;
};

// Se crea la función para pintar los productos del carrito en pantalla
const renderizarCarrito = () => {
    const carrito = obtenerCarrito();
    contenedorCarrito.innerHTML = ""; // Se limpia el contenedor
    
    // Se verifica si el carrito está vacío para mostrar el mensaje
    if (carrito.length === 0) {
        contenedorCarrito.innerHTML = "<p class='mensaje-vacio'>Tu carrito está vacío. ¡Agrega productos desde el catálogo!</p>";
        resumenTotal.innerHTML = "<h3>Total: $0</h3>";
        return;
    }

    const fragmento = document.createDocumentFragment();

    carrito.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        const divItem = document.createElement("div");
        divItem.className = "tarjeta-producto-carrito";
        
        // Se verifica si la imagen viene del local o fue subida en base64
        const srcImg = item.imagen.startsWith("data:") ? item.imagen : `/assets/${item.imagen}`;

        // Se inyecta el HTML respetando la separación de estilos en CSS
        divItem.innerHTML = `
            <img src="${srcImg}" alt="${item.nombre}" class="img-carrito">
            <div class="info-producto-carrito">
                <h3>${item.nombre}</h3>
                <p>Precio: $${item.precio} | Cantidad: ${item.cantidad}</p>
                <p><strong>Subtotal: $${subtotal}</strong></p>
            </div>
            <div class="acciones-item">
                <button class="btn-quitar" data-id="${item.id}">Quitar 1</button>
            </div>
        `;
        
        fragmento.appendChild(divItem);
    });

    contenedorCarrito.appendChild(fragmento);
    
    // Se llama a la función que calcula el total
    actualizarTotal(carrito);
};

// Se crea la función para restar o eliminar un producto si tocamos el botón "Quitar 1"
const quitarItem = (id: number) => {
    let carrito = obtenerCarrito();
    const indice = carrito.findIndex(item => item.id === id);

    if (indice !== -1) {
        if (carrito[indice].cantidad > 1) {
            carrito[indice].cantidad -= 1; // Se resta uno si hay varios
        } else {
            carrito.splice(indice, 1); // Se borra si solo quedaba uno
        }
    }

    // Se guardan de nuevo los cambios en localStorage y se vuelve a pintar
    localStorage.setItem("carrito", JSON.stringify(carrito));
    renderizarCarrito();
};

// Se escuchan los clics dentro del contenedor para saber si tocamos el botón de quitar
contenedorCarrito.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains("btn-quitar")) {
        const id = Number(target.getAttribute("data-id"));
        quitarItem(id);
    }
});

// Se implementa la lógica para el botón de vaciar todo el carrito
btnVaciar?.addEventListener("click", () => {
    if (confirm("¿Estás seguro de vaciar el carrito?")) {
        localStorage.removeItem("carrito");
        renderizarCarrito();
    }
});

// Se implementa la lógica para cerrar sesión
document.getElementById("logoutButton")?.addEventListener("click", (e) => {
    e.preventDefault();
    mostrarToast(" Sesión cerrada con éxito.");
    logout();
});

// Se inicializa la pantalla cuando carga la página
document.addEventListener("DOMContentLoaded", renderizarCarrito);