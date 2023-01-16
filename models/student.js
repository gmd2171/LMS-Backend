var mongoose = require('mongoose')

var Student = mongoose.Schema({
    userid: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
      },
    student_regNo: {
        type: String,
        required: true
    },
    student_contact: {
        type: String,
    },
    student_email: {
        type: String,
    }, 
    studentBirthdate: {
        type: Date,
    },
    Gpa: {
        type: Number,
    },
    student_gender: {
        type: String,
    },
    student_address: {
        type: String,
    },
})


module.exports = mongoose.model('Student', Student)