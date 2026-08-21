'use client';

import { useRef, useState } from 'react';
import { Run } from '@/lib/types';
import PdfReport from './PdfReport';

interface Props {
  run: Run;
}

export default function PdfButton({ run }: Props) {
  const [isGenerating, setIsGenerating] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);

  const generatePdf = async () => {
    if (!pdfRef.current) return;
    setIsGenerating(true);

    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      const element = pdfRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = pdfHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pdf.internal.pageSize.getHeight();

      while (heightLeft > 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();
      }

      pdf.save(`evaluation-${run.id}.pdf`);
    } catch (err) {
      console.error('PDF generation failed:', err);
      alert('Failed to generate PDF');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <button
        onClick={generatePdf}
        disabled={isGenerating}
        className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 disabled:bg-gray-400 text-sm font-medium flex items-center gap-2"
      >
        {isGenerating ? 'Generating...' : 'Download PDF'}
      </button>
      <div className="fixed left-[-9999px] top-0">
        <div ref={pdfRef}>
          <PdfReport run={run} />
        </div>
      </div>
    </>
  );
}
