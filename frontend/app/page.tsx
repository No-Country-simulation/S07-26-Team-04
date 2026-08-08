import { ReportShell } from "@/components/report/report-shell";

import { Hero } from "@/components/report/hero";

import { ReportContent } from "@/components/report/report-content";

import { ExecutiveSummary } from "@/components/report/executive-summary";
import { TaxonomySection } from "@/components/report/taxonomy-section";
import { Methodology } from "@/components/report/methodology";

import { Footer } from "@/components/report/footer";

export default function HomePage() {
  return (
    <ReportShell>
      {/* =================================================
          HERO
      ================================================= */}

      <Hero />

      {/* =================================================
          CONTENT
      ================================================= */}

      <ReportContent>
        <ExecutiveSummary />

        <TaxonomySection />

        <Methodology />
      </ReportContent>

      {/* =================================================
          FOOTER
      ================================================= */}

      <section className="report-footer-section">
        <Footer />
      </section>
    </ReportShell>
  );
}
