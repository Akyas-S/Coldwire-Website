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
    // Step 1: Find the SVG element inside the div we attached the ref to
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;

    // Step 2: Create a 256x256 canvas to draw the QR code onto
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;

    // Step 3: Get the drawing context (this is how we draw onto the canvas)
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Step 4: Turn the SVG element into a plain XML string
    const svgAsString = new XMLSerializer().serializeToString(svg);

    // Step 5: Convert that string to base64 so we can use it as an image URL.
    // Browsers can load a base64-encoded SVG as an image using a "data URL".
    const svgAsBase64 = btoa(svgAsString);
    const svgDataUrl = "data:image/svg+xml;base64," + svgAsBase64;

    // Step 6: Create an Image, load the SVG into it, then draw it to the canvas
    const img = new Image();

    img.onload = function () {
      // Fill a white background first (PNG is transparent by default)
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, 256, 256);

      // Draw the QR code image onto the canvas
      ctx.drawImage(img, 0, 0, 256, 256);

      // Step 7: Export the canvas as a PNG and trigger a file download
      const downloadLink = document.createElement("a");
      downloadLink.download = "coldwire-" + batchId + ".png";
      downloadLink.href = canvas.toDataURL("image/png");
      downloadLink.click();
    };

    img.src = svgDataUrl;
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
