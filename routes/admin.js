var express = require('express');
var router = express.Router();
const Teacher = require('../models/teacher')
const Class = require('../models/class')
var adminController = require ('../controllers/adminController')

/* GET home page. */
router.get('/', adminController.index);
/*Ali Add Course */
router.post('addcourse', adminController.addCourse)
/*Ali View Course */
router.get('viewcourses', adminController.viewCourses)
/*Ali Delete Course */
router.delete('deletecourses/:cid', adminController.deleteCourse)
/*Ali Modify Course */
router.put('modifycourse/cid', adminController.modifyCourse)
/*KHEZAR View Students */
router.get('/viewstudents', adminController.viewStudents)
/*ASFAND View Classes */
router.get('/viewclasses', adminController.viewClasses)
/*FAAIZ Assign Teacher*/
router.put('/assignteacher/:tid/course/:cid', adminController.assignTeacher)
/* MAHNOOR assign Student */
router.put('/assignstudent/:sid:cid', adminController.assignStudent)
/*FAAIZ Modify Teacher */
router.put('/modifyteacher/:tid', adminController.modifyTeacher)
/*FAAIZ Modify Student */
router.put('/modifystudent/:sid', adminController.modifyStudent)
/* MAHNOOR Modify Class by class id */
router.put('/modifyclass/:cid', adminController.modifyClass)
/*MIFRA Add Student*/
router.post('/addstudent', adminController.addStudent)
/*JUNAID Add Teacher*/
router.post('/addteacher', adminController.addTeacher)
/*Esha Delete Teacher by ID*/
router.delete('/deleteteacher/:tid', adminController.deleteTeacher)
/*Alishba Delete Student by ID*/
router.delete('/deletestudent/:sid',adminController.deleteStudent)
/* MAHNOOR delete class by class id */
router.delete('/deleteclass/:cid', adminController.deleteClass)
//Hadi:
router.post('/addclass', function(req, res, next) {
    Class.create(req.body)
        .then((result) => {
            console.log('Class has been Added ', result);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(result);
        }, (err) => next(err))
        .catch((err) => next(err));
});
//Abdullah
router.get('/viewteachers', function(req, res, next) {
    Teacher.find().sort('name').exec(function(error, results) {
        if (error) {
            return next(error);
        }
        // Respond with valid data
        res.json(results);
});
});
module.exports = router;