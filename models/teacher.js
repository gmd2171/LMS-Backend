var mongoose = require("mongoose");
var teacherSchema = mongoose.Schema({
  userid: {
    type: mongoose.Types.ObjectId,
    ref: 'User'
  },
  phoneNumber: {
    type: String
  },
  designation: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Teacher", teacherSchema);
