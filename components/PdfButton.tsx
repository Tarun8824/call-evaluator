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
      await document.fonts?.ready;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: element.scrollWidth,
        windowWidth: element.scrollWidth,
      });

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfPageHeight = pdf.internal.pageSize.getHeight();
      const pageHeightPx = Math.floor(canvas.width * pdfPageHeight / pdfWidth);

      for (let offset = 0; offset < canvas.height; offset += pageHeightPx) {
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvas.width;
        pageCanvas.height = Math.min(pageHeightPx, canvas.height - offset);
        const context = pageCanvas.getContext('2d');
        if (!context) throw new Error('Unable to create PDF page canvas');
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
        context.drawImage(canvas, 0, offset, canvas.width, pageCanvas.height, 0, 0, canvas.width, pageCanvas.height);
        if (offset > 0) pdf.addPage();
        const pageHeightMm = pageCanvas.height * pdfWidth / pageCanvas.width;
        pdf.addImage(pageCanvas.toDataURL('image/jpeg', 0.92), 'JPEG', 0, 0, pdfWidth, pageHeightMm);
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
      <div className="pointer-events-none absolute left-0 top-0 z-[-1] opacity-[0.01]" aria-hidden="true">
        <div ref={pdfRef} style={{ width: '794px' }}>
          <PdfReport run={run} />
        </div>
      </div>
    </>
  );
}
