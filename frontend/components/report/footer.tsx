import Link from "next/link";

const footerLinks = [
  { label: "Resumen", href: "#resumen" },
  { label: "Introducción", href: "#introduction" },
  { label: "Taxonomía", href: "#taxonomy" },
  { label: "Metodología", href: "#methodology" },
  { label: "Figuras", href: "#figures" },
  { label: "Conclusión", href: "#conclusion" },
  { label: "Citar", href: "#quote" },
];

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        {/* Branding */}
        <div className="footer-brand">
          <Link href="/">PhysaFlow</Link>

          <span>
            Investigación pública sobre capacidad varada en centros de datos.
          </span>

          <span className="footer-copyright">
            © {new Date().getFullYear()} PhysaFlow. Todos los derechos reservados.
          </span>
        </div>

        {/* Navigation */}
        <nav className="footer-nav">
          {footerLinks.map((link) => (
            <Link key={link.label} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <span className="footer-bottom-text">
          Licencia CC BY-SA 4.0 — PhysaFlow
        </span>
      </div>
    </footer>
  );
}
