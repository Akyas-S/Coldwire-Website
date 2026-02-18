import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Batch from "@/models/Batch";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// Generate a unique batch ID like "CW-20260215-74821"
// We use today's date plus a random 5-digit number to make it unique.
function generateBatchId(): string {
  // Build the date portion: YYYYMMDD
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const dateStr = year + month + day;

  // Random 5-digit number (10000 to 99999) so IDs don't collide
  const randomPart = Math.floor(Math.random() * 90000) + 10000;

  return "CW-" + dateStr + "-" + randomPart;
}

// Handle POST requests to /api/batches
export async function POST(request: Request) {
  try {
    // Step 1: Connect to MongoDB
    await dbConnect();

    // Step 2: Get the form data from the request body
    const body = await request.json();

    // Step 3: Basic validation - check each required field one by one
    if (!body.productCategory) {
      return NextResponse.json(
        { success: false, message: "Missing required field: productCategory" },
        { status: 400 }
      );
    }
    if (!body.productSubcategory) {
      return NextResponse.json(
        { success: false, message: "Missing required field: productSubcategory" },
        { status: 400 }
      );
    }
    if (!body.dateOfSlaughter) {
      return NextResponse.json(
        { success: false, message: "Missing required field: dateOfSlaughter" },
        { status: 400 }
      );
    }
    if (!body.dateReceived) {
      return NextResponse.json(
        { success: false, message: "Missing required field: dateReceived" },
        { status: 400 }
      );
    }
    if (!body.serialNumberRange) {
      return NextResponse.json(
        { success: false, message: "Missing required field: serialNumberRange" },
        { status: 400 }
      );
    }
    if (!body.productIdRange) {
      return NextResponse.json(
        { success: false, message: "Missing required field: productIdRange" },
        { status: 400 }
      );
    }
    if (!body.quantity) {
      return NextResponse.json(
        { success: false, message: "Missing required field: quantity" },
        { status: 400 }
      );
    }
    if (!body.unit) {
      return NextResponse.json(
        { success: false, message: "Missing required field: unit" },
        { status: 400 }
      );
    }
    if (!body.abattoirName) {
      return NextResponse.json(
        { success: false, message: "Missing required field: abattoirName" },
        { status: 400 }
      );
    }
    if (!body.abattoirAddress) {
      return NextResponse.json(
        { success: false, message: "Missing required field: abattoirAddress" },
        { status: 400 }
      );
    }

    // Step 4: Generate a unique batch ID
    const batchId = generateBatchId();

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

    // Handle file upload for Product Image
    let productImagePath = "";
    if (body.productImageBase64 && body.productImageFileName) {
      const base64Data = body.productImageBase64.split(",")[1];
      const buffer = Buffer.from(base64Data, "base64");

      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      await mkdir(uploadsDir, { recursive: true });

      const fileName = `${batchId}-img-${body.productImageFileName}`;
      const filePath = path.join(uploadsDir, fileName);
      await writeFile(filePath, buffer);

      productImagePath = `/uploads/${fileName}`;
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
      productImagePath,
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
