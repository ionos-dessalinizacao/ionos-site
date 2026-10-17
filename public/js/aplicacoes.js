
/* =========================================================
   IONOS DESSALINIZAÇÃO — ANIMAÇÕES DAS APLICAÇÕES
   Arquivo: public/js/aplicacoes.js
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const elementos = document.querySelectorAll(".aplicacoes-reveal");

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
