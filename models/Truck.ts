import mongoose, { Schema } from "mongoose";

const TruckSchema = new Schema(
  {
    TruckID: { type: String, required: true, unique: true, index: true },
    IsActive: { type: Boolean, required: true },
    TrManuID: { type: Schema.Types.ObjectId },
  },
  {
    timestamps: true,
  },
);

// idk default mongoose stuff
export default (mongoose.models.Truck as mongoose.Model<
  mongoose.InferSchemaType<typeof TruckSchema>
>) || mongoose.model("Truck", TruckSchema, "trucks");
