import { navigate } from "../../../utils/navigate";

const formRegistro = document.getElementById("form-registro") as HTMLFormElement;
const inputNombre = document.getElementById("nombre") as HTMLInputElement;
const inputEmail = document.getElementById("mail") as HTMLInputElement;
const inputPassword = document.getElementById("password") as HTMLInputElement;
import { mostrarToast } from "../../../utils/toast";

formRegistro.addEventListener("submit", (e: SubmitEvent) => {
    e.preventDefault();
 // Se define el nuevo usuario a registrar con los valores del formulario
    const nombre = inputNombre.value;
    const email = inputEmail.value;
    const password = inputPassword.value;

    // Traemos la lista de usuarios actualmente registrados desde localStorage o iniciamos un array vacío si no hay ninguno
    const usuariosRegistrados = JSON.parse(localStorage.getItem("usuariosRegistrados") || "[]");

    // Verificamos que el mail existe o no en el array de usuarios registrados
    const existeCorreo = usuariosRegistrados.some((user: any) => user.email === email);
    
    // Si existe se interrumpe enviando una alerta al usuario
    if (existeCorreo) {
        mostrarToast("Este correo ya está registrado. Por favor, ve a iniciar sesión.");
        return;
    }

    // Si no existe, se crea un nuevo objeto con los datos del nuevo usuario
    const nuevoUsuario = {
        nombre: nombre,
        email: email,
        password: password,
        role: "client" // Se guarda como cliente por defecto
    };

    // Se guarda el nuevo usuario en el array de usuarios registrados y se actualiza localStorage
    usuariosRegistrados.push(nuevoUsuario);
    localStorage.setItem("usuariosRegistrados", JSON.stringify(usuariosRegistrados));

    // Se Notifica y enviamos al login
    mostrarToast("¡Registro exitoso! Ahora puedes iniciar sesión.");
    navigate("/src/pages/auth/login/login.html");
});