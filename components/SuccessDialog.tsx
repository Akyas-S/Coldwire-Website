"use client";

import { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { BatchFormData } from "@/types";

interface SuccessDialogProps {
  batchId: string;
  formData: BatchFormData;
  onClose: () => void;
}


export default function SuccessDialog({
  batchId,
  formData,
  onClose,
}: SuccessDialogProps) {
  
  const qrRef = useRef<HTMLDivElement>(null);

  
  const qrData = JSON.stringify({
    batchId,
    product: `${formData.productCategory} ${formData.productSubcategory}`,
    quantity: `${formData.quantity} ${formData.unit}`,
    slaughterDate: formData.dateOfSlaughter,
    abattoir: formData.supplierName,
  });

  
  function handleDownloadQR() {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;

    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const svgAsString = new XMLSerializer().serializeToString(svg);
    
    const svgAsBase64 = btoa(svgAsString);
    const svgDataUrl = "data:image/svg+xml;base64," + svgAsBase64;

    const img = new Image();

    img.onload = function () {
      
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, 256, 256);
      ctx.drawImage(img, 0, 0, 256, 256);

      
      const downloadLink = document.createElement("a");
      downloadLink.download = "coldwire-" + batchId + ".png";
      downloadLink.href = canvas.toDataURL("image/png");
      downloadLink.click();
    };

    img.src = svgDataUrl;
  }

  return (
    
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog-box" onClick={(e) => e.stopPropagation()}>
        <h2 className="dialog-title">✅ Batch Submitted Successfully</h2>
        <p className="dialog-description">
          Your product batch has been saved to the database.
        </p>

        <div className="dialog-row">
          <span className="dialog-row-label">Batch ID</span>
          <span className="badge badge-blue">{batchId}</span>
        </div>

        <div className="dialog-row">
          <span className="dialog-row-label">Product</span>
          <span>
            {formData.productCategory} - {formData.productSubcategory}
          </span>
        </div>

        <div className="dialog-row">
          <span className="dialog-row-label">Quantity</span>
          <span>
            {formData.quantity} {formData.unit}
          </span>
        </div>

        <div className="qr-section">
          <p>Scan this QR code for batch info</p>
          
          <div ref={qrRef}>
            <QRCodeSVG value={qrData} size={200} level="M" />
          </div>
          <button className="btn btn-outline" onClick={handleDownloadQR}>
            ⬇ Download QR Code
          </button>
        </div>

        <button className="btn btn-primary" onClick={onClose}>
          ➕ Create Another Batch
        </button>
      </div>
    </div>
  );
} 
