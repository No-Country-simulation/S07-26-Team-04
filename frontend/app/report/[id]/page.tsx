import { ReportShell } from "@/components/report/report-shell";
import { Hero } from "@/components/report/hero";
import { ReportContent } from "@/components/report/report-content";
import { ExecutiveSummary } from "@/components/report/executive-summary";
import { TaxonomySection } from "@/components/report/taxonomy-section";
import { Methodology } from "@/components/report/methodology";
import { Footer } from "@/components/report/footer";
import { Introduction } from "@/components/report/introduction";
import { FigurasSection } from "@/components/report/figuras-section";
import { Conclusion } from "@/components/report/conclusion";
import { Citation } from "@/components/report/citation";

export default async function ReportPageById({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <ReportShell>
      {/* =================================================
          HERO
      ================================================= */}
      <Hero reportId={id} />

      {/* =================================================
          CONTENT
      ================================================= */}
      <ReportContent>
        <ExecutiveSummary reportId={id} />
        <Introduction reportId={id} />
        <TaxonomySection reportId={id} />
        <Methodology reportId={id} />
        <FigurasSection reportId={id} />
        <Conclusion reportId={id} />
        <Citation reportId={id} />
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
