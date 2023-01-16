var express = require('express');
var router = express.Router();

var Class = require('../models/class');
var Course = require('../models/course');
var Student = require('../models/student');
// var Result = require('../models/result');
var Assignment = require('../models/assignment');
var Quiz = require('../models/quiz');

var mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

//@Author: Beenish Shakeel [SP20-BCS-017]
/* 
    Method: GET	
    Route: /
    Description: View Dashboard
    Returns: an object with data from 3 collections
*/
exports.viewDashboard =  async (req, res, next) => {
    try {
        let teachers = await Teacher.find({}, { __v: 0 }).populate(
          "userid",
          "name"
        );
        teachers = teachers.map(teacher => teacher.toObject());
        let courses = await Course.find({}, { __v: 0, materialList: 0, _id: 0 }).populate({
          path: "teacher",
          select: "userid",
          populate: {
            path: "userid",
            select: "name",
          },
        });
        courses = courses.map((course) => {
            let no_of_students = course.studentsList.length;
            let no_of_quizzes = course.quizList.length;
            let no_of_assignments = course.assignmentList.length;
    
            course.studentsList = undefined;
            course.quizList = undefined;
            course.assignmentList = undefined;
    
            return {
                ...course.toObject(),
                no_of_students: no_of_students,
                no_of_quizzes: no_of_quizzes,
                no_of_assignments: no_of_assignments
            };
        });
        let classes = await Class.find({}, { __v: 0, _id: 0 });
        classes = classes.map((class_record) => {
            let no_of_students = class_record.studentsList.length;
            class_record.studentsList = undefined;
            return {
            ...class_record.toObject(),
            no_of_students: no_of_students
            };
        });
        res.json({ teachers: teachers, courses: courses, classes: classes });
      } catch (e) {
        console.log(e);
        res.status(500).send("Could not get dashboard data");
      }
};
  
//@Author: Beenish Shakeel [SP20-BCS-017]
/* 
    Method: GET	
    Route: /graph
    Description: View graph
    Returns: number of passed students
*/
exports.viewGraph =  async (req, res, next) => {
    try {
        let coursesRecords = await Course.find()
            .populate({
                path: "teacher",
                select: "userid",
                populate: {
                    path: "userid",
                    select: "name"
                }
            })
            .populate("quizList.quizID")
            .populate("assignmentList.assignmentID");

        let courses = coursesRecords.map(courseRecord => {
            console.log("Course: ", courseRecord.toObject());
            let quizzes = courseRecord.quizList.map(quiz => {
                let studentsPassed = 0;
                let totalObtainedMarks = 0;
                let avgMarks = 0;
                if(quiz.quizID.attempted) {
                    quiz.quizID.attempted.forEach(attempt => {
                        studentsPassed += ((attempt.obtainedMarks / quiz.quizID.totalMarks) >= 0.33);
                        totalObtainedMarks += attempt.obtainedMarks;
                    });
                    avgMarks = totalObtainedMarks / quiz.quizID.attempted.length;
                }
                quiz.quizID.attempted = undefined;
                return {
                    ...quiz.quizID.toObject(),
                    avgMarks: avgMarks, 
                    studentsPassed: studentsPassed
                }
            });
            let assignments = courseRecord.assignmentList.map(assignment => {
                let studentsPassed = 0;
                let totalObtainedMarks = 0;
                let avgMarks = 0;
                if(assignment.assignmentID.attempted){
                    assignment.assignmentID.attempted.forEach(attempt => {
                        studentsPassed += ((attempt.obtainedMarks / assignment.assignmentID.totalMarks) >= 0.33);
                        totalObtainedMarks += attempt.obtainedMarks;
                    });
                    avgMarks = totalObtainedMarks / assignment.assignmentID.attempted.length;
                }
                assignment.assignmentID.attempted = undefined;
                return {
                    ...assignment.assignmentID.toObject(),
                    avgMarks: avgMarks,
                    studentsPassed: studentsPassed
                }
            });
            return {
                courseId: courseRecord.courseId,
                courseName: courseRecord.courseName,
                students: courseRecord.studentsList.length,
                teacher: courseRecord.teacher.userid.name,
                quizzes: quizzes,
                assignments: assignments
            };
        });

        res.json(courses);
    }
    catch(err) {
        res.status(500).send("Could not load process graph data");
        console.error(err);
    }
};

