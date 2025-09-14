import express from "express";
const router = express.Router();
import * as UsersCntroller from "../app/controllers/UsersController.js";
import * as TaskController from "../app/controllers/TaskController.js";
import AuthMiddleware from "../app/middleware/AuthMiddleware.js";

// Users
router.post("/Registration", UsersCntroller.Registration);
router.post("/Login", UsersCntroller.Login);
router.get("/ProfileDetails", AuthMiddleware, UsersCntroller.ProfileDetails);
router.put("/UpdateProfile", AuthMiddleware, UsersCntroller.UpdateProfile);

router.get("/EmailVerify/:email", UsersCntroller.EmailVerify)
router.get("/CodeVerify/:email/:code", UsersCntroller.CodeVerify)
router.put('/ResetPassword', UsersCntroller.ResetPassword)

// Task
router.post("/CreateTask", AuthMiddleware, TaskController.CreateTask);
router.put("/UpdateTaskStatus/:id/:status", AuthMiddleware, TaskController.UpdateTaskStatus);
router.get("/TaskListByStatus/:status", AuthMiddleware, TaskController.TaskListByStatus);
router.delete("/DeleteTask/:id", AuthMiddleware, TaskController.DeleteTask);
router.get("/CountTask", AuthMiddleware, TaskController.CountTask);

export default router;