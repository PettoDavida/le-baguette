import mongoose, {ObjectId} from "mongoose";

export interface Sub {
  _id: string;
  name: string;
  title: string;
  owner: ObjectId;
  mods: [ObjectId];
}

const ObjId = mongoose.Schema.Types.ObjectId;

export const subSchema = new mongoose.Schema<Sub>({
  // TODO: Add match to check if the id is valid (only lowercase and underscores are accepted)
  name: {
    type: String,
    required: [true, "'name' is required"],
    unique: true,
    lowercase: true,
    immutable: true,
  },
  title: {type: String, required: [true, "'title' is required"]},
  owner: {type: ObjId, ref: "user", required: true},
  mods: {type: [ObjId], ref: "user", required: true, default: []},
});

export const SubModel = mongoose.model("sub", subSchema);
