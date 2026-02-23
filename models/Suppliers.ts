import mongoose, { Schema } from "mongoose";

const SupplierSchema = new Schema(
  {
    SuppID: { type: String, required: true, unique: true, index: true },
    SuppName: { type: String, required: true },
    SuppAddress: { type: String, required: true },
    SuppTelephone: { type: Number, required: true },
    SuppEmail: { type: String, required: true },
    isActive: { type: Boolean, required: true },
    SuppManuID: { type: Schema.Types.ObjectId },
  },
  {
    timestamps: true,
  },
);

// idk default mongoose stuff
export default (mongoose.models.Supplier as mongoose.Model<
  mongoose.InferSchemaType<typeof SupplierSchema>
>) || mongoose.model("Supplier", SupplierSchema, "suppliers");
