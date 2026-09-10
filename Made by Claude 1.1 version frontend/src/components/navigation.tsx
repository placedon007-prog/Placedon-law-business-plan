"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Brand, Arrow } from "./brand";
import { globalContent } from "@/lib/placedon-content/content/shared";

function themeSnapshot() {
  try {
    return (
      (document.documentElement.dataset.theme ??
        localStorage.getItem("placedon-theme")) === "dark"
    );
  } catch {
    return false;
  }
}
function subscribeTheme(callback: () => void) {
  const storage = () => {
    delete document.documentElement.dataset.theme;
    callback();
  };
  window.addEventListener("storage", storage);
  window.addEventListener("placedon-theme-change", callback);
  return () => {
    window.removeEventListener("storage", storage);
    window.removeEventListener("placedon-theme-change", callback);
  };
}
export function Navigation() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const dark = useSyncExternalStore(subscribeTheme, themeSnapshot, () => false);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
  }, [dark]);
  const close = () => setOpen(false);
  function changeTheme() {
    const next = !dark;
    document.documentElement.dataset.theme = next ? "dark" : "light";
    try {
      localStorage.setItem("placedon-theme", next ? "dark" : "light");
    } catch {
      /* The choice still applies for this visit. */
    }
    window.dispatchEvent(new Event("placedon-theme-change"));
  }
  return (
    <header className="site-header">
      <div className="nav-inner">
        <Brand />
        <nav
          className="desktop-nav"
          aria-label={globalContent.header.navigationLabel}
        >
          {globalContent.header.links.map((link) => (
            <Link
              href={link.href}
              key={link.href}
              aria-current={path === link.href ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="nav-actions">
          <button
            className="theme-toggle"
            type="button"
            aria-label={dark ? "Use light appearance" : "Use dark appearance"}
            aria-pressed={dark}
            onClick={changeTheme}
          >
            <svg
              aria-hidden="true"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <circle cx="12" cy="12" r="7" />
              <path d="M12 5a7 7 0 0 1 0 14Z" fill="currentColor" />
            </svg>
          </button>
          <Link
            className="button button-gold nav-pilot"
            href="/waitlist?intent=pilot"
          >
            Request a pilot <Arrow />
          </Link>
          <button
            ref={toggle}
            className="menu-toggle"
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen(!open)}
          >
            <span />
            <span />
          </button>
        </div>
        {open && (
          <nav
            id="mobile-navigation"
            className="mobile-nav"
            aria-label="Mobile navigation"
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                close();
                toggle.current?.focus();
              }
            }}
          >
            {[
              ...globalContent.header.links,
              { label: "FAQ", href: "/faq" },
              { label: "About", href: "/about" },
              globalContent.header.primaryCta,
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={path === link.href ? "page" : undefined}
                onClick={close}
              >
                {link.label}
                <Arrow />
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
