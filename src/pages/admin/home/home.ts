import { checkAuhtUser, logout } from "../../../utils/auth";
import "../../../../css/admin.css";

//Lógica de Logout (Cerrar Sesión)
const buttonLogout = document.getElementById(
  "logoutButton"
) as HTMLButtonElement;
buttonLogout?.addEventListener("click", () => {
  logout();
});

if (buttonLogout) {
  buttonLogout.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("userData"); // Borramos los datos
      window.location.href = "/src/pages/auth/login/login.html"; // Volvemos al login
  });
}


const initPage = () => {
  console.log("inicio de pagina");
  checkAuhtUser(
    "/src/pages/auth/login/login.html",
    "/src/pages/store/home/home.html",
    "admin"
  );
};
initPage();


