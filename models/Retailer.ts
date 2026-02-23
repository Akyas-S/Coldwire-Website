import mongoose, { Schema } from "mongoose";

const RetailerSchema = new Schema(
  {
    RetID: { type: String, required: true, unique: true, index: true },
    RetName: { type: String, required: true },
    RetAddress: { type: String, required: true },
    RetTelephone: { type: Number, required: true },
    RetEmail: { type: String, required: true },
    isActive: { type: Boolean, required: true },
    RetManuID: { type: Schema.Types.ObjectId },
  },
  {
    timestamps: true,
  },
);

// idk default mongoose stuff
export default (mongoose.models.Retailer as mongoose.Model<
  mongoose.InferSchemaType<typeof RetailerSchema>
>) || mongoose.model("Retailer", RetailerSchema, "retailers");
