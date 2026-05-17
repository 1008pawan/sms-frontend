"use client";
import React from "react";

const PdfPreviewModal = ({ open, onClose, pdfUrl }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
      <div className="bg-white w-[70%] h-[90%] rounded-xl overflow-hidden">
        <div className="flex justify-between items-center px-4 py-3 border-b">
          <h3 className="font-semibold">Resume Preview</h3>
          <button onClick={onClose} className="cursor-pointer hover:text-blue-500">✕</button>
        </div>

        <iframe src={pdfUrl} className="w-full h-full" />
      </div>
    </div>
  );
};

export default PdfPreviewModal;
