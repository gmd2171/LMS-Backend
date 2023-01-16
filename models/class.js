var mongoose = require('mongoose')


var Class = mongoose.Schema({
    className: {
        type: String,
        required: true
    },
    studentsList:{
        type:[
            {
            studentID:{
                    type:mongoose.Types.ObjectId,
                    ref:'Student'
                }
            }
        ]
    },
})


module.exports = mongoose.model('Class', Class)