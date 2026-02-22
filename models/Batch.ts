import mongoose, { Schema } from "mongoose";

const BatchSchema = new Schema(
  {
    batchId: { type: String, required: true, unique: true, index: true },
    productCategory: { type: String, required: true },
    productSubcategory: { type: String, required: true },
    dateOfSlaughter: { type: Date, required: true },
    dateReceived: { type: Date, required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  {
    timestamps: true,
  },
);

export default (mongoose.models.Batch as mongoose.Model<
  mongoose.InferSchemaType<typeof BatchSchema>
>) || mongoose.model("Batch", BatchSchema);
