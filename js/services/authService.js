import app from "./firebase.js";

import { 
  getAuth, 
  signInWithEmailAndPassword, 
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const auth = getAuth(app);

// 🔹 LOGIN
export async function login(email, senha) {
  await signInWithEmailAndPassword(auth, email, senha);
}

// 🔹 OBSERVAR USUÁRIO
export function observarAuth(callback) {
  onAuthStateChanged(auth, callback);
}

// 🔹 LOGOUT
export async function logout() {
  await signOut(auth);
  window.location.href = "login.html";
}