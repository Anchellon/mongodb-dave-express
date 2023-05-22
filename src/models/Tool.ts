import mongoose from "mongoose";
const ToolSchema = new mongoose.Schema({
  name: String,
  url: String,
  salt: String,
  category: String,
  desc: String,
  active: Boolean,
});
const Tool = mongoose.model("tool", ToolSchema);

export default Tool;
