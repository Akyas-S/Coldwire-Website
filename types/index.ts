export interface BatchFormData {
  productCategory: string;
  productSubcategory: string;
  dateOfSlaughter: string;
  dateReceived: string;
  serialNumber: number;
  productId: number;
  quantity: number;
  unit: string;
  supplierEmail: string;
  supplierPhone: string;
  supplierName: string;
  supplierAddress: string;
  retailer: string;
  truck: string;
}


// whenever the user selects a category, and reset it when the category changes.
export const subcategories: Record<string, string[]> = {
  Chicken: ["Breast", "Thigh", "Drumstick", "Wings", "Whole Chicken"],
  Beef: ["Ribeye", "Sirloin", "Ground Beef", "Tenderloin", "Brisket"],
  Lamb: ["Leg", "Shoulder", "Chops", "Ground Lamb", "Rack"],
};
