import { defineConfig } from "@rspress/core"
import { documentationSections } from "./src/navigation"

export default defineConfig({
  root: "src/pages",
  outDir: "build/xray-js",
  base: "/xray-js/",
  siteOrigin: "https://wiki.xraynetwork.io",
  icon: "https://cdn.xraynetwork.io/favicon.png",
  themeDir: "src/theme",
  title: "XRAY JS",
  logo: "/xray-blue.svg",
  logoText: "XRAY JS",
  description: "XRAY JS documentation.",
  head: [
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:title", content: "XRAY JS — Modular JavaScript SDK" }],
    ["meta", { property: "og:description", content: "Runtime, Cardano APIs, and Mini App Bridge for XRAY applications." }]
  ],
  route: { cleanUrls: true },
  themeConfig: {
    fallbackHeadingTitle: false,
    darkMode: "dark",
    enableAppearanceAnimation: false,
    nav: [
      {
        text: "Back to Wiki",
        link: "https://wiki.xraynetwork.io",
        icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 5-7 7 7 7M5 12h14"/></svg>',
        position: "left"
      }
    ],
    sidebar: Object.fromEntries(
      documentationSections.flatMap(({ paths, sidebar }) =>
        paths.map(path => [path, sidebar])
      )
    )
  }
})
