import { 
  criarNoticia,
  pegarNoticias,
  deletarNoticia,
  atualizarNoticia
} from "../services/noticiaService.js";

import { observarAuth, logout } from "../services/authService.js";

// 🔐 proteger página
observarAuth((user) => {
  if (!user) {
    window.location.href = "login.html";
  } else {
    document.getElementById("conteudo").style.display = "block";
    listarNoticias();
  }
});

// 🔹 LISTAR
async function listarNoticias() {
  const lista = document.getElementById("listaNoticias");

  if (!lista) return;

  lista.innerHTML = "Carregando...";

  const noticias = await pegarNoticias();

  lista.innerHTML = "";

  noticias.forEach(n => {
    const div = document.createElement("div");

    div.style.border = "1px solid #ccc";
    div.style.padding = "10px";
    div.style.margin = "10px";

    div.innerHTML = `
      ${n.imagemUrl ? `<img src="${n.imagemUrl}" width="100"><br>` : ""}
      <h3>${n.titulo}</h3>
      <p>${n.descricao}</p>
    `;

    const btnDel = document.createElement("button");
    btnDel.innerText = "Deletar";
    btnDel.onclick = async () => {
      await deletarNoticia(n.id);
      listarNoticias();
    };

    const btnEdit = document.createElement("button");
    btnEdit.innerText = "Editar";
    btnEdit.onclick = async () => {
      const novoTitulo = prompt("Novo título:");
      const novaDescricao = prompt("Nova descrição:");

      if (novoTitulo && novaDescricao) {
        await atualizarNoticia(n.id, novoTitulo, novaDescricao);
        listarNoticias();
      }
    };

    div.appendChild(btnDel);
    div.appendChild(btnEdit);

    lista.appendChild(div);
  });
}

// 🔹 UPLOAD PARA CLOUDINARY
async function uploadImagem(file) {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", "ionos_present");

  const response = await fetch(
    "https://api.cloudinary.com/v1_1/diue362na/image/upload",
    {
      method: "POST",
      body: formData
    }
  );

  const data = await response.json();

  return data.secure_url;
}

// 🔹 PREVIEW DA IMAGEM
const fileInput = document.getElementById("imagemFile");
const preview = document.getElementById("preview");

if (fileInput) {
  fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];

    if (file) {
      preview.src = URL.createObjectURL(file);
      preview.style.display = "block";
    }
  });
}

// 🔹 CRIAR
window.criar = async function () {
  const titulo = document.getElementById("titulo").value;
  const descricao = document.getElementById("descricao").value;

  const file = fileInput.files[0];

  let imagemUrl = "";

  try {
    if (file) {
      alert("Enviando imagem...");
      imagemUrl = await uploadImagem(file);
    }

    await criarNoticia(titulo, descricao, imagemUrl);

    document.getElementById("titulo").value = "";
    document.getElementById("descricao").value = "";
    fileInput.value = "";
    preview.style.display = "none";

    listarNoticias();

  } catch (error) {
    console.error(error);
    alert("Erro ao criar notícia");
  }
};

// 🔹 LOGOUT
window.sair = logout;