import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Truck from "@/models/Truck";

export async function GET() {
  try {
    await dbConnect();

    // IsActive has a capital I in the trucks collection
    const trucks = await Truck.find(
      { IsActive: true },
      { TruckID: 1 },
    );

    console.log("Trucks fetched:", trucks);

    return NextResponse.json({ success: true, trucks });
  } catch (error) {
    console.error("Error fetching trucks:", error);
    return NextResponse.json(
      { success: false, message: "Server error. Please try again." },
      { status: 500 },
    );
  }
}
