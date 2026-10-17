
// ==========================================
// PREVIEW DA IMAGEM
// ==========================================

const imagemFile =
  document.getElementById("imagemFile");

const preview =
  document.getElementById("preview");

const previewContainer =
  document.getElementById("preview-container");


if (imagemFile) {

  imagemFile.addEventListener(
    "change",
    () => {

      const file =
        imagemFile.files[0];

      if (!file) {

        previewContainer.style.display =
          "none";

        return;
      }


      const url =
        URL.createObjectURL(file);

      preview.src = url;

      previewContainer.style.display =
        "block";

    }
  );

}


// ==========================================
// CRIAR APLICAÇÃO
// ==========================================

const form =
  document.getElementById("formAplicacao");


if (form) {

  form.addEventListener(
    "submit",
    async (event) => {

      event.preventDefault();


      const titulo =
        document.getElementById("titulo").value;

      const descricao =
        document.getElementById("descricao").value;


      const imagem =
        document.getElementById("imagemFile");

      let imagemUrl = "";


      /*
       * Por enquanto estamos enviando
       * somente os dados da aplicação.
       *
       * Quando configurarmos Firebase Storage,
       * o upload da imagem será feito aqui.
       */

      if (imagem.files.length > 0) {

        console.log(
          "Imagem selecionada:",
          imagem.files[0]
        );

      }


      try {

        const response =
          await fetch(
            "/admin/aplicacoes",
            {

              method: "POST",

              headers: {
                "Content-Type":
                  "application/json"
              },

              body: JSON.stringify({
                titulo,
                descricao,
                imagemUrl
              })

            }
          );


        const data =
          await response.json();


        if (!response.ok) {

          alert(
            data.erro ||
            "Erro ao criar aplicação."
          );

          return;
        }


        alert(
          "Aplicação criada com sucesso!"
        );


        window.location.reload();

      } catch (error) {

        console.error(error);

        alert(
          "Erro ao conectar com o servidor."
        );

      }

    }
  );

}


// ==========================================
// ARQUIVAR
// ==========================================

async function arquivarAplicacao(id) {

  if (
    !confirm(
      "Deseja arquivar esta aplicação?"
    )
  ) {

    return;

  }


  try {

    const response =
      await fetch(
        `/admin/aplicacoes/${id}/arquivar`,
        {
          method: "PATCH"
        }
      );


    const data =
      await response.json();


    if (!response.ok) {

      alert(
        data.erro ||
        "Erro ao arquivar aplicação."
      );

      return;
    }


    window.location.reload();


  } catch (error) {

    console.error(error);

    alert(
      "Erro ao conectar com o servidor."
    );

  }

}


// ==========================================
// DESARQUIVAR
// ==========================================

async function desarquivarAplicacao(id) {

  try {

    const response =
      await fetch(
        `/admin/aplicacoes/${id}/desarquivar`,
        {
          method: "PATCH"
        }
      );


    const data =
      await response.json();


    if (!response.ok) {

      alert(
        data.erro ||
        "Erro ao desarquivar aplicação."
      );

      return;
    }


    window.location.reload();


  } catch (error) {

    console.error(error);

    alert(
      "Erro ao conectar com o servidor."
    );

  }

}


// ==========================================
// DELETAR
// ==========================================

async function deletarAplicacao(id) {

  if (
    !confirm(
      "Tem certeza que deseja deletar esta aplicação? Esta ação não pode ser desfeita."
    )
  ) {

    return;

  }


  try {

    const response =
      await fetch(
        `/admin/aplicacoes/${id}`,
        {
          method: "DELETE"
        }
      );


    const data =
      await response.json();


    if (!response.ok) {

      alert(
        data.erro ||
        "Erro ao deletar aplicação."
      );

      return;
    }


    window.location.reload();


  } catch (error) {

    console.error(error);

    alert(
      "Erro ao conectar com o servidor."
    );

  }

}


// ==========================================
// EDITAR
// ==========================================

function editarAplicacao(
  id,
  titulo,
  descricao,
  imagemUrl
) {

  const novoTitulo =
    prompt(
      "Título da aplicação:",
      titulo
    );


  if (
    novoTitulo === null ||
    novoTitulo.trim() === ""
  ) {

    return;

  }


  const novaDescricao =
    prompt(
      "Descrição da aplicação:",
      descricao
    );


  if (
    novaDescricao === null ||
    novaDescricao.trim() === ""
  ) {

    return;

  }


  atualizarAplicacao(
    id,
    novoTitulo,
    novaDescricao,
    imagemUrl
  );

}


// ==========================================
// ATUALIZAR
// ==========================================

async function atualizarAplicacao(
  id,
  titulo,
  descricao,
  imagemUrl
) {

  try {

    const response =
      await fetch(
        `/admin/aplicacoes/${id}`,
        {

          method: "PUT",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            titulo,
            descricao,
            imagemUrl
          })

        }
      );


    const data =
      await response.json();


    if (!response.ok) {

      alert(
        data.erro ||
        "Erro ao atualizar aplicação."
      );

      return;

    }


    alert(
      "Aplicação atualizada com sucesso!"
    );


    window.location.reload();


  } catch (error) {

    console.error(error);

    alert(
      "Erro ao conectar com o servidor."
    );

  }

}
