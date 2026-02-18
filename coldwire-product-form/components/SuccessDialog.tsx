"use client";

import { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { BatchFormData } from "@/types";

// Props this component needs from its parent
interface SuccessDialogProps {
  batchId: string;
  formData: BatchFormData;
  onClose: () => void; // called when user clicks "Create Another Batch"
}

export default function SuccessDialog({
  batchId,
  formData,
  onClose,
}: SuccessDialogProps) {
  // We use a ref to access the QR code SVG element for downloading
  const qrRef = useRef<HTMLDivElement>(null);

  // The data we encode into the QR code
  const qrData = JSON.stringify({
    batchId,
    product: `${formData.productCategory} ${formData.productSubcategory}`,
    quantity: `${formData.quantity} ${formData.unit}`,
    slaughterDate: formData.dateOfSlaughter,
    abattoir: formData.abattoirName,
  });

  // Download the QR code as a PNG image
  function handleDownloadQR() {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;

    // Create a canvas, draw the SVG on it, then download as PNG
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    img.onload = () => {
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, 256, 256);
      ctx.drawImage(img, 0, 0, 256, 256);

      // Trigger download
      const link = document.createElement("a");
      link.download = `coldwire-${batchId}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  }

  return (
    // Dark overlay that covers the whole screen
    <div className="dialog-overlay" onClick={onClose}>
      {/* The white dialog box (stop click from closing when clicking inside) */}
      <div className="dialog-box" onClick={(e) => e.stopPropagation()}>
        {/* Title */}
        <h2 className="dialog-title">✅ Batch Submitted Successfully</h2>
        <p className="dialog-description">
          Your product batch has been saved to the database.
        </p>

        {/* Batch ID */}
        <div className="dialog-row">
          <span className="dialog-row-label">Batch ID</span>
          <span className="badge badge-blue">{batchId}</span>
        </div>

        {/* Product */}
        <div className="dialog-row">
          <span className="dialog-row-label">Product</span>
          <span>
            {formData.productCategory} - {formData.productSubcategory}
          </span>
        </div>

        {/* Quantity */}
        <div className="dialog-row">
          <span className="dialog-row-label">Quantity</span>
          <span>
            {formData.quantity} {formData.unit}
          </span>
        </div>

        {/* QR Code */}
        <div className="qr-section">
          <p>Scan this QR code for batch info</p>
          <div ref={qrRef}>
            <QRCodeSVG value={qrData} size={200} level="M" />
          </div>
          <button className="btn btn-outline" onClick={handleDownloadQR}>
            ⬇ Download QR Code
          </button>
        </div>

        {/* Close / Create Another Button */}
        <button className="btn btn-primary" onClick={onClose}>
          ➕ Create Another Batch
        </button>
      </div>
    </div>
  );
}
