// src/pages/store/cart/cart.ts
import type { CartItem } from "../../../types/product";
import "../../../css/styles.css";

const contenedorCarrito = document.getElementById("contenedor-carrito") as HTMLElement;

const renderizarCarrito = () => {
    // 1. Leemos el carrito de localStorage[cite: 15]
    const carrito: CartItem[] = JSON.parse(localStorage.getItem("carrito") || "[]");
    
    contenedorCarrito.innerHTML = ""; // Limpiamos el contenedor

    // 2. Si está vacío, mostramos un mensaje
    if (carrito.length === 0) {
        contenedorCarrito.innerHTML = "<p>Tu carrito está vacío. ¡Ve a comprar algo rico!</p>";
        return;
    }

    let totalCompra = 0;
    const fragmento = document.createDocumentFragment(); // Optimización[cite: 10]

    // 3. Iteramos sobre los productos del carrito
    carrito.forEach((item) => {
        const subtotal = item.precio * item.cantidad;
        totalCompra += subtotal; // Sumamos al total acumulado[cite: 15]

        const divItem = document.createElement("div");
        divItem.className = "cart-item"; // Puedes agregar estilos para esta clase en styles.css
        divItem.innerHTML = `
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #ddd; padding: 15px 0;">
                <div>
                    <h4>${item.nombre}</h4>
                    <p>Precio Unitario: $${item.precio}</p>
                </div>
                <div style="text-align: right;">
                    <p><strong>Cantidad: ${item.cantidad}</strong></p>
                    <p>Subtotal: $${subtotal}</p>
                </div>
            </div>
        `;
        fragmento.appendChild(divItem);
    });

    // 4. Agregamos el total general al final del fragmento[cite: 15]
    const divTotal = document.createElement("div");
    divTotal.innerHTML = `<h3 style="text-align: right; margin-top: 20px; color: #FF6347;">Total a Pagar: $${totalCompra}</h3>`;
    fragmento.appendChild(divTotal);

    // 5. Inyectamos todo en el DOM
    contenedorCarrito.appendChild(fragmento);
};

// Ejecutamos al cargar la página
document.addEventListener("DOMContentLoaded", renderizarCarrito);