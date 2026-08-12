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
// CRIAR NOTÍCIA
// ==========================================

const form =
  document.getElementById("formNoticia");


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
       * somente os dados da notícia.
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
            "/admin/noticias",
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
            "Erro ao criar notícia."
          );

          return;
        }


        alert(
          "Notícia criada com sucesso!"
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

async function arquivar(id) {

  if (
    !confirm(
      "Deseja arquivar esta notícia?"
    )
  ) {

    return;

  }


  try {

    const response =
      await fetch(
        `/admin/noticias/${id}/arquivar`,
        {
          method: "PATCH"
        }
      );


    const data =
      await response.json();


    if (!response.ok) {

      alert(
        data.erro ||
        "Erro ao arquivar notícia."
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

async function desarquivar(id) {

  try {

    const response =
      await fetch(
        `/admin/noticias/${id}/desarquivar`,
        {
          method: "PATCH"
        }
      );


    const data =
      await response.json();


    if (!response.ok) {

      alert(
        data.erro ||
        "Erro ao desarquivar notícia."
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

async function deletar(id) {

  if (
    !confirm(
      "Tem certeza que deseja deletar esta notícia? Esta ação não pode ser desfeita."
    )
  ) {

    return;

  }


  try {

    const response =
      await fetch(
        `/admin/noticias/${id}`,
        {
          method: "DELETE"
        }
      );


    const data =
      await response.json();


    if (!response.ok) {

      alert(
        data.erro ||
        "Erro ao deletar notícia."
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

function editarNoticia(
  id,
  titulo,
  descricao,
  imagemUrl
) {

  const novoTitulo =
    prompt(
      "Título da notícia:",
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
      "Descrição da notícia:",
      descricao
    );


  if (
    novaDescricao === null ||
    novaDescricao.trim() === ""
  ) {

    return;

  }


  atualizarNoticia(
    id,
    novoTitulo,
    novaDescricao,
    imagemUrl
  );

}


// ==========================================
// ATUALIZAR
// ==========================================

async function atualizarNoticia(
  id,
  titulo,
  descricao,
  imagemUrl
) {

  try {

    const response =
      await fetch(
        `/admin/noticias/${id}`,
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
        "Erro ao atualizar notícia."
      );

      return;

    }


    alert(
      "Notícia atualizada com sucesso!"
    );


    window.location.reload();


  } catch (error) {

    console.error(error);

    alert(
      "Erro ao conectar com o servidor."
    );

  }

}