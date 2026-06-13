import base from "./akali-base.jpg.asset.json";
import shadow from "./akali-shadow.jpg.asset.json";
import bloodmoon from "./akali-bloodmoon.jpg.asset.json";
import starguardian from "./akali-starguardian.jpg.asset.json";

export const akaliImages = {
  base: { src: base.url, alt: "Akali, the Rogue Assassin — base splash art" },
  shadow: { src: shadow.url, alt: "Akali in shadow — moody portrait with back tattoo" },
  bloodmoon: { src: bloodmoon.url, alt: "Akali, Blood Moon skin splash art" },
  starguardian: { src: starguardian.url, alt: "Akali, Star Guardian skin splash art" },
} as const;
