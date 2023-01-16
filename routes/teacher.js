var express = require('express');
const multer = require('multer')
var router = express.Router();
const Course = require('../models/course')
const Assignment = require("../models/assignment");
const Quiz = require("../models/quiz");
const TeacherController = require('../controllers/TeacherController');
const  mongoose= require('mongoose');
const fs = require('fs')
const ObjectId = mongoose.Types.ObjectId
router.get('/',function(req,res,next){
  res.send("Teachers Dashboard")
})
//By Danyal Arif SP20-BCS-020
router.delete('/deleteassignment/:cid/:aid', TeacherController.deleteAssignment)
router.post('/addassignment', multer({dest: 'public/assignments/'}).single('file'), TeacherController.addAssignment)
//By Aaiza Irfan SP20-BCS-001
router.post('/addquiz/:cid', TeacherController.addQuiz);
router.delete('/quiz/:qid/:cid', TeacherController.deleteQuiz);
//By Khansa Kiran SP20-BCS-042
router.get('/materials/:courseid', TeacherController.getMaterials)
router.get('/quiz/:qid/:sid', TeacherController.getAttemptedQuiz)
//By Mina SP20-BCS-051
router.delete("/quiz/marks/:qID/:sID", TeacherController.deleteQuizMarks);
router.delete("/assignment/marks/:aID/:sID", TeacherController.deleteAssignmentMarks);
router.get('/assign/:id/:sid', TeacherController.getAttemptedAssignment);
//By Alliyan Waheed SP20-BCS-002
router.get('/viewattassign/:cid/:sid', (req, res, next) => {

  Course.aggregate([
      {
          $match: {
              "_id": ObjectId(req.params.cid)
          }
      },
      {
          $unwind: "$studentsList"
      },
      {
          $match: {
              "studentsList.studentID": ObjectId(req.params.sid)
          }
      },
      {
          $lookup: {
              from: Assignment.collection.name,
              localField: 'assignmentList.assignmentID',
              foreignField: "_id",
              as: "assignments"
          }
      },
      {
          $project: {_id: 1, courseID: 1, courseName: 1, studentsList: 1, assignments: 1}
      }
  ]).exec((error, result) => {
      if (error) throw error;

      const viewAttemptedAssignment = [];

      result.map((item) => {
          item.assignments.map((assigment) => {
              assigment.attempted.map((attempted) => {
                  if (attempted.sid == req.params.sid) {
                      viewAttemptedAssignment.push(attempted)
                  }
              })
          })
      });

      res.send(viewAttemptedAssignment)
  });
});
//By Abdul Mateen
// post quiz marks
router.post('/addquizmarks',(req,res,next)=>{
  const courseId = req.body.cid;
  const quizId = req.body.qid;
  const attemptedQuiz = {
    sid: req.body.sid,
    answers: req.body.answersArray,
    obtainedMarks: req.body.obtainedMarks
  };

  Quiz.updateOne(
    { courseId: courseId, quizId: quizId },
    { $push: { attempted: attemptedQuiz } }
 ).exec((err, result) => {
  if (err) {
	console.log(err)
  } else {
    result.save((error) => {
      if (error) {
        console.log(err)
      } else {
        console.log('Quiz Marks Added')
      }
    });
  }
 });

 })

// post assignments marks
router.post('/addassignmentmarks',(req,res,next)=>{
  const courseId = req.body.cid;
  const assignmentId = req.body.aid;
  const attemptedAssignment = {
    sid: studentId,
    file: fileBuffer,
    fileName: fileName,
    fileExtension: fileExtension,
    uploadedDate: new Date(),
    obtainedMarks: obtainedMarks
  };

 Assignment.updateOne(
  { courseId: courseId, assignmentId: assignmentId },
  { $push: { attempted: attemptedAssignment } }
 ).exec((err, result) => {
  if (err) {
	console.log(err)
  } else {
    result.save((error) => {
      if (error) {
        console.log(err)
      } else {
        console.log('Assignment Marks Added')
      }
    });
  }
 });


});


//update assignment marks
router.put('/updateassignmentmarks/:aid/:cid/:sid',(req,res,next)=>{
  const cid = req.params.cid;
  const aid = req.params.aid;
  const studentId = req.params.sid;
  Assignment.findOne({ courseid: cid, assignmentid: aid })
  .populate("attempted.sid")
  .exec((err, assignment) => {
    if (err) {
 	console.log(err);
    } else {
      const attempted = assignment.attempted.find(
        (attempt) => attempt.sid._id.toString() === studentId.toString()
      );
      if (attempted) {
        attempted.obtainedMarks = obtainedMarks;
        assignment.save((error) => {
          if (error) {
            console.log(err);
          } else {
	    console.log('Marks are updated successfully')
          }
        });
      } else {
      console.log('This student didnt submitted the assignment');
      }
    }
  });


})

//update quiz marks
router.put('/updatequizmarks/:qid/:cid/:sid',(req,res,next)=>{
  const cid = req.params.cid;
  const qid = req.params.qid;
  const studentId = req.params.sid;
  Quiz.findOne({ courseId: cid, quizId: qid })
  .populate("attempted.sid")
  .exec((err, quiz) => {
    if (err) {
 	console.log(err);
    } else {
      const attempted = quiz.attempted.find(
        (attempt) => attempt.sid._id.toString() === studentId.toString()
      );
      if (attempted) {
        attempted.obtainedMarks = obtainedMarks;
        quiz.save((error) => {
          if (error) {
            console.log(err);
          } else {
	    console.log('Marks are updated successfully')
          }
        });
      } else {
      console.log('This student didnt submitted the quiz');
      }
    }
  })});
//By Harris Ahmed
router.delete('/delteacher/:id', function (req, res, next) {
	Teacher.deleteOne({ _id: req.params.id }, function (error, results) {
		if (error) {
			return next(error);
		}
		// Respond with valid data
		res.json(results);
	});
});


//By Waleed Afzaal
router.get('/viewattquiz', function(req, res, next) {
  quiz.find({attempted: {$gt: 0}},function(err,quizzes){
      if(err){
          res.send(400).send({"error":"Something Went Wrong"})
      }else{
          res.send(200).send({"success":"Quizzes Fetched Successfully", "quizzes":quizzes})
      }
  })
})
//Hammad Tufail
router.post('/addmat/:cid', multer({dest: 'public/materials/'}).single('file'), (req, res) => {
  const cid = req.params.cid
  const file = req.file;
  const buffer = fs.readFileSync(file.path);
  const title = req.body.title

  Course.findOneAndUpdate({_id: cid}, {"$push" : {
    "materialList": {
      title: title,
      file: buffer,
      fileName: file.filename
    }
  }}, (err, data) => {
    if (err) throw err
    res.json({"Success" : "Material uploaded"})
  })
})

module.exports = router