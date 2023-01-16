var express = require('express');
var Class = require('../models/class');
var Course = require('../models/course')
var Teacher = require('../models/teacher');
var Student = require('../models/student');
var Quiz = require('../models/quiz');
var User = require('../models/user')
var Assignment = require('../models/assignment')


exports.index = (req, res, next) => {
    res.render('index', { title: 'Admin Page' });
}
exports.viewStudents = (req, res, next) => {
    Student.find().sort('student_regNo')
        .exec((error, results) => {
            if (error) {
                return next(error);
            }
            res.json(results);
    });
}
exports.viewCourses = (req,res,next)=>{
    Course.find({})
        .exec((error, results) => {
            if(error) {
                return next(error);
            }
            res.json(results);
        })
}
exports.viewClasses = (req, res, next) => {
    Class.find({}).populate('studentsList.studentID')
        .exec((error, results) => {
            if(error) {
                return next(error);
            }
            res.json(results);
        })
}
exports.assignTeacher = (req, res, next) => {
    Course.findOneAndUpdate({ _id: req.params.cid }, {
                "teacher": req.params.tid
    }, { new: true, upsert: false },
        (error, results) => {
            if (error) {
                return next(error);
            }
            // Respond with valid data
            res.json(results);
        }
    )
}
exports.assignStudent = (req, res, next) => {
    Class.findOneAndUpdate({ _id: req.params.cid }, {
        "$push": {
            "studentsList": {
                "studentID": req.params.sid
            }
        }
    }, { new: true, upsert: false },
        (error, results) => {
            if(error) {
                return next(error);
            }
            res.json(results);
        }
    )
}
exports.modifyStudent = (req, res, next) => {
    Student.findOneAndUpdate(req.body)
        .then((student) => {
            console.log('Student has been Updated ', student);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(student);
        }, (err) => next(err))
        .catch((err) => next(err));
}
exports.modifyTeacher = (req, res, next) => {
    Teacher.findOneAndUpdate(req.body)
        .then((teacher) => {
            console.log('Teacher has been Updated ', teacher);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(teacher);
        }, (err) => next(err))
        .catch((err) => next(err));
}
exports.modifyClass = (req, res, next) => {
    Class.findOneAndUpdate(req.body)
        .then((_class) => {
            console.log('Class has been updated ', _class);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(_class);
        }, (err) => next(err))
        .catch((err) => next(err));
}
exports.modifyCourse = (req,res,next)=>{
    Course.findOneAndUpdate(req.body)
        .then((course) => {
            console.log('Course has been Updated ', course);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(course);
        }, (err) => next(err))
        .catch((err) => next(err));
}
exports.addStudent = (req, res, next) => {
    Student.create(req.body)
        .then((student) => {
            console.log("Student has been Added", student)
            res.sendCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(student)
        }, (err) => next(err))
        .catch((err) => next(err))

}
exports.addTeacher = (req, res, next) => {
    Teacher.create(req.body)
        .then((teacher) => {
            console.log('Teacher has been Added ', teacher);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(teacher);
        }, (err) => next(err))
        .catch((err) => next(err));
}
exports.addCourse = (req,res,next)=>{
    Course.create(req.body)
    .then((course) => {
        console.log("Course has been Added", course)
        res.sendCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(course)
    }, (err) => next(err))
    .catch((err) => next(err))

}
exports.deleteStudent = (req, res, next) => {
    Student.deleteOne({ _id: req.params.sid }, function (error, results) {
        if (error) {
            return next(error);
        }
        // Respond with valid data
        res.json(results);
    });
}
exports.deleteTeacher = (req, res, next) => {
    Teacher.deleteOne({ _id: req.params.tid }, function (error, results) {
        if (error) {
            return next(error);
        }
        res.json(results);
    });
}
exports.deleteClass = (req, res, next) => {
    Class.deleteOne({_id: req.params.cid}, function(error, results) {
        if(error) {
            return next(error);
        }
        res.json(results);
    })
}
exports.deleteCourse = (req,res,next)=>{
    Course.deleteOne({ _id: req.params.sid }, function (error, results) {
        if (error) {
            return next(error);
        }
        // Respond with valid data
        res.json(results);
    });

}
