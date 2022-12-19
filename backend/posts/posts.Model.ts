import mongoose, {ObjectId} from "mongoose";

export interface Post {
  _id: ObjectId;
  title: string;
  images: ObjectId[];
  content: string;
  userID: ObjectId;
  subID: ObjectId;
}

const ObjId = mongoose.Schema.Types.ObjectId;

export const postSchema = new mongoose.Schema<Post>({
  title: {type: String, required: true},
  images: {type: [ObjId], required: false},
  content: {type: String, required: false},
  userID: {type: ObjId, ref: "user", required: true},
  subID: {type: ObjId, ref: "sub", required: true},
});

export const PostModel = mongoose.model("post", postSchema);
