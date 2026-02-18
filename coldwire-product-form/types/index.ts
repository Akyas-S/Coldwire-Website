// This is what the form data looks like when the user fills it in
export interface BatchFormData {
  // Product Details
  productCategory: string;
  productSubcategory: string;
  dateOfSlaughter: string;
  dateReceived: string;
  serialNumberRange: string;
  productIdRange: string;
  quantity: number;
  unit: string;

  // Abattoir Information
  abattoirName: string;
  abattoirAddress: string;
  halalCertificateBase64: string; // File converted to base64 string
  halalCertificateFileName: string;
}

// The subcategory options that change based on which category is selected
export const subcategories: Record<string, string[]> = {
  Chicken: ["Breast", "Thigh", "Drumstick", "Wings", "Whole Chicken"],
  Beef: ["Ribeye", "Sirloin", "Ground Beef", "Tenderloin", "Brisket"],
  Lamb: ["Leg", "Shoulder", "Chops", "Ground Lamb", "Rack"],
};
