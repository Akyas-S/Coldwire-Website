import mongoose, { Schema } from "mongoose";

const BatchSchema = new Schema(
  {
    batchId: { type: String, required: true, unique: true, index: true },
    productCategory: { type: String, required: true },
    productSubcategory: { type: String, required: true },
    dateOfSlaughter: { type: Date, required: true },
    dateReceived: { type: Date, required: true },
    serialNumber: { type: Number, required: true },
    productId: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unit: { type: String, required: true },
    supplierName: { type: String, required: true },
    supplierAddress: { type: String, required: true },
    supplierEmail: { type: String, default: "" },
    supplierPhone: { type: String, default: "" },
    retailer: { type: String, default: "" },
    truck: { type: String, default: "" },
    rfidTagId: { type: String, default: "" },
    qrCodeData: { type: String, required: true },
  },
  {

    timestamps: true,
  }
);


export default (mongoose.models.Batch as mongoose.Model<mongoose.InferSchemaType<typeof BatchSchema>>) ||
  mongoose.model("Batch", BatchSchema);
