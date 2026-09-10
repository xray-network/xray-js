import { removeBase, useLocation } from "@rspress/core/runtime"
import { Link } from "@rspress/core/theme-original"

import { documentationSections } from "../navigation"

export function SectionTabs() {
  const { pathname } = useLocation()
  const path = removeBase(pathname).replace(/(?:\/index)?\.html$/, "").replace(/\/$/, "") || "/"
  if (documentationSections.length < 2) return null
  return (
    <nav className="spectre-section-tabs" aria-label="Documentation sections">
      <div className="spectre-section-tabs__inner">
        {documentationSections.map(tab => {
          const active = tab.paths.some(prefix => path === prefix || (prefix !== "/" && path.startsWith(`${prefix}/`)))
          return (
            <Link key={tab.text} href={tab.href} className="spectre-section-tab" aria-current={active ? "page" : undefined}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d={tab.icon} />
              </svg>
              {tab.text}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
