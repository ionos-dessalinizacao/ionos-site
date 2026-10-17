
const { db } = require("../config/firebase");

const conteudoPadrao = {
  hero: {
    titulo: "Ionos Dessalinização",
    descricao:
      "Somos uma startup focada no desenvolvimento de sistemas de dessalinização para a produção de água de qualidade de forma eficiente e sustentável.",
    botaoTexto: "Conheça nossa tecnologia",
    botaoLink: "#technology"
  },

  tecnologia: {
    eyebrow: "Nossa tecnologia",
    titulo: "A Tecnologia",
    subtitulo: "Deionização Capacitiva (CDI)",
    cards: [
      {
        titulo: "A Deionização Capacitiva",
        descricao:
          "A tecnologia CDI oferece uma alternativa eficiente para a dessalinização de águas salobras, com menor consumo de energia em determinadas condições de operação."
      },
      {
        titulo: "Monitoramento Remoto",
        descricao:
          "Acompanhamento em tempo real dos sistemas, permitindo identificar necessidades de manutenção e acompanhar o desempenho do equipamento."
      },
      {
        titulo: "Controle Inteligente",
        descricao:
          "Sensores e algoritmos ajudam a otimizar os ciclos de operação e a vida útil dos materiais utilizados no processo."
      }
    ]
  },

  conquistas: {
    eyebrow: "Nossa trajetória",
    titulo: "Nossas Conquistas",
    descricao:
      "Estamos orgulhosos de sermos reconhecidos em programas de inovação e aceleração que validam nosso impacto e tecnologia.",
    cards: [
      {
        titulo: "Incubação no Partec - UFC",
        tag: "Mais Recente",
        descricao:
          "Em 2025, fomos aprovados no processo de incubação do Partec, Parque Tecnológico da Universidade Federal do Ceará."
      },
      {
        titulo: "Empreende UFC & Corredores Digitais",
        tag: "",
        descricao:
          "Em 2025, conquistamos o 1º lugar no Demoday da fase BORA CRIAR do programa Empreende UFC, em parceria com o Corredores Digitais."
      },
      {
        titulo: "Catalisa ICT (SEBRAE)",
        tag: "",
        descricao:
          "Em 2025, fomos aprovados na primeira fase do programa Catalisa ICT do SEBRAE."
      }
    ]
  }
};

function combinarConteudo(salvo) {
  if (!salvo) {
    return conteudoPadrao;
  }

  return {
    hero: {
      ...conteudoPadrao.hero,
      ...(salvo.hero || {})
    },
    tecnologia: {
      ...conteudoPadrao.tecnologia,
      ...(salvo.tecnologia || {}),
      cards: conteudoPadrao.tecnologia.cards.map((padrao, i) => ({
        ...padrao,
        ...((salvo.tecnologia?.cards || [])[i] || {})
      }))
    },
    conquistas: {
      ...conteudoPadrao.conquistas,
      ...(salvo.conquistas || {}),
      cards: conteudoPadrao.conquistas.cards.map((padrao, i) => ({
        ...padrao,
        ...((salvo.conquistas?.cards || [])[i] || {})
      }))
    }
  };
}

async function pegarConteudoInicio() {
  const doc = await db
    .collection("configuracoes")
    .doc("conteudoInicio")
    .get();

  return combinarConteudo(doc.exists ? doc.data() : null);
}

async function salvarConteudoInicio(dados) {
  const conteudo = combinarConteudo(dados);

  await db
    .collection("configuracoes")
    .doc("conteudoInicio")
    .set(conteudo, { merge: true });

  return conteudo;
}

module.exports = {
  pegarConteudoInicio,
  salvarConteudoInicio
};
