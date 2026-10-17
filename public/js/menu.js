
/* =========================================================
   IONOS — ESTADO DO CABEÇALHO E TROCA DE LOGO
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const logo = header?.querySelector(".site-logo img");

  if (!header || !logo) {
    return;
  }

  const logoBranca =
    logo.dataset.logoWhite || "/images/logo/logo-ionos-branca.png";

  const logoColorida =
    logo.dataset.logoColor || "/images/logo/ionos-logo.png";

  const paginaInicial =
    document.body.classList.contains("pagina-inicial");

  const atualizarHeader = () => {
    // Nas páginas internas, o cabeçalho usa sempre o logo colorido.
    if (!paginaInicial) {
      header.classList.remove("is-scrolled");

      if (!logo.src.endsWith(logoColorida)) {
        logo.src = logoColorida;
      }

      return;
    }

    const rolouPagina = window.scrollY > 40;

    header.classList.toggle("is-scrolled", rolouPagina);

    const logoDesejada = rolouPagina
      ? logoColorida
      : logoBranca;

    if (!logo.src.endsWith(logoDesejada)) {
      logo.src = logoDesejada;
    }
  };

  atualizarHeader();

  window.addEventListener("scroll", atualizarHeader, {
    passive: true
  });

  window.addEventListener("pageshow", atualizarHeader);
});