// @Author: Farasat Khan [SP20-BCS-025]
/*
    Method: GET	
    Route: /results/student/:id
    Description: View Results of student

    Returns: Returns a document with by applying aggregate method to calculate individual student's marks based 
    on numbers in quizzes and assignments. 
    
    Returns Total number in Assignment and Quizzes.
*/
exports.viewParticularStudentResult =  (req, res, next) => {

    const student_id = req.params.id;

    Course.aggregate([
        {
            $unwind: "$studentsList"
        },
        {
            $match: {
                "studentsList.studentID": ObjectId(student_id)
            }
        },
        {
            $lookup: {
                from: Quiz.collection.name,
                localField: "quizList.quizID",
                foreignField: "_id",
                as: "quizzes",
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
            $project: {_id: 1, courseID: 1, courseName: 1, studentsList: 1, quizzes: 1, assignments: 1}
        }
    ]).exec((error, result) => {
        if (error) throw error;

        const studentResult = [];

        const documents = result.map((document) => {
            
            const temp = {
                courseID: document.courseID,
                courseName: document.courseName,
                total_quiz_marks: 0,
                obtained_quiz_marks: 0,
                total_assignment_marks: 0,
                obtained_assignment_marks: 0
            }

            document.quizzes.map((quiz) => {
                quiz.attempted.map((attempted) => {
                    if (attempted.sid == student_id) {
                        temp.total_quiz_marks += quiz.totalMarks;
                        temp.obtained_quiz_marks += attempted.obtainedMarks;
                    }
                })
            })

            document.assignments.map((assignment) => {
                assignment.attempted.map((attempted) => {
                    if (attempted.sid == student_id) {
                        temp.total_assignment_marks += assignment.totalMarks;
                        temp.obtained_assignment_marks += attempted.obtainedMarks;
                    }
                })
            })

            studentResult.push(temp)
        })

        res.status(200).send(studentResult);
    })
};

// @Author: Farasat Khan [SP20-BCS-025]
/* 
    Method: GET	
    Route: /materials	
    Description: View Materials

    Returns: course_id, courseName, materialList
*/
exports.viewMaterials =  (req, res, next) => {
    Course.find({}).select({_id: 1, courseName: 1, materialList: 1}).exec((error, data) => {
        if (error) throw error;

        res.status(200).send(data);
    })
};


// @Author: Maria Javed [SP20-BCS-049]
/* 
    Method: GET	
    Route: /results/class/:id
    Description: View Results of Class

    Returns: Result Collection
*/
exports.viewParticularClassResult =  async (req, res, next) => {
    const class_id = req.params.id;
    try {
        const _class = await Class.findById(class_id).populate("studentsList.studentID");
        let results = await Promise.all(_class.studentsList.map(async (studentObj) => {
            let enrolledCourses = await Course.find({"studentsList.studentID": studentObj.studentID._id})
            .populate("quizList.quizID")
            .populate("assignmentList.assignmentID");

            let coursesResults = await Promise.all(enrolledCourses.map(async (course) => {
                let quizzes = [];
                let assignments = [];

                course.quizList(quizObj => {
                    let attempt = quizObj.quizID.attempted.find(attempt => attempt.sid === studentObj.studentID);
                    if(attempt) {
                        quizzes.push({
                            totalMarks: quizObj.quizID.totalMarks,
                            obtainedMarks: attempt.obtainedMarks
                        });
                    }
                });

                course.assignmentList(assignmentObj => {
                    let attempt = assignmentObj.assignmentID.attempted.find(attempt => attempt.sid === studentObj.studentID);
                    if(attempt) {
                        assignments.push({
                            totalMarks: assignmentObj.assignmentID.totalMarks,
                            obtainedMarks: attempt.obtainedMarks
                        });
                    }
                });

                return {
                    course: course.courseName,
                    quizzes: quizzes,
                    assignments: assignments
                };
            }));

            return {
                student: studentObj.studentID.student_regNo,
                results: coursesResults
            };
        }));

        res.json(results);
    }
    catch(err) {
        console.error(err);
        res.status(500).send("Class results could not be retrieved");
    }
};


// @Author: Sammi Gul [SP20-BCS-006]
/* 
    Method: GET	
    Route: /class
    Description: View Classes

    Returns: _id, className, studentsList
*/
exports.viewClasses =  (req, res, next) => {
    Class.find({}).populate({path: 'studentsList.studentID'}).exec((error, data) => {
        if (error) throw error;

        res.status(200).send(data);
    })
};


// @Author: Waleed Abdullah [FA18-BCS-128]
exports.viewStudents =  (req, res, next) => {
    Student.find().sort('name').exec(function(error, results) {
        if (error) {
            return next(error);
        }
        // Respond with valid data
        res.json(results);
    });
};


// @Author: Kumail Raza [SP20-BCS-045]
exports.updateParticularQuiz =  (req, res, next) => {
    Quiz.findOneAndUpdate({ _id: req.params.qid },{$set:{quizNumber: req.body.quizNumber, 
        title: req.body.title, uploadDate: req.body.uploadDate, totalMarks: req.body.totalMarks}},
        function(error, results) {
        if (error) {
            return next(error);
        }
        // Respond with valid data
        res.json(results);
    });
};

// @Author: Hassan Shahzad [SP20-BCS-036]
exports.updateParticularAssignment =  (req, res, next) => {
    Assignment.findOneAndUpdate({_id:req.params.qid},{$set:{assignmentNumber:req.body.assignmentNumber,
        title: req.body.title, uploadDate: req.body.uploadDate, totalMarks: req.body.totalMarks, deadline: req.body.deadline, file: req.body.file, filename: req.body.filename, fileExtension:req.body.fileExtension }},
         function(error, results) {
            if (error) {
                return next(error);
            }
            // Respond with valid data
            res.json(results);
    });
};


//@Author: Hassan Raza [SP20-BCS-035]
exports.updateParticularMaterials =  async function(req, res, next) {
    try {
        console.log("cfhgfh",req.params)
        await Material.findByIdAndUpdate({materialID:req.params.id}, req.body);
        res.status(200).json({ msg: "Product Updated" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ msg: err.message });
    }
}