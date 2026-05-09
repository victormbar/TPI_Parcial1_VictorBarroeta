import type { IUser } from "../../../types/IUser";
import { saveUser } from "../../../utils/localStorage";
import { navigate } from "../../../utils/navigate";
import { mostrarToast } from "../../../utils/toast";

const form = document.getElementById("form-login") as HTMLFormElement;
const inputEmail = document.getElementById("mail") as HTMLInputElement;
const inputPassword = document.getElementById("password") as HTMLInputElement;

form.addEventListener("submit", (e: SubmitEvent) => {
    e.preventDefault();

    const email = inputEmail.value;
    const password = inputPassword.value;

    // Verificamos si es el ADMIN
    if (email === "admin@admin.com" && password === "admin2803") {
        const userAdmin: IUser = {
            email: email,
            role: "admin",   //rol asignado de manera predefinida para el admin
            loggedIn: true,
        };
        saveUser(userAdmin); //Guarda la sesión del admin en Local Storage
        mostrarToast("👨‍🍳 Bienvenido Administrador");
        navigate("/src/pages/admin/home/home.html"); // Redirigimos usando las utils
        return;
    }
    // Validación para clientes: Si el email no es el del admin, se asume que es un cliente y se le asigna el rol de "client"
    // Obtenemos los usuarios que se registraron previamente
    const usuariosRegistrados = JSON.parse(localStorage.getItem("usuariosRegistrados") || "[]");
    
    // Buscamos un usuario que coincida con los datos ingresados 
    const usuarioValido = usuariosRegistrados.find(
        (user: any) => user.email === email && user.password === password
    );
    // Si existe el usuario y la clave es correcta, creamos su sesión y se asigna el rol de client
    if (usuarioValido) {
        const userClient: IUser = {
            email: email,
            role: "client",
            loggedIn: true,
        };
        saveUser(userClient);
        navigate("/src/pages/store/home/home.html");
    } else {
        // Si no se encuentra un usuario válido, mostramos un mensaje de error. bloqueando el acceso a la tienda.
        mostrarToast("❌ Credenciales incorrectas. Por favor, inténtalo de nuevo. Si no tienes una cuenta, regístrate primero.");
    }
});