const form = document.getElementById("formMembro");
const mensagem = document.getElementById("mensagem");
const membroId = document.getElementById("membroId");
const tituloFormulario = document.getElementById("tituloFormulario");
const previewAtual = document.getElementById("previewAtual");
const inputImagem = document.getElementById("imagem");
const cancelarEdicao = document.getElementById("cancelarEdicao");

function mostrarMensagem(texto, erro = false) {
  mensagem.textContent = texto;
  mensagem.style.color = erro ? "#b91c1c" : "#047857";
}

function limparFormulario() {
  form.reset();
  membroId.value = "";
  tituloFormulario.textContent = "Cadastrar membro";
  cancelarEdicao.hidden = true;
  previewAtual.replaceChildren();
  document.getElementById("ordem").value = 0;
}

cancelarEdicao.addEventListener("click", limparFormulario);

// Cadastrar ou atualizar.
form.addEventListener("submit", async event => {
  event.preventDefault();

  const id = membroId.value;
  const dados = new FormData(form);

  // Não envia um arquivo vazio.
  if (!inputImagem.files.length) {
    dados.delete("imagem");
  }

  const url = id
    ? `/admin/equipe/${encodeURIComponent(id)}`
    : "/admin/equipe/criar";

  try {
    const resposta = await fetch(url, {
      method: id ? "PUT" : "POST",
      body: dados
    });

    const resultado = await resposta.json();

    if (!resposta.ok || !resultado.sucesso) {
      throw new Error(
        resultado.mensagem || "Não foi possível salvar."
      );
    }

    mostrarMensagem(resultado.mensagem);
    window.location.reload();
  } catch (error) {
    mostrarMensagem(error.message, true);
  }
});

// Botões dos cards.
document.querySelector(".member-list").addEventListener(
  "click",
  async event => {
    const botao = event.target.closest("button[data-action]");

    if (!botao) return;

    const id = botao.dataset.id;
    const acao = botao.dataset.action;

    if (acao === "editar") {
      membroId.value = id;

      document.getElementById("nome").value =
        botao.dataset.nome;

      document.getElementById("cargo").value =
        botao.dataset.cargo;

      document.getElementById("descricao").value =
        botao.dataset.descricao;

      document.getElementById("tipo").value =
        botao.dataset.tipo;

      document.getElementById("ordem").value =
        botao.dataset.ordem;

      tituloFormulario.textContent = "Editar membro";
      cancelarEdicao.hidden = false;
      previewAtual.replaceChildren();

      if (botao.dataset.imagem) {
        const imagem = document.createElement("img");

        imagem.src = botao.dataset.imagem;
        imagem.alt = "Foto atual do membro";
        imagem.width = 100;
        imagem.height = 100;
        imagem.style.objectFit = "cover";
        imagem.style.borderRadius = "50%";

        previewAtual.appendChild(imagem);
      }

      form.scrollIntoView({ behavior: "smooth" });
      return;
    }

    let url;
    let metodo = "PUT";

    if (acao === "arquivar") {
      url = `/admin/equipe/${encodeURIComponent(id)}/arquivar`;
    } else if (acao === "desarquivar") {
      url = `/admin/equipe/${encodeURIComponent(id)}/desarquivar`;
    } else if (acao === "deletar") {
      const nome = botao.dataset.nome;

      if (!confirm(`Deseja excluir definitivamente ${nome}?`)) {
        return;
      }

      url = `/admin/equipe/${encodeURIComponent(id)}`;
      metodo = "DELETE";
    } else {
      return;
    }

    try {
      const resposta = await fetch(url, {
        method: metodo
      });

      const resultado = await resposta.json();

      if (!resposta.ok || !resultado.sucesso) {
        throw new Error(
          resultado.mensagem || "Não foi possível concluir a operação."
        );
      }

      mostrarMensagem(resultado.mensagem);
      window.location.reload();
    } catch (error) {
      mostrarMensagem(error.message, true);
    }
  }
);
