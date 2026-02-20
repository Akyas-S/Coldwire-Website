import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Batch from "@/models/Batch";
// Generates a unique batch ID in the format: CW-YYYYMMDD-XXXXX
// The date prefix groups batches by day; the 5-digit random suffix (10000–99999)
// reduces collision probability without needing a database sequence counter.
function generateBatchId(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // getMonth() is 0-indexed
  const day = String(today.getDate()).padStart(2, "0");
  const dateStr = year + month + day;
  const randomPart = Math.floor(Math.random() * 90000) + 10000; // always 5 digits
  return "CW-" + dateStr + "-" + randomPart;
}

export async function POST(request: Request) {
  try {
    await dbConnect();

    const body = await request.json();

    // Validate all required fields individually so the client receives a specific
    // error message pointing to exactly which field is missing, rather than a
    // generic "bad request".
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
    if (!body.serialNumber) {
      return NextResponse.json(
        { success: false, message: "Missing required field: serialNumber" },
        { status: 400 }
      );
    }
    if (!body.productId) {
      return NextResponse.json(
        { success: false, message: "Missing required field: productId" },
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
    if (!body.supplierName) {
      return NextResponse.json(
        { success: false, message: "Missing required field: supplierName" },
        { status: 400 }
      );
    }
    if (!body.supplierAddress) {
      return NextResponse.json(
        { success: false, message: "Missing required field: supplierAddress" },
        { status: 400 }
      );
    }

    const batchId = generateBatchId();

    // Build the JSON string that will be encoded into the QR code.
    // Only essential traceability fields are included to keep the QR payload small
    // (larger payloads produce denser, harder-to-scan QR codes).
    const qrCodeData = JSON.stringify({
      batchId,
      product: `${body.productCategory} ${body.productSubcategory}`,
      quantity: `${body.quantity} ${body.unit}`,
      slaughterDate: body.dateOfSlaughter,
      supplier: body.supplierName,
    });

    // Persist the batch document. Date strings from JSON are converted to Date objects
    // here so MongoDB stores them as proper BSON dates rather than plain strings.
    const batch = await Batch.create({
      batchId,
      productCategory: body.productCategory,
      productSubcategory: body.productSubcategory,
      dateOfSlaughter: new Date(body.dateOfSlaughter),
      dateReceived: new Date(body.dateReceived),
      serialNumber: body.serialNumber,
      productId: body.productId,
      quantity: body.quantity,
      unit: body.unit,
      supplierName: body.supplierName,
      supplierAddress: body.supplierAddress,
      supplierEmail: body.supplierEmail || "",
      supplierPhone: body.supplierPhone || "",
      retailer: body.retailer || "",
      truck: body.truck || "",
      qrCodeData,
    });

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
