const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(e => console.error("Error connecting to MongoDB:", e.message));

const schema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true,
    unique: true,
  },
  number: {
    type: String,
    minlength: 8,
    required: true,
    validate: {
      validator: s => /^(\d{2}|\d{3})-\d+$/.test(s),
      message: props => `"${props.value}" is not a valid phone number`,
    },
  },
});

schema.set("toJSON", {
  transform: (_, p) => {
    p.id = p._id.toString();
    delete p._id;
    delete p.__v;
  },
});

module.exports = mongoose.model("Person", schema);
