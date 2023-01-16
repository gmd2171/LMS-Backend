var express = require('express');
var router = express.Router();

var HeadController = require('../controllers/HeadController')

// @Author: Beenish Shakeel [SP20-BCS-017]
router.get("/", HeadController.viewDashboard);
router.get("/graph", HeadController.viewGraph);

// @Author: Farasat Khan [SP20-BCS-025]
router.get('/materials', HeadController.viewMaterials);
router.get('/results/student/:id', HeadController.viewParticularStudentResult);

// @Author: Maria Javed [SP20-BCS-049]
router.get('/results/class/:id', HeadController.viewParticularClassResult);

// @Author: Sammi Gul [SP20-BCS-006]
router.get('/class', HeadController.viewClasses);

// @Author: Waleed Abdullah [FA18-BCS-128]
router.get('/students', HeadController.viewStudents);

// @Author: Kumail Raza [SP20-BCS-045]
router.put('/quiz/:qid', HeadController.updateParticularQuiz);

// @Author: Hassan Shahzad [SP20-BCS-036]
router.put('/assigment/:id', HeadController.updateParticularAssignment);

//@Author: Hassan Raza [SP20-BCS-035]
router.put('/update-material', HeadController.updateParticularMaterials);

module.exports = router;
