import mongoose, { Schema } from "mongoose";

// This schema defines what a batch document looks like in MongoDB
const BatchSchema = new Schema(
  {
    // Unique ID like "CW-20260215-00001"
    batchId: { type: String, required: true, unique: true, index: true },

    // Product Details
    productCategory: { type: String, required: true },
    productSubcategory: { type: String, required: true },
    dateOfSlaughter: { type: Date, required: true },
    dateReceived: { type: Date, required: true },
    serialNumberRange: { type: String, required: true },
    productIdRange: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unit: { type: String, required: true },

    // Abattoir Information
    abattoirName: { type: String, required: true },
    abattoirAddress: { type: String, required: true },
    halalCertificatePath: { type: String, default: "" },
    productImagePath: { type: String, default: "" },

    // RFID (optional - not implemented yet)
    rfidTagId: { type: String, default: "" },

    // QR Code data (JSON string)
    qrCodeData: { type: String, required: true },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// When Next.js hot-reloads in development, this file runs again.
// If the model was already registered, reuse it instead of registering it twice.
export default (mongoose.models.Batch as mongoose.Model<mongoose.InferSchemaType<typeof BatchSchema>>) ||
  mongoose.model("Batch", BatchSchema);
