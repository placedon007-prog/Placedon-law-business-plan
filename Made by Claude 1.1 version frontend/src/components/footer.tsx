import Link from "next/link";
import { Brand } from "./brand";
import { ConsentPreferences } from "./consent";
import { globalContent } from "@/lib/placedon-content/content/shared";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-top">
        <div>
          <Brand footer />
          <p className="footer-position">{globalContent.footer.positioning}</p>
        </div>
        <nav aria-label="Footer navigation" className="footer-links">
          <div>
            <span className="footer-label">The record</span>
            {globalContent.footer.productLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
          <div>
            <span className="footer-label">Placedon</span>
            {globalContent.footer.companyLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
          <div>
            <span className="footer-label">Policies</span>
            {globalContent.footer.legalLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
            <ConsentPreferences />
          </div>
        </nav>
      </div>
      <div className="container footer-bottom">
        <span>
          © <span className="mono">{new Date().getFullYear()}</span> Placedon
        </span>
        <span>A witness, not a tool.</span>
        <span>Not legal advice.</span>
      </div>
    </footer>
  );
}
