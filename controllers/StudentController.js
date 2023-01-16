var express = require('express');
var Class = require('../models/class');
var Course = require('../models/course')
var Teacher = require('../models/teacher');
var Student = require('../models/student');
var assignment = require('../models/assignment');
var quiz = require('../models/quiz');
const { Router } = require('express');

/*
SP20-BCS-029                Show Dashboard
*/
exports.index = function (req, res, next) {
    //data of student will come from login credentials
    res.render('student', { title: 'Student DashBoard' , name : 'Hamza' , 
    regNo : 'SP20-BCS-029' });
}


//                          Assignment Function
/* 
SP20-BCS-110 VIEW ASSIGNMENT
*/
exports.viewAssignment = function (req, res, next) {
    //First we get student id from login creditentials then 
    //I will match the course with the student after login is integrate properly
    availableAssign = []
    assignment.find({}).exec((err,assign)=>{
        if (err) throw err;
        for (let index = 0; index < assign.length; index++) {
            date = assign[index].deadline
            //get Today's Date
            dateToday = new Date();
            if(date >= dateToday){
                availableAssign = availableAssign.concat(assign[index])
            }
        }
        res.json(availableAssign);
    });
} 

/*
SP20-BCS-029
For Submit Assignment
*/
exports.submitAssignment =  (req, res, next) => {
    getId = req.params.assignmentID;
    assignment.findById(getId, function(err, Foundedassignment) {
        if (err) throw err;
        //get todays date
        d1 = new Date();
        //Check if deadline is available
        lastDate = Foundedassignment.deadline
        console.log(lastDate)

        if(lastDate >= d1){
            assignment.findByIdAndUpdate(
                {_id:req.params.assignmentID}, 
                {"$push":{
                        "attempted":{
                            "sid": req.body.sid, //come from login
                            "file" : req.body.file, //buffer
                            "fileName" : req.body.fileName,
                            "fileExtension" : req.body.fileExtension,
                            "uploadedDate" : d1,
                            "obtainedMarks" : "N/A"
                            }
                        }
                }, 
            {new:true, upsert: false}, 
            (err,data) => {
                if(err) throw err;
                res.json(data);
            })
        }
        else{
            res.json("Assignment Due has passed")
        }
});
} 


//                              Matrial Functions
//ViewMaterial Function
//By Laraib Saghir
exports.ViewMaterial = (req, res, next) => {
	Course.find({_id: req.params.cid},"materialList").exec(function (error, results) {
		if (error) {
			return next(error);
		}
		res.json(results);
	});
}

//download material
// By Malaika Mubashir
exports.DownloadMaterial=function(req, res){
    Course.find({_id: req.params.id }, "materialList", (err) => {
      if (err) return handleError(err);  
        const file = `${__dirname}/path/to/file.zip`;
        res.download(file);
      
    });
    }

//                              Quizess
// Get quiz lists Route
// By Aliza Tanweer
exports.getquiz = function (req, res, next) {
    Course.find({'courseID': req.params.courseID},'quizList.quizID', function(err, course) {
        if (err) throw err;
        courseid = course;
        res.send(course);
    });   
}
//View quiz information route
// By Aliza Tanweer
exports.viewquiz = function(req,res,next){
    quiz.find({_id: req.params.quizID},function(err,quiz){
        if(err) throw err;
        res.send(quiz);
    });
}

//By Kulsoom Khurshid
//Attempt quiz 
exports.attemptQuiz =  (req, res, next) => {
    getId = req.params.quizID;
    quiz.findById(getId, function(err, QuizFound) {
        if (err) throw err;
        //get todays date
        d1 = new Date();
        //Check if deadline is available
        deadline = QuizFound[0].deadlineDate
        if(deadline >= d1){
            quiz.findByIdAndUpdate(
                {_id:req.params.quizID}, 
                {"$push":{
                        "attempted":{
                            "sid": comeFromToken, //come from login
                            "answers" : req.body.answers,
                            "obtainedMarks" : "N/A"
                            }
                        }
                }, 
            {new:true, upsert: false}, 
            (err,data) => {
                if(err) throw err;
                res.json(data);
            })
        }
        else{
            res.json("Quiz Due Date has passed")
        }
});
}

//                              Results
// By Hunain Ashfaq
exports.viewGrade = function(req, res, next){
    Course.find({_id:req.params.sid}).exec((err,data)=>{
        if (err) throw err;
        res.json(data);
    });
}
//There should be a result schema
// By Haris Butt
exports.ViewMarks = function (req, res, next){
    Course.find().exec((err,data)=>{
        if (err) throw err;
        res.json(data);
    });
}