
"use strict";

// ==========================================
// ELEMENTOS
// ==========================================

const formNoticia = document.getElementById("formNoticia");
const imagemFile = document.getElementById("imagemFile");
const preview = document.getElementById("preview");
const previewContainer = document.getElementById("preview-container");

const painelEdicao = document.getElementById("painelEdicao");
const formEdicaoNoticia = document.getElementById("formEdicaoNoticia");
const edicaoId = document.getElementById("edicaoId");
const edicaoTitulo = document.getElementById("edicaoTitulo");
const edicaoDescricao = document.getElementById("edicaoDescricao");
const edicaoImagem = document.getElementById("edicaoImagem");

const previewEdicao = document.getElementById("previewEdicao");
const previewEdicaoContainer = document.getElementById(
  "preview-edicao-container"
);

let urlPreviewCadastro = null;
let urlPreviewEdicao = null;

// ==========================================
// AUXILIAR: RESPOSTA JSON
// ==========================================

async function lerResposta(response) {
  const texto = await response.text();

  if (!texto) return {};

  try {
    return JSON.parse(texto);
  } catch {
    return {
      erro: "O servidor retornou uma resposta inválida."
    };
  }
}

// ==========================================
// AUXILIAR: VALIDAR IMAGEM
// ==========================================

function imagemValida(arquivo) {
  if (!arquivo) return true;

  if (!arquivo.type.startsWith("image/")) {
    alert("Selecione um arquivo de imagem válido.");
    return false;
  }

  if (arquivo.size > 5 * 1024 * 1024) {
    alert("A imagem deve ter no máximo 5 MB.");
    return false;
  }

  return true;
}

// ==========================================
// AUXILIAR: PREVIEW
// ==========================================

function limparPreviewCadastro() {
  if (urlPreviewCadastro) {
    URL.revokeObjectURL(urlPreviewCadastro);
    urlPreviewCadastro = null;
  }
}

function limparPreviewEdicao() {
  if (urlPreviewEdicao) {
    URL.revokeObjectURL(urlPreviewEdicao);
    urlPreviewEdicao = null;
  }
}

// ==========================================
// PREVIEW DO CADASTRO
// ==========================================

if (imagemFile && preview && previewContainer) {
  imagemFile.addEventListener("change", () => {
    limparPreviewCadastro();

    const arquivo = imagemFile.files[0];

    if (!arquivo) {
      preview.removeAttribute("src");
      previewContainer.style.display = "none";
      return;
    }

    if (!imagemValida(arquivo)) {
      imagemFile.value = "";
      preview.removeAttribute("src");
      previewContainer.style.display = "none";
      return;
    }

    urlPreviewCadastro = URL.createObjectURL(arquivo);
    preview.src = urlPreviewCadastro;
    previewContainer.style.display = "block";
  });
}

// ==========================================
// CADASTRAR NOTÍCIA
// ==========================================

if (formNoticia) {
  formNoticia.addEventListener("submit", async (event) => {
    event.preventDefault();

    const titulo = document.getElementById("titulo").value.trim();
    const descricao = document.getElementById("descricao").value.trim();
    const arquivo = imagemFile?.files[0];

    if (!titulo || !descricao) {
      alert("Título e descrição são obrigatórios.");
      return;
    }

    if (!imagemValida(arquivo)) {
      return;
    }

    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("descricao", descricao);

    if (arquivo) {
      formData.append("imagem", arquivo);
    }

    const botao = formNoticia.querySelector('button[type="submit"]');
    if (botao) botao.disabled = true;

    try {
      const response = await fetch("/admin/noticias", {
        method: "POST",
        body: formData
      });

      const data = await lerResposta(response);

      if (!response.ok) {
        alert(data.erro || "Erro ao cadastrar notícia.");
        return;
      }

      alert(data.mensagem || "Notícia cadastrada com sucesso!");
      window.location.reload();
    } catch (error) {
      console.error("Erro ao cadastrar notícia:", error);
      alert("Erro ao conectar com o servidor.");
    } finally {
      if (botao) botao.disabled = false;
    }
  });
}

// ==========================================
// ABRIR EDIÇÃO
// ==========================================

function editarNoticia(card) {
  if (
    !painelEdicao ||
    !formEdicaoNoticia ||
    !edicaoId ||
    !edicaoTitulo ||
    !edicaoDescricao
  ) {
    alert("O formulário de edição não foi encontrado.");
    return;
  }

  edicaoId.value = card.dataset.id || "";
  edicaoTitulo.value = card.dataset.titulo || "";
  edicaoDescricao.value = card.dataset.descricao || "";

  if (edicaoImagem) {
    edicaoImagem.value = "";
  }

  limparPreviewEdicao();

  const imagemAtual = card.dataset.imagem || "";

  if (previewEdicao && previewEdicaoContainer && imagemAtual) {
    previewEdicao.src = imagemAtual;
    previewEdicaoContainer.style.display = "block";
  } else if (previewEdicao && previewEdicaoContainer) {
    previewEdicao.removeAttribute("src");
    previewEdicaoContainer.style.display = "none";
  }

  painelEdicao.hidden = false;

  painelEdicao.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });

  edicaoTitulo.focus();
}

