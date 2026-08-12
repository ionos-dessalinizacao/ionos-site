// ==========================================
// ATIVAR NOTÍCIAS
// ==========================================

async function ativarNoticias() {

  try {

    const resposta = await fetch(
      "/admin/noticias/ativar",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    const resultado = await resposta.json();

    if (!resposta.ok || !resultado.sucesso) {
      throw new Error(resultado.mensagem);
    }

    alert("Seção de notícias ativada com sucesso!");

    window.location.reload();

  } catch (error) {

    console.error(error);

    alert(
      "Erro ao ativar a seção de notícias."
    );

  }

}


// ==========================================
// DESATIVAR NOTÍCIAS
// ==========================================

async function desativarNoticias() {

  const confirmar = confirm(
    "Tem certeza que deseja desativar a seção de notícias do site?"
  );

  if (!confirmar) {
    return;
  }

  try {

    const resposta = await fetch(
      "/admin/noticias/desativar",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    const resultado = await resposta.json();

    if (!resposta.ok || !resultado.sucesso) {
      throw new Error(resultado.mensagem);
    }

    alert("Seção de notícias desativada com sucesso!");

    window.location.reload();

  } catch (error) {

    console.error(error);

    alert(
      "Erro ao desativar a seção de notícias."
    );

  }

}