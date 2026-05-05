import "./login.css"; //Ruta al CSS Login

import type { IUser } from "../../../types/IUser";
import { saveUser } from "../../../utils/localStorage";
import { navigate } from "../../../utils/navigate";

const form = document.getElementById("form-login") as HTMLFormElement;
const inputEmail = document.getElementById("mail") as HTMLInputElement;
const inputPassword = document.getElementById("password") as HTMLInputElement;

form.addEventListener("submit", (e: SubmitEvent) => {
    e.preventDefault();

    const email = inputEmail.value;
    const password = inputPassword.value;

    // Verificamos si es el ADMIN (Clave maestra)
    if (email === "admin@admin.com" && password === "admin2803") {
        const userAdmin: IUser = {
            email: email,
            role: "admin",
            loggedIn: true,
        };
        saveUser(userAdmin); // Guardamos usando tu utilidad
        alert("👨‍🍳 Bienvenido Administrador");
        navigate("/src/pages/admin/home/home.html"); // Redirigimos usando tu utilidad
        return; 
    }

    // Si no es admin, asume que es CLIENTE 
  
    const userClient: IUser = {
        email: email,
        role: "client",
        loggedIn: true,
    };
    saveUser(userClient);
    navigate("/src/pages/store/home/home.html");
});