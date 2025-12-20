import { model } from "mongoose";
import { Schema } from "mongoose";
import { compare, hash } from "bcrypt";
import { SALT_ROUNDS } from "../constant";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await hash(this.password, SALT_ROUNDS);
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  return compare(candidatePassword, this.password);
};

export const User = model('user', userSchema);