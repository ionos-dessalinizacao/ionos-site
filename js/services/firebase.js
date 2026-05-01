
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB1mMrpHnE7AMiraLnf1Ta51tAw-D5J3Ts",
  authDomain: "site-ionos-8a20a.firebaseapp.com",
  projectId: "site-ionos-8a20a",
  storageBucket: "site-ionos-8a20a.firebasestorage.app",
  messagingSenderId: "152493412507",
  appId: "1:152493412507:web:9fd029868cfdd3b0f2763e"
};

const app = initializeApp(firebaseConfig);

// 🔥 ESSENCIAL
export default app;

// (opcional, se você usa banco também)
export const db = getFirestore(app);