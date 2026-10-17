
document.addEventListener("DOMContentLoaded", () => {
  // ========================================
  // ANIMAÇÕES AO ROLAR A PÁGINA
  // ========================================

  const elementosReveal = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, observerInstance) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
            observerInstance.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    elementosReveal.forEach((elemento) => {
      observer.observe(elemento);
    });
  } else {
    elementosReveal.forEach((elemento) => {
      elemento.classList.add("active");
    });
  }

  // ========================================
  // ANIMAÇÃO SEQUENCIAL DOS CARDS
  // ========================================

  const gruposDeCards = [
    ".sobre-pilares__card",
    ".sobre-galeria__item"
  ];

  gruposDeCards.forEach((seletor) => {
    const cards = document.querySelectorAll(seletor);

    cards.forEach((card, index) => {
      card.classList.add("reveal");
      card.style.transitionDelay = `${(index % 4) * 100}ms`;

      if ("IntersectionObserver" in window) {
        observerCards.observe(card);
      } else {
        card.classList.add("active");
      }
    });
  });

  // Observador específico para os cards adicionados acima.
  // Os cards também podem já estar sendo observados pelo observador principal.
  function observarCards() {
    if (!("IntersectionObserver" in window)) return;

    document.querySelectorAll(
      ".sobre-pilares__card.reveal, .sobre-galeria__item.reveal"
    ).forEach((card) => {
      observerCards.observe(card);
    });
  }

  const observerCards = "IntersectionObserver" in window
    ? new IntersectionObserver(
        (entries, observerInstance) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("active");
              observerInstance.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: "0px 0px -30px 0px"
        }
      )
    : null;

  observarCards();

  // ========================================
  // LIGHTBOX DA GALERIA
  // ========================================

  const lightbox = document.querySelector(".lightbox");

  if (lightbox) {
    const imagemLightbox = lightbox.querySelector("img");
    const botaoFechar = lightbox.querySelector(
      "button, .lightbox-close, .fechar-lightbox"
    );

    const imagensGaleria = document.querySelectorAll(
      ".sobre-galeria__item img, [data-lightbox]"
    );

    function abrirLightbox(imagem) {
      if (!imagemLightbox) return;

      imagemLightbox.src = imagem.currentSrc || imagem.src;
      imagemLightbox.alt = imagem.alt || "Imagem ampliada";

      lightbox.classList.add("active");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";

      if (botaoFechar) {
        botaoFechar.focus();
      }
    }

    function fecharLightbox() {
      lightbox.classList.remove("active");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";

      if (imagemLightbox) {
        imagemLightbox.src = "";
      }
    }

    imagensGaleria.forEach((imagem) => {
      imagem.style.cursor = "pointer";

      imagem.addEventListener("click", () => {
        abrirLightbox(imagem);
      });
    });

    if (botaoFechar) {
      botaoFechar.addEventListener("click", fecharLightbox);
    }

    lightbox.addEventListener("click", (evento) => {
      if (evento.target === lightbox) {
        fecharLightbox();
      }
    });

    document.addEventListener("keydown", (evento) => {
      if (
        evento.key === "Escape" &&
        lightbox.classList.contains("active")
      ) {
        fecharLightbox();
      }
    });

    lightbox.setAttribute("aria-hidden", "true");
  }

  // ========================================
  // MOVIMENTO SUAVE PARA LINKS INTERNOS
  // ========================================

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (evento) => {
      const destinoId = link.getAttribute("href");

      if (!destinoId || destinoId === "#") return;

      const destino = document.querySelector(destinoId);

      if (!destino) return;

      evento.preventDefault();

      destino.scrollIntoView({
        behavior: window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches
          ? "auto"
          : "smooth",
        block: "start"
      });
    });
  });

});
