import { StringExpressionOperatorReturningBoolean } from "mongoose";

export interface BatchFormData {
  productCategory: string;
  productSubcategory: string;
  dateOfSlaughter: string;
  dateReceived: string;
  quantity: number;
}

export interface Supplier {
  SuppID: string;
  SuppName: string;
  SuppAddress: string;
  SuppTelephone: number;
  SuppEmail: string;
}

export interface Retailer {
  _id: string;
  RetID: string;
  RetName: string;
}

export interface Truck {
  _id: string;
  TruckID: string;
}

// whenever the user selects a category, and reset it when the category changes.
export const subcategories: Record<string, string[]> = {
  Chicken: ["Breast", "Thigh", "Drumstick", "Wings", "Whole Chicken"],
  Beef: ["Ribeye", "Sirloin", "Ground Beef", "Tenderloin", "Brisket"],
  Lamb: ["Leg", "Shoulder", "Chops", "Ground Lamb", "Rack"],
};
