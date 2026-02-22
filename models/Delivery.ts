import mongoose, { Schema } from "mongoose";

const DeliverySchema = new Schema(
  {
    deliveryId: { type: String, required: true, unique: true, index: true },
    batchId: { type: String, required: true, index: true },
    status: { type: String, required: true, default: "pickup" },
  },
  {
    timestamps: true,
  },
);

// idk default mongoose stuff
export default (mongoose.models.Delivery as mongoose.Model<
  mongoose.InferSchemaType<typeof DeliverySchema>
>) || mongoose.model("Delivery", DeliverySchema);
