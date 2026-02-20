export interface BatchFormData {
  productCategory: string;
  productSubcategory: string;
  dateOfSlaughter: string;
  dateReceived: string;
  serialNumberRange: string;
  productIdRange: string;
  quantity: number;
  unit: string;
  supplierEmail: string;
  supplierPhone: string;
  supplierName: string;
  supplierAddress: string;
  retailer: string;
  truck: string;
}

// Maps each top-level product category to its available subcategories.
// Used by ProductForm to dynamically populate the subcategory dropdown
// whenever the user selects a category, and reset it when the category changes.
export const subcategories: Record<string, string[]> = {
  Chicken: ["Breast", "Thigh", "Drumstick", "Wings", "Whole Chicken"],
  Beef: ["Ribeye", "Sirloin", "Ground Beef", "Tenderloin", "Brisket"],
  Lamb: ["Leg", "Shoulder", "Chops", "Ground Lamb", "Rack"],
};
