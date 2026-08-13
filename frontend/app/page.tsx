import { ReportShell } from "@/components/report/report-shell";

import { Hero } from "@/components/report/hero";

import { ReportContent } from "@/components/report/report-content";

import { ExecutiveSummary } from "@/components/report/executive-summary";
import { TaxonomySection } from "@/components/report/taxonomy-section";
import { Methodology } from "@/components/report/methodology";

import { Footer } from "@/components/report/footer";
import { Introduction } from "@/components/report/introduction";
import { FigurasSection } from "@/components/report/figuras-section";

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

        <Introduction />

        <TaxonomySection />

        <Methodology />

        <FigurasSection />
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
