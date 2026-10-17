
/* =========================================================
   IONOS DESSALINIZAÇÃO — ANIMAÇÕES DAS NOTÍCIAS
   Arquivo: public/js/noticias.js
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const elementos = document.querySelectorAll(".noticias-reveal");

  if (!("IntersectionObserver" in window)) {
    elementos.forEach((elemento) => {
      elemento.classList.add("is-visible");
    });

    return;
  }

  const observador = new IntersectionObserver(
    (entradas, observer) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add("is-visible");
          observer.unobserve(entrada.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -35px 0px"
    }
  );

  elementos.forEach((elemento) => {
    observador.observe(elemento);
  });
});