// ==========================================
// PREVIEW DA EDIÇÃO
// ==========================================

if (edicaoImagem) {
  edicaoImagem.addEventListener("change", () => {
    limparPreviewEdicao();

    const arquivo = edicaoImagem.files[0];

    if (!arquivo) {
      return;
    }

    if (!imagemValida(arquivo)) {
      edicaoImagem.value = "";
      return;
    }

    if (previewEdicao && previewEdicaoContainer) {
      urlPreviewEdicao = URL.createObjectURL(arquivo);
      previewEdicao.src = urlPreviewEdicao;
      previewEdicaoContainer.style.display = "block";
    }
  });
}

// ==========================================
// CANCELAR EDIÇÃO
// ==========================================

function cancelarEdicaoNoticia() {
  if (!formEdicaoNoticia || !painelEdicao) return;

  formEdicaoNoticia.reset();
  painelEdicao.hidden = true;

  if (previewEdicao) {
    previewEdicao.removeAttribute("src");
  }

  if (previewEdicaoContainer) {
    previewEdicaoContainer.style.display = "none";
  }

  limparPreviewEdicao();
}

const botaoCancelar = document.getElementById("cancelarEdicao");

if (botaoCancelar) {
  botaoCancelar.addEventListener("click", cancelarEdicaoNoticia);
}

// ==========================================
// SALVAR EDIÇÃO
// ==========================================

if (formEdicaoNoticia) {
  formEdicaoNoticia.addEventListener("submit", async (event) => {
    event.preventDefault();

    const id = edicaoId.value;
    const titulo = edicaoTitulo.value.trim();
    const descricao = edicaoDescricao.value.trim();
    const arquivo = edicaoImagem?.files[0];

    if (!id) {
      alert("Não foi possível identificar a notícia.");
      return;
    }

    if (!titulo || !descricao) {
      alert("Título e descrição são obrigatórios.");
      return;
    }

    if (!imagemValida(arquivo)) {
      return;
    }

    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("descricao", descricao);

    if (arquivo) {
      formData.append("imagem", arquivo);
    }

    const botao = formEdicaoNoticia.querySelector('button[type="submit"]');
    if (botao) botao.disabled = true;

    try {
      const response = await fetch(
        `/admin/noticias/${encodeURIComponent(id)}`,
        {
          method: "PUT",
          body: formData
        }
      );

      const data = await lerResposta(response);

      if (!response.ok) {
        alert(data.erro || "Erro ao atualizar notícia.");
        return;
      }

      alert(data.mensagem || "Notícia atualizada com sucesso!");
      window.location.reload();
    } catch (error) {
      console.error("Erro ao atualizar notícia:", error);
      alert("Erro ao conectar com o servidor.");
    } finally {
      if (botao) botao.disabled = false;
    }
  });
}

// ==========================================
// AÇÕES DOS CARDS
// ==========================================

const listaNoticias = document.getElementById("listaNoticias");

if (listaNoticias) {
  listaNoticias.addEventListener("click", async (event) => {
    const botao = event.target.closest("button[data-action]");

    if (!botao) return;

    const card = botao.closest(".card-noticia");

    if (!card) return;

    const id = card.dataset.id;
    const acao = botao.dataset.action;

    if (acao === "editar") {
      editarNoticia(card);
      return;
    }

    if (acao === "arquivar") {
      if (!confirm("Deseja arquivar esta notícia?")) return;

      await executarAcao(
        `/admin/noticias/${encodeURIComponent(id)}/arquivar`,
        "PATCH",
        "Notícia arquivada com sucesso."
      );

      return;
    }

    if (acao === "desarquivar") {
      await executarAcao(
        `/admin/noticias/${encodeURIComponent(id)}/desarquivar`,
        "PATCH",
        "Notícia desarquivada com sucesso."
      );

      return;
    }

    if (acao === "excluir") {
      if (
        !confirm(
          "Tem certeza de que deseja excluir esta notícia? Esta ação não pode ser desfeita."
        )
      ) {
        return;
      }

      await executarAcao(
        `/admin/noticias/${encodeURIComponent(id)}`,
        "DELETE",
        "Notícia excluída com sucesso."
      );
    }
  });
}

// ==========================================
// EXECUTAR AÇÃO NO SERVIDOR
// ==========================================

async function executarAcao(url, method, mensagemSucesso) {
  try {
    const response = await fetch(url, { method });
    const data = await lerResposta(response);

    if (!response.ok) {
      alert(data.erro || "Não foi possível executar a operação.");
      return;
    }

    alert(data.mensagem || mensagemSucesso);
    window.location.reload();
  } catch (error) {
    console.error("Erro ao executar ação:", error);
    alert("Erro ao conectar com o servidor.");
  }
}
