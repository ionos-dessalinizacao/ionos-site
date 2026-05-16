import { login } from "../services/authService.js";

window.entrar = async function () {
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  try {
    await login(email, senha);
    window.location.href = "admin.html";
  } catch (e) {
    alert(e.message);
  }
};