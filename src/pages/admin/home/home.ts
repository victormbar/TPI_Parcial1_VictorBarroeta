import { PRODUCTS } from "../../../data/data.ts";
import type { Product } from "../../../types/product";
import type { ICategory } from "../../../types/category";
import { checkAuhtUser, logout } from "../../../utils/auth";
import { mostrarToast } from "../../../utils/toast";

// Se realiza la verificación de seguridad para asegurar el rol de administrador
checkAuhtUser("/src/pages/auth/login/login.html", "/src/pages/store/home/home.html", "admin");

// Se seleccionan los elementos principales del DOM
const tablaBody = document.getElementById("tabla-productos-admin") as HTMLElement;
const formNuevoProducto = document.getElementById("form-nuevo-producto") as HTMLFormElement;
const btnNuevoProducto = document.querySelector(".btn-nuevo") as HTMLButtonElement;

// Se declaran variables para el manejo de la edición
let esEdicion = false;
let idProductoAEditar: number | null = null;
let imagenBase64Temporal: string = "";

/**
 * Se encarga de dibujar las filas de la tabla basándose en el array de productos
 */
const renderizarTablaAdmin = () => {
    tablaBody.innerHTML = "";
    const fragmento = document.createDocumentFragment();

    PRODUCTS.forEach((producto: Product) => {
        // Se omite la renderización si el producto está marcado como eliminado
        if (producto.eliminado) return;

        const tr = document.createElement("tr");
        const nombreCategoria = producto.categorias.map((cat: ICategory) => cat.nombre).join(", ");
        
        // Se determina si la imagen es una ruta o un string Base64
        const fuenteImagen = producto.imagen.startsWith("data:") 
            ? producto.imagen 
            : `/assets/${producto.imagen}`;

        tr.innerHTML = `
            <td>${producto.id}</td>
            <td><img src="${fuenteImagen}" alt="${producto.nombre}" width="50" style="border-radius: 5px; height: 50px; object-fit: cover;"></td>
            <td>${producto.nombre}</td>
            <td>${nombreCategoria}</td>
            <td>$${producto.precio}</td>
            <td>${producto.stock}</td>
            <td>
                <button class="btn-editar" data-id="${producto.id}">Editar</button>
                <button class="btn-eliminar" data-id="${producto.id}">Eliminar</button>
            </td>
        `;
        fragmento.appendChild(tr);
    });

    tablaBody.appendChild(fragmento);
};

/**
 * Se gestiona la creación o edición de productos mediante el envío del formulario
 */
formNuevoProducto?.addEventListener("submit", (e: SubmitEvent) => {
    e.preventDefault();

    const inputNombre = document.getElementById("nombreProd") as HTMLInputElement;
    const inputPrecio = document.getElementById("precioProd") as HTMLInputElement;
    const inputStock = document.getElementById("stockProd") as HTMLInputElement;
    const selectCategoria = document.getElementById("categoriaProd") as HTMLSelectElement;
    const inputImagen = document.getElementById("imgProdFile") as HTMLInputElement;

    // Se define la función para procesar la persistencia de los datos
    const procesarGuardado = (imagenData: string) => {
        if (esEdicion && idProductoAEditar !== null) {
            // Lógica de edición: Se busca el producto y se actualizan sus valores
            const indice = PRODUCTS.findIndex(p => p.id === idProductoAEditar);
            if (indice !== -1) {
                PRODUCTS[indice] = {
                    ...PRODUCTS[indice],
                    nombre: inputNombre.value,
                    precio: Number(inputPrecio.value),
                    stock: Number(inputStock.value),
                    imagen: imagenData || PRODUCTS[indice].imagen,
                    categorias: [{ ...PRODUCTS[indice].categorias[0], nombre: selectCategoria.value }]
                };
            }
            esEdicion = false;
            idProductoAEditar = null;
        } else {
            // Lógica de creación: Se genera un nuevo objeto y se añade al array
            const nuevoId = PRODUCTS.length > 0 ? Math.max(...PRODUCTS.map(p => p.id)) + 1 : 1;
            const nuevoProducto: Product = {
                id: nuevoId,
                eliminado: false,
                createdAt: new Date().toISOString(),
                nombre: inputNombre.value,
                precio: Number(inputPrecio.value),
                descripcion: "Descripción genérica",
                stock: Number(inputStock.value),
                imagen: imagenData,
                disponible: true,
                categorias: [{ id: 99, eliminado: false, createdAt: new Date().toISOString(), nombre: selectCategoria.value, descripcion: "" }]
            };
            PRODUCTS.push(nuevoProducto);
        }

        formNuevoProducto.reset();
        renderizarTablaAdmin();
        mostrarToast("✅ Operación realizada con éxito");
    };

    // Se verifica si se subió una nueva imagen
    const archivo = inputImagen.files?.[0];
    if (archivo) {
        const lector = new FileReader();
        lector.onload = (evento) => procesarGuardado(evento.target?.result as string);
        lector.readAsDataURL(archivo);
    } else {
        // Si es edición y no hay imagen nueva, se conserva la anterior
        procesarGuardado(imagenBase64Temporal);
    }
});

/**
 * Se implementa delegación de eventos para los botones de la tabla (Editar y Eliminar)
 */
tablaBody.addEventListener("click", (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const id = Number(target.getAttribute("data-id"));

    // Lógica para Eliminar
    if (target.classList.contains("btn-eliminar")) {
        if (confirm("¿Se desea eliminar este producto?")) {
            const indice = PRODUCTS.findIndex(p => p.id === id);
            if (indice !== -1) {
                PRODUCTS.splice(indice, 1); // Se elimina del array
                renderizarTablaAdmin();
                mostrarToast("✅ Producto eliminado con éxito");
            }
        }
    }

    // Lógica para Editar
    if (target.classList.contains("btn-editar")) {
        const producto = PRODUCTS.find(p => p.id === id);
        if (producto) {
            // Se cargan los datos en el formulario
            (document.getElementById("nombreProd") as HTMLInputElement).value = producto.nombre;
            (document.getElementById("precioProd") as HTMLInputElement).value = producto.precio.toString();
            (document.getElementById("stockProd") as HTMLInputElement).value = producto.stock.toString();
            (document.getElementById("categoriaProd") as HTMLSelectElement).value = producto.categorias[0].nombre;
            
            imagenBase64Temporal = producto.imagen;
            esEdicion = true;
            idProductoAEditar = id;

            // Se desplaza la vista hacia el formulario
            formNuevoProducto.scrollIntoView({ behavior: "smooth" });
        }
    }
});

/**
 * Se activa el desplazamiento hacia el formulario al presionar el botón de nuevo producto
 */
btnNuevoProducto?.addEventListener("click", () => {
    formNuevoProducto.reset();
    esEdicion = false;
    idProductoAEditar = null;
    formNuevoProducto.scrollIntoView({ behavior: "smooth" });
});

// Se gestiona el cierre de sesión
document.getElementById("logoutButton")?.addEventListener("click", (e) => {
    e.preventDefault();
    logout();
});

// Se inicializa la tabla al cargar el documento
document.addEventListener("DOMContentLoaded", renderizarTablaAdmin);