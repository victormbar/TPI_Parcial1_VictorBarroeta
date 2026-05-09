export const mostrarToast = (mensaje: string) => {
    // Se crea un div dinámicamente
    const toast = document.createElement("div");
    toast.className = "toast-notificacion";
    toast.innerText = mensaje;

    // SE inyecta en el cuerpo de la página
    document.body.appendChild(toast);

    //Se fuerza un pequeño retraso para que CSS procese la animación
    setTimeout(() => {
        toast.classList.add("mostrar");
    }, 10);

    //Elimimina automáticamente después de 3 segundos
    setTimeout(() => {
        toast.classList.remove("mostrar");
        //Se espera a que termine la animación antes de borrar el HTML
        setTimeout(() => toast.remove(), 300); 
    }, 3000);
};