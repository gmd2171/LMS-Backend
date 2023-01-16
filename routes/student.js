var express = require('express');
var router = express.Router();
var studentController = require ('../controllers/studentController');

/* GET home page By Hamza */
router.get('/', studentController.index);

//                              Assignments
/* Urooj's Route */
router.get('/viewassignment',studentController.viewAssignment);
/* Hamza's Route */
router.put('/submitassignment/:assignmentID',studentController.submitAssignment)

//                              Materials
//ViewMaterial Route by Laraib
router.get('/ViewMaterial',studentController.ViewMaterial);

//MALAIKA download material
router.get('/material/:id', studentController.DownloadMaterial)

/*                              Quizess
Routes By Aliza
to get quiz list */
router.get('/getquiz', studentController.getquiz);
//to view quiz
router.get('/viewquiz', studentController.viewquiz);

//Route By Kulsoom
//to attempt quiz
router.put('/attemptquiz/:quizID', studentController.attemptQuiz);



//                              Result
//By Hunain and Haris
router.get('/result/:sid', studentController.viewGrade)
router.get('/result', studentController.ViewMarks)

//Export Router
module.exports = router;