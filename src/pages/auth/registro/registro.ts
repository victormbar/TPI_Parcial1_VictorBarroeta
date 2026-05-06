import { navigate } from "../../../utils/navigate";

const formRegistro = document.getElementById("form-registro") as HTMLFormElement;
const inputNombre = document.getElementById("nombre") as HTMLInputElement;
const inputEmail = document.getElementById("mail") as HTMLInputElement;
const inputPassword = document.getElementById("password") as HTMLInputElement;

formRegistro.addEventListener("submit", (e: SubmitEvent) => {
    e.preventDefault();

    const nombre = inputNombre.value;
    const email = inputEmail.value;
    const password = inputPassword.value;

    // 1. Traemos la lista de usuarios actual
    const usuariosRegistrados = JSON.parse(localStorage.getItem("usuariosRegistrados") || "[]");

    // 2. Verificamos que el mail no esté en uso usando el método .some() de los arrays
    const existeCorreo = usuariosRegistrados.some((user: any) => user.email === email);
    
    if (existeCorreo) {
        alert("⚠️ Este correo ya está registrado. Por favor, ve a iniciar sesión.");
        return; // Cortamos el flujo
    }

    // 3. Si todo está bien, creamos el nuevo objeto usuario
    const nuevoUsuario = {
        nombre: nombre,
        email: email,
        password: password,
        role: "client" // Se guarda como cliente por defecto
    };

    // 4. Lo empujamos al array y guardamos en localStorage
    usuariosRegistrados.push(nuevoUsuario);
    localStorage.setItem("usuariosRegistrados", JSON.stringify(usuariosRegistrados));

    // 5. Notificamos y enviamos al login
    alert("✅ ¡Registro exitoso! Ahora puedes iniciar sesión.");
    navigate("/src/pages/auth/login/login.html");
});