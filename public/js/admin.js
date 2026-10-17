
"use strict";

// ==========================================
// AUXILIAR
// ==========================================

async function alterarStatusSecao(url, mensagemErro) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Accept": "application/json"
      }
    });

    const texto = await response.text();
    let data = {};

    try {
      data = texto ? JSON.parse(texto) : {};
    } catch {
      data = {};
    }

    if (!response.ok) {
      alert(data.erro || data.mensagem || mensagemErro);
      return;
    }

    alert(data.mensagem || "Operação realizada com sucesso.");
    window.location.reload();
  } catch (error) {
    console.error("Erro ao alterar status da seção:", error);
    alert("Erro ao conectar com o servidor.");
  }
}

// ==========================================
// NOTÍCIAS
// ==========================================

function ativarNoticias() {
  return alterarStatusSecao(
    "/admin/noticias/ativar",
    "Erro ao ativar a seção de notícias."
  );
}

function desativarNoticias() {
  if (!confirm("Deseja desativar a seção Notícias?")) {
    return;
  }

  return alterarStatusSecao(
    "/admin/noticias/desativar",
    "Erro ao desativar a seção de notícias."
  );
}

// ==========================================
// APLICAÇÕES
// ==========================================

function ativarAplicacoes() {
  return alterarStatusSecao(
    "/admin/aplicacoes/ativar",
    "Erro ao ativar a seção de aplicações."
  );
}

function desativarAplicacoes() {
  if (!confirm("Deseja desativar a seção Aplicações?")) {
    return;
  }

  return alterarStatusSecao(
    "/admin/aplicacoes/desativar",
    "Erro ao desativar a seção de aplicações."
  );
}
