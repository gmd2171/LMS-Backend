var mongoose = require('mongoose');
var quizSchema = mongoose.Schema(
    {
        quizNumber:{
            type:Number,
            required:true
        },
        title:{
            type:String,
            required:true
        },
        uploadDate:{
            type:Date,
            default:Date.now
        },
        deadlineDate:{
            type:Date,
            required:true
        },
        totalMarks:{
            type:Number,
            required:true
        },
        questions:{
            type:[String],
            required:true
        },
        attempted:{
            type:[{
                sid:{
                    type:mongoose.Types.ObjectId,
                    ref:'Student'
                }, 
                answers:{
                    type:[String],
                    required:true
                },
                obtainedMarks:{
                    type:Number,
                    required: true
                }
            }]
        }
    }
);

module.exports=mongoose.model('Quiz',quizSchema);