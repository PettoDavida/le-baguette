import mongoose, {Types} from "mongoose";

export interface User {
  id: Types.ObjectId;
  email: String;
  hash: String;
  salt: String;
  isAdmin: Boolean;
}

const userSchema = new mongoose.Schema<User>(
  {
    email: {
      type: String,
      required: true,
    },

    hash: {
      type: String,
      required: true,
    },

    salt: {
      type: String,
      required: true,
    },

    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    toJSON: {virtuals: true},
    toObject: {virtuals: true},
  }
);

userSchema.set("toJSON", {
  transform: (doc, ret, opt) => {
    delete ret["salt"];
    delete ret["hash"];
    return ret;
  },
});

export const UserModel = mongoose.model("user", userSchema);
