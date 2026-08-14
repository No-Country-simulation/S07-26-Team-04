"use client";

import { use } from "react";
import { MdxEditor } from "@/components/dashboard/mdx-editor";

export default function EditarReportePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <MdxEditor initialReportId={resolvedParams.id} />
    </div>
  );
}
