import { useEffect, useState, createContext, useContext, type ReactNode } from "react";

export type Language = "en" | "pt";

export interface TranslationSchema {
  preloader: {
    loading: string;
  };
  navbar: {
    overview: string;
    lore: string;
    abilities: string;
    skins: string;
  };
  hero: {
    sub: string;
    level: string;
    tagline: string;
    taglineBold: string;
    taglineEnd: string;
    meta: string;
    scroll: string;
  };
  lore: {
    label: string;
    title: string;
    titleBold: string;
    titleEnd: string;
    beats: string[];
  };
  abilities: {
    label: string;
    title: string;
    titleBold: string;
    cards: {
      key: string;
      name: string;
      desc: string;
    }[];
  };
  skins: {
    label: string;
    stage: string;
    list: {
      name: string;
      tag: string;
    }[];
  };
  footer: {
    label: string;
    title: string;
    titleBold: string;
    disclaimer: string;
    craftedBy: string;
    linksLabel: string;
  };
}

const dictionaries: Record<Language, TranslationSchema> = {
  en: {
    preloader: {
      loading: "LOADING",
    },
    navbar: {
      overview: "Overview",
      lore: "Lore",
      abilities: "Abilities",
      skins: "Skins",
    },
    hero: {
      sub: "忍 — Kinkou / Renegade",
      level: "Lv. 18 · Ionia",
      tagline: "The ",
      taglineBold: "Rogue Assassin",
      taglineEnd: ". Shadow without an order.",
      meta: "A fan-made tribute · Motion study · 2026",
      scroll: "Scroll",
    },
    lore: {
      label: "Lore",
      title: "A shadow that ",
      titleBold: "refused",
      titleEnd: " its order.",
      beats: [
        "Once the Fist of Shadow within the Kinkou Order, sworn to maintain the sacred balance of Ionia.",
        "She turned away from that cold doctrine to defend her people by her own deadly path — answering threats with steel, not philosophy.",
        "Twin kama at her hips. A fan of kunai at her back. A shadow that strikes without warning, carrying the weight of a renegade legacy.",
      ],
    },
    abilities: {
      label: "Kit · Mechanics",
      title: "Five strikes. ",
      titleBold: "No mercy.",
      cards: [
        {
          key: "P",
          name: "Assassin's Mark",
          desc: "Damaging a champion creates a ring. Crossing it empowers her next attack with bonus range and damage.",
        },
        {
          key: "Q",
          name: "Five Point Strike",
          desc: "Hurls five kunai in a cone, damaging and slowing enemies in their path.",
        },
        {
          key: "W",
          name: "Twilight Shroud",
          desc: "Creates a shroud of smoke, gaining speed and turning invisible. Attacking briefly reveals her.",
        },
        {
          key: "E",
          name: "Shuriken Flip",
          desc: "Flips backward and hurls a shuriken forward, marking and damaging the first target hit.",
        },
        {
          key: "R",
          name: "Perfect Execution",
          desc: "Leaps to dash through enemies, damaging them. Recasting performs a second execution dash.",
        },
      ],
    },
    skins: {
      label: "Skins · Identities",
      stage: "STAGE",
      list: [
        {
          name: "True Damage Akali",
          tag: "Spitting fire on the mic and striking from the neon shadows. The street-style hip-hop ninja.",
        },
        {
          name: "Nurse Akali",
          tag: "Medical steel. Hypodermic blue. Critical care on the cutting edge.",
        },
        {
          name: "Silverfang Akali",
          tag: "Steel grey armor. Silent steps. Striking like lightning through the neon mist.",
        },
        {
          name: "Blood Moon Akali",
          tag: "Demon mask. Crimson tide. A bone-white smile beneath the scarlet sky.",
        },
        {
          name: "K/DA All Out Akali",
          tag: "Under the stage lights. Rebel attitude. Pop the world with unmatched style.",
        },
        {
          name: "Star Guardian Akali",
          tag: "Shining among the stars. Fusing magic and shadow to protect the universe.",
        },
        {
          name: "DRX Akali",
          tag: "Futuristic cold steel. Cybernetic grace. The championship colors of the dragon.",
        },
        {
          name: "Prestige Coven Akali",
          tag: "Ancient darkness. Haute couture. High priestess of the old gods.",
        },
      ],
    },
    footer: {
      label: "End · Credits",
      title: "Balance is a ",
      titleBold: "choice.",
      disclaimer:
        "Fan-made project. Akali and League of Legends are property of Riot Games. This project is not affiliated with or endorsed by Riot Games.",
      craftedBy: "Crafted by ",
      linksLabel: "Elsewhere",
    },
  },
  pt: {
    preloader: {
      loading: "CARREGANDO",
    },
    navbar: {
      overview: "Visão Geral",
      lore: "História",
      abilities: "Habilidades",
      skins: "Skins",
    },
    hero: {
      sub: "忍 — Kinkou / Renegada",
      level: "Nv. 18 · Iônia",
      tagline: "A ",
      taglineBold: "Assassina Renegada",
      taglineEnd: ". Sombra sem mestre.",
      meta: "Tributo feito por fã · Estudo de movimento · 2026",
      scroll: "Rolar",
    },
    lore: {
      label: "História",
      title: "Uma sombra que ",
      titleBold: "recusou",
      titleEnd: " sua ordem.",
      beats: [
        "Outrora a Punho das Sombras da Ordem Kinkou, jurada a manter o equilíbrio sagrado de Iônia.",
        "Ela se afastou daquela doutrina fria para defender seu povo por seu próprio caminho letal — respondendo a ameaças com aço, não filosofia.",
        "Kamas gêmeas em seus quadris. Um leque de kunais em suas costas. Uma sombra que ataca sem aviso, carregando o peso de um legado renegado.",
      ],
    },
    abilities: {
      label: "Kit · Mecânicas",
      title: "Cinco golpes. ",
      titleBold: "Sem piedade.",
      cards: [
        {
          key: "P",
          name: "Marca do Assassino",
          desc: "Causar dano de habilidade a um campeão cria um anel. Atravessá-lo fortalece seu próximo ataque com alcance e dano bônus.",
        },
        {
          key: "Q",
          name: "Golpe de Cinco Pontas",
          desc: "Atira cinco kunais em cone, causando dano e lentidão aos inimigos atingidos no caminho.",
        },
        {
          key: "W",
          name: "Proteção do Crepúsculo",
          desc: "Cria uma cortina de fumaça, ganhando velocidade de movimento e ficando invisível. Atacar a revela brevemente.",
        },
        {
          key: "E",
          name: "Acrobacia Shuriken",
          desc: "Dá uma cambalhota para trás e atira uma shuriken para frente, marcando e causando dano ao primeiro alvo atingido.",
        },
        {
          key: "R",
          name: "Execução Perfeita",
          desc: "Salta para avançar através dos inimigos, causando dano. Reconjurar realiza um segundo avanço de execução.",
        },
      ],
    },
    skins: {
      label: "Skins · Identidades",
      stage: "PALCO",
      list: [
        {
          name: "Akali True Damage",
          tag: "Cuspindo fogo no microfone e atacando das sombras neon. A ninja do hip-hop com estilo de rua.",
        },
        {
          name: "Akali Enfermeira",
          tag: "Aço cirúrgico. Azul hipodérmico. Cuidados críticos na ponta da lâmina.",
        },
        {
          name: "Akali Presas de Prata",
          tag: "Armadura cinza aço. Passos silenciosos. Golpeie como um raio sob a névoa neon.",
        },
        {
          name: "Akali Lua Sangrenta",
          tag: "Máscara demoníaca. Maré carmesim. Um sorriso de osso sob o céu escarlate.",
        },
        {
          name: "Akali K/DA All Out",
          tag: "Sob as luzes do palco. Atitude rebelde. Conquiste o mundo com estilo incomparável.",
        },
        {
          name: "Akali Guardiã Estelar",
          tag: "Brilhando entre as estrelas. Fusão de magia e sombras para proteger o universo.",
        },
        {
          name: "Akali DRX",
          tag: "Aço futurista e frio. Graça cibernética. As cores campeãs do dragão.",
        },
        {
          name: "Akali Congregação das Bruxas de Prestígio",
          tag: "Trevas antigas. Alta costura. Alta sacerdotisa dos deuses antigos.",
        },
      ],
    },
    footer: {
      label: "Fim · Créditos",
      title: "O equilíbrio é uma ",
      titleBold: "escolha.",
      disclaimer:
        "Projeto feito por fã. Akali e League of Legends são propriedades da Riot Games. Este projeto não possui afiliação ou endosso da Riot Games.",
      craftedBy: "Desenvolvido por ",
      linksLabel: "Links",
    },
  },
};

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationSchema;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("pt"); // default to pt-br

  useEffect(() => {
    const saved = localStorage.getItem("akali-language") as Language;
    if (saved === "en" || saved === "pt") {
      setLanguageState(saved);
    } else {
      const userLang = navigator.language.toLowerCase();
      if (userLang.startsWith("pt")) {
        setLanguageState("pt");
      } else {
        setLanguageState("en");
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("akali-language", lang);
  };

  const t = dictionaries[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return context;
}
