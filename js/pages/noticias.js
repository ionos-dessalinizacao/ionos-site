import { db } from "../services/firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

async function carregarNoticias() {
  try {
    const lista = document.getElementById("listaNoticias");

    if (!lista) {
      console.error("❌ Elemento listaNoticias não encontrado");
      return;
    }

    lista.innerHTML = "<p>Carregando...</p>";

    const querySnapshot = await getDocs(collection(db, "noticias"));

    lista.innerHTML = "";

    if (querySnapshot.empty) {
      lista.innerHTML = "<p class='text-center'>Nenhuma notícia encontrada.</p>";
      return;
    }

    querySnapshot.forEach((doc) => {
      const noticia = doc.data();

      const card = document.createElement("div");
      card.className = "bg-white p-6 rounded-lg shadow hover:shadow-lg transition";

      card.innerHTML = `
        ${noticia.imagemUrl ? `<img src="${noticia.imagemUrl}" class="w-full h-40 object-cover rounded mb-4">` : ""}
        <h2 class="text-xl font-bold mb-2">${noticia.titulo}</h2>
        <p class="text-gray-600">${noticia.descricao}</p>
      `;

      lista.appendChild(card);
    });

  } catch (error) {
    console.error("❌ Erro ao carregar notícias:", error);
  }
}

// garante que carregou tudo
carregarNoticias();