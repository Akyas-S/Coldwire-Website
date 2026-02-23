import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Retailer from "@/models/Retailer";

export async function GET() {
  try {
    await dbConnect();

    // only fetch active retailers, and only the fields we need for the dropdown
    const retailers = await Retailer.find(
      { isActive: true },
      { RetID: 1, RetName: 1 },
    );

    console.log("Retailers fetched:", retailers);

    return NextResponse.json({ success: true, retailers });
  } catch (error) {
    console.error("Error fetching retailers:", error);
    return NextResponse.json(
      { success: false, message: "Server error. Please try again." },
      { status: 500 },
    );
  }
}
