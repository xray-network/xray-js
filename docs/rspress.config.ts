import { defineConfig } from "@rspress/core"

export default defineConfig({
  root: "src/pages",
  outDir: "build/xray-js",
  base: "/xray-js/",
  themeDir: "src/theme",
  title: "XRAY JS",
  description: "XRAY JS documentation.",
  route: { cleanUrls: true },
  themeConfig: {
    darkMode: "auto",
    enableAppearanceAnimation: true,
    nav: [
      { text: "Wiki", link: "https://wiki.xraynetwork.io/" },
      { text: "XRAY JS", link: "https://wiki.xraynetwork.io/xray-js/" },
      { text: "Cardano Lib", link: "https://wiki.xraynetwork.io/cardano-lib/" }
    ]
  }
})
