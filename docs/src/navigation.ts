import type { Sidebar } from "@rspress/core"

export const documentationSections = [
  {
    text: "Docs",
    href: "/",
    paths: ["/"],
    icon: "M3 10 12 3l9 7M5 9v12h5v-7h4v7h5V9",
    sidebar: [
      { sectionHeaderText: "SDK" },
      { text: "Overview", link: "/" },
      { sectionHeaderText: "Packages" },
      { text: "Runtime", link: "https://github.com/xray-network/xray-js/tree/main/packages/runtime" },
      { text: "Cardano", link: "https://github.com/xray-network/xray-js/tree/main/packages/cardano" },
      { text: "Mini App Bridge", link: "https://github.com/xray-network/xray-js/tree/main/packages/mini-app-bridge" }
    ]
  }
] satisfies { text: string; href: string; paths: string[]; icon: string; sidebar: Sidebar[string] }[]
