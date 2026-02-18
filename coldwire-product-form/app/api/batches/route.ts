import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Batch from "@/models/Batch";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// Generate a unique batch ID like "CW-20260215-00001"
async function generateBatchId(): Promise<string> {
  // Get today's date formatted as YYYYMMDD
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const dateStr = `${year}${month}${day}`;

  // Find how many batches were already created today so we can increment
  const todayStart = new Date(year, today.getMonth(), today.getDate());
  const todayEnd = new Date(year, today.getMonth(), today.getDate() + 1);

  const count = await Batch.countDocuments({
    createdAt: { $gte: todayStart, $lt: todayEnd },
  });

  // Pad the count to 5 digits (e.g. 00001, 00002, etc.)
  const sequence = String(count + 1).padStart(5, "0");

  return `CW-${dateStr}-${sequence}`;
}

// Handle POST requests to /api/batches
export async function POST(request: Request) {
  try {
    // Step 1: Connect to MongoDB
    await dbConnect();

    // Step 2: Get the form data from the request body
    const body = await request.json();

    // Step 3: Basic validation - check required fields
    const requiredFields = [
      "productCategory",
      "productSubcategory",
      "dateOfSlaughter",
      "dateReceived",
      "serialNumberRange",
      "productIdRange",
      "quantity",
      "unit",
      "abattoirName",
      "abattoirAddress",
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, message: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Step 4: Generate a unique batch ID
    const batchId = await generateBatchId();

    // Step 5: Handle file upload if a certificate was provided
    let halalCertificatePath = "";
    if (body.halalCertificateBase64 && body.halalCertificateFileName) {
      // The file comes as a base64 string like "data:application/pdf;base64,JVBERi..."
      // We need to extract just the base64 data part
      const base64Data = body.halalCertificateBase64.split(",")[1];
      const buffer = Buffer.from(base64Data, "base64");

      // Save the file to the uploads directory
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      await mkdir(uploadsDir, { recursive: true });

      const fileName = `${batchId}-${body.halalCertificateFileName}`;
      const filePath = path.join(uploadsDir, fileName);
      await writeFile(filePath, buffer);

      halalCertificatePath = `/uploads/${fileName}`;
    }

    // Step 6: Build the QR code data (same format the frontend uses)
    const qrCodeData = JSON.stringify({
      batchId,
      product: `${body.productCategory} ${body.productSubcategory}`,
      quantity: `${body.quantity} ${body.unit}`,
      slaughterDate: body.dateOfSlaughter,
      abattoir: body.abattoirName,
    });

    // Step 7: Save to MongoDB
    const batch = await Batch.create({
      batchId,
      productCategory: body.productCategory,
      productSubcategory: body.productSubcategory,
      dateOfSlaughter: new Date(body.dateOfSlaughter),
      dateReceived: new Date(body.dateReceived),
      serialNumberRange: body.serialNumberRange,
      productIdRange: body.productIdRange,
      quantity: body.quantity,
      unit: body.unit,
      abattoirName: body.abattoirName,
      abattoirAddress: body.abattoirAddress,
      halalCertificatePath,
      qrCodeData,
    });

    // Step 8: Send back success response
    return NextResponse.json({
      success: true,
      batchId: batch.batchId,
      message: "Batch created successfully",
    });
  } catch (error) {
    console.error("Error creating batch:", error);
    return NextResponse.json(
      { success: false, message: "Server error. Please try again." },
      { status: 500 }
    );
  }
}
