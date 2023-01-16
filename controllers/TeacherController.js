const mongoose = require("mongoose");
const Course = require("../models/course");
const Assignment = require("../models/assignment");
const Quiz = require("../models/quiz");
const fs = require('fs')
class TeacherController {
  static deleteAssignment(req, res, next) {
    const assignmentid = req.params.aid;
    const courseid = req.params.cid;
    //deleting assignment from course
    Course.updateOne(
      { _id: courseid },
      {
        $pull: {
          assignmentList: { assignmentID: assignmentid },
        },
      },
      (err, result) => {
        if (err) {
          res.statusCode = 504
          res.json({ error: err });
          return;
        }
        //deleting assignment from assignment collection
        Assignment.deleteOne({_id: assignmentid}, (err) => {
          if (err) {
            res.statusCode = 504
            res.json({ error: err });
            return;
          }
          res.statusCode = 200
          res.json({ success: "Assignment successfully deleted!" });  
        })
      }
    );
  }
  static async addAssignment(req, res, next) {
    //reading uploaded File
    const file = req.file;
    const buffer = fs.readFileSync(file.path);
    //adding the document in assignment collection
    const assignment = {
      assignmentNumber: req.body.number,
      title: req.body.title,
      totalMarks: req.body.marks,
      fileName: file.filename,
      deadline: req.body.deadline,
      file: buffer
    };
    const assign = new Assignment(assignment);
    const assignmentID = assign._id;
    assign.save((err, data) => {
      if (err) {
        res.statusCode = 504
        res.json({ error: err });
        return;
      }
      console.log(data)
      //adding the assignment id in course collection
      const courseid = req.body.courseid;
      Course.updateOne(
        { _id: courseid },
        { $push: { assignmentList: {assignmentID: assignmentID} } },
        (err, data) => {
          if (err) {
            res.statusCode = 504
            res.json({ error: err });
            return;
          }
          if ('matchedCount' in data && data.matchedCount === 0) {
            res.setStatus = 404
            res.json({'error' : 'Course id not found'})
            return
          }
        }
      );
      res.json({ success: "Assignment successfully uploaded!" });
    });
   
  }
  static getMaterials(req, res) {
    Course.findById(req.params.courseid, (err, data) => {
      if (err) throw err;
      res.json({ materials: data.materialList });
    });
  }
  static getAttemptedQuiz(req, res, next) {
    Course.findOne({"quizList.quizID": req.params.qid})
      .populate("quizList.quizID")
      .exec((err, data) => {
        console.log(data)
        if (err) throw err;
        for (let i = 0; i < data.quizList.quizID.attempted; i++) {
          if (quizList.quizID.attempted[i].sid.toString() === req.params.sid.toString()) {
            res.json({ quiz: quizList.quizID.attempted[i] });
            return
          }
        }
        res.json({ error: "quiz not found" });
      });
  }
  static addQuiz(req, res, next) {
    Quiz.create(req.body, function (err, quiz) {
      if (err) {
        return next(err);
      }
      var qid = quiz._id;
      console.log(qid);
      Course.findOneAndUpdate(
        { _id: req.params.cid },
        {
          $push: {
            quizList: {
              quizID: qid,
            },
          },
        },
        function (err, data) {
          if (err) throw err;
          console.log(data);
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(quiz._id);
        }
      );
    });
  }

  static deleteQuiz(req, res, next) {
    Quiz.deleteOne({ _id: req.params.qid }, function (err, result) {
      if (err) {
        return next(err);
      }
      Course.findOneAndUpdate(
        { _id: req.params.cid },
        {
          $pull: {
            quizList: {
              quizID: req.params.qid,
            },
          },
        },
        { new: true, upsert: false },
        function (err, data) {
          if (err) throw err;
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(data);
        }
      );
    });
  }
  static async deleteQuizMarks(req, res, next) {
    const studID = req.params.sID;
    const quizID = req.params.qID;
    const marks = 0;
    try {
      const attemptedQuiz = await Quiz.findOneAndUpdate(
        {
          _id: quizID,
          attempted: { $elemMatch: { sid: studID } },
        },
        { "attempted.$.obtainedMarks": marks }
      );
      console.log(attemptedQuiz);
      res.json(attemptedQuiz?.attempted);
    } catch (err) {
      next(err);
    }
  }
  static async deleteAssignmentMarks(req, res, next) {
    const studID = req.params.sID;
    const assignmentID = req.params.aID;
    const marks = 0;
    try {
      const attemptedAssignments = await Assignment.findOneAndUpdate(
        {
          _id: assignmentID,
          attempted: { $elemMatch: { sid: studID } },
        },
        { $set: { "attempted.$.obtainedMarks": marks } }
      );
      console.log(attemptedAssignments);
      res.json(attemptedAssignments?.attempted);
    } catch (err) {
      next(err);
    }
  }
  static async getAttemptedAssignment(req, res, next) {
    var options = {
      root: path.join(__dirname, "../public/assignments"),
    };

    const studID = req.params.sid;
    const assignmentID = req.params.id;

    Assignment.find({
      _id: assignmentID,
      attempted: { $elemMatch: { sid: studID } },
    }).then((assignment) => {
      var fn = req.body.fileName;
      res.sendFile(fn, options, function (err) {
        if (err) {
          next(err);
        } else {
          console.log("Sent:", fn);
        }
      });
    });
  }
}
module.exports = TeacherController;
