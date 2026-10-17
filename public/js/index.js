
document.addEventListener("DOMContentLoaded", () => {
  const elementos = document.querySelectorAll(".inicio-revelar");

  if (!elementos.length) return;

  // Respeita a preferência de acessibilidade do navegador.
  const movimentoReduzido = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (movimentoReduzido || !("IntersectionObserver" in window)) {
    elementos.forEach((elemento) => {
      elemento.classList.add("inicio-visivel");
    });

    return;
  }

  elementos.forEach((elemento, index) => {
    elemento.classList.add("inicio-aguardando");

    // Pequeno atraso entre cards vizinhos.
    if (
      elemento.classList.contains("inicio-card") ||
      elemento.classList.contains("inicio-cabecalho")
    ) {
      elemento.style.transitionDelay = `${(index % 3) * 100}ms`;
    }
  });

  const observador = new IntersectionObserver(
    (entradas, instancia) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add("inicio-visivel");
          entrada.target.classList.remove("inicio-aguardando");

          instancia.unobserve(entrada.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -30px 0px"
    }
  );

  elementos.forEach((elemento) => {
    observador.observe(elemento);
  });
});
