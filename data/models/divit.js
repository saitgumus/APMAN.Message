let mongoose = require("mongoose");
const { Schema } = mongoose;

const messageSchema = new Schema({
  divitInstanceId: { type: String, required: true, unique: true }, // String is shorthand for {type: String}
  title: String,
  description: String,
  content: String,
});

var Divit = mongoose.model("divit", messageSchema);

module.exports = Divit;
