const express = require("express");
const authController = require("./../controllers/authController");
const taskController = require("./../controllers/taskController");
const dailyTaskController = require("./../controllers/dailyTaskController");
const router = express.Router();

router.use(authController.protect);

router.post("/addTask", taskController.addTask);
router.get("/", taskController.getTasks);

router.post("/addDailyTask", dailyTaskController.createDailyTask);
router.post("/updateDailyTasks", dailyTaskController.updateDailyTask);
router.get("/dailyWithTask", dailyTaskController.taskOnDate);
router.get("/daily", dailyTaskController.getDailyTasks);

module.exports = router;
