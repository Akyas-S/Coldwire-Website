import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Batch from "@/models/Batch";
import Delivery from "@/models/Delivery";

// Generates a unique batch ID in the format: CW-YYYYMMDD-XXXXX
// random 5 digits at the back

function generateBatchId(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const dateStr = year + month + day;
  const randomPart = Math.floor(Math.random() * 90000) + 10000;
  return "CW-" + dateStr + "-" + randomPart;
}

function generateDeliveryId(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const dateStr = year + month + day;
  const randomPart = Math.floor(Math.random() * 90000) + 10000;
  return "DL-" + dateStr + "-" + randomPart;
}

export async function POST(request: Request) {
  try {
    await dbConnect();

    const body = await request.json();

    const requiredFields = [
      "productCategory",
      "productSubcategory",
      "dateOfSlaughter",
      "dateReceived",
      "quantity",
    ];

    if (requiredFields.some((field) => !body[field])) {
      return NextResponse.json(
        { success: false, message: "Please fill in all required fields." },
        { status: 400 },
      );
    }

    const batchId = generateBatchId();
    // Date strings from JSON are converted to Date objects here so MongoDB stores them as proper dates.
    const batch = await Batch.create({
      batchId,
      productCategory: body.productCategory,
      productSubcategory: body.productSubcategory,
      dateOfSlaughter: new Date(body.dateOfSlaughter),
      dateReceived: new Date(body.dateReceived),
      quantity: body.quantity,
    });

    const deliveryId = generateDeliveryId();

    await Delivery.create({
      deliveryId,
      batchId,
      status: "pickup",
    });

    return NextResponse.json({
      success: true,
      batchId: batch.batchId,
      deliveryId: deliveryId,
      message: "Batch created successfully",
    });
  } catch (error) {
    console.error("Error creating batch:", error);
    return NextResponse.json(
      { success: false, message: "Server error. Please try again." },
      { status: 500 },
    );
  }
}
