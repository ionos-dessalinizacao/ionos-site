import { db } from "./firebase.js";
import { 
  addDoc, collection, getDocs, deleteDoc, doc, updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// 🔹 CRIAR
export async function criarNoticia(titulo, descricao, imagemUrl) {
  await addDoc(collection(db, "noticias"), {
    titulo,
    descricao,
    imagemUrl,
    data: new Date()
  });
}

// 🔹 PEGAR
export async function pegarNoticias() {
  const snapshot = await getDocs(collection(db, "noticias"));

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

// 🔹 DELETAR
export async function deletarNoticia(id) {
  await deleteDoc(doc(db, "noticias", id));
}

// 🔹 ATUALIZAR
export async function atualizarNoticia(id, titulo, descricao) {
  await updateDoc(doc(db, "noticias", id), {
    titulo,
    descricao
  });
}