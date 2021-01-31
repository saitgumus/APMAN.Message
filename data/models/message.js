let mongoose = require("mongoose");
const { Schema } = mongoose;

const messageSchema = new Schema({
  property: { type: String, required: true, unique: true }, // String is shorthand for {type: String}
  author: String,
  description: String,
});

var Message = mongoose.model("message", messageSchema);

module.exports = Message;
