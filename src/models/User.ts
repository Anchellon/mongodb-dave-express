import mongoose from "mongoose";
const UserSchema = new mongoose.Schema({
  username: String,
  hash: String,
  salt: String,
  firstName: String,
  lastName: String,
  profilePic: String,
  id: String,
  provider: String,
  isAdmin: Boolean,
  role: String,
});
const User = mongoose.model("user", UserSchema);

export default User;
