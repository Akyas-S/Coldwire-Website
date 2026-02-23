import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Supplier from "@/models/Suppliers";

export async function GET() {
  try {
    await dbConnect();

    const suppliers = await Supplier.find(
      { isActive: true },
      {
        SuppID: 1,
        SuppName: 1,
        SuppAddress: 1,
        SuppTelephone: 1,
        SuppEmail: 1,
      },
    );

    return NextResponse.json({ success: true, suppliers });
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    return NextResponse.json(
      { success: false, message: "Server error. Please try again." },
      { status: 500 },
    );
  }
}
