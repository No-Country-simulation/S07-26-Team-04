import Link from "next/link";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        {/* Branding */}

        <div className="footer-brand mx-auto max-w-[800px] px-4 lg:px-0">
          <Link href="/">PhysaFlow</Link>

          <span>
            © 2026 PhysaFlow. Investigación pública sobre capacidad varada.
          </span>
        </div>
      </div>
    </footer>
  );
}
