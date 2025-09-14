import TaskModel from "../model/TasksModel.js";
import mongoose from "mongoose";

export const CreateTask = async (req, res) => {
    try {
        let user_id = req.headers["user_id"];
        let reqBody = req.body;
        reqBody.user_id = user_id;
        await TaskModel.create(reqBody);

        return res.json({status:'success', message:'Task created successfully'})
    } catch (error) {
        res.json({status:'fail', 'Massage': error.toString()})
    }
}

export const UpdateTaskStatus = async (req, res) => {
    try {
        let id = req.params.id;
        let status = req.params.status;
        let user_id = req.headers["user_id"];
        await TaskModel.findOneAndUpdate({_id:id, user_id:user_id}, {status:status});
        return res.json({status:'success', message:'Task Status update successfully'})
    } catch (error) {
        return res.json({status:'fail', 'Massage': error.toString()})
    }
}

export const TaskListByStatus = async (req, res) => {
    try {
        let status = req.params.status;
        let user_id = req.headers["user_id"];
        let taskList = await TaskModel.find({status:status, user_id:user_id});
        return res.json({status:'success', message:'Task list by status successfully', task:taskList})
    } catch (error) {
        res.json({status:'fail', 'Massage': error.toString()})
    }
}

export const DeleteTask = async (req, res) => {
    try {
        let id = req.params.id;
        let user_id = req.headers["user_id"];
        await TaskModel.findOneAndDelete({_id:id, user_id:user_id});
        return res.json({status:'success', message:'Task deleted successfully'})
    } catch (error) {
        res.json({status:'fail', 'Massage': error.toString()})
    }
}

export const CountTask = async (req, res) => {
    try {
        let ObjectID = mongoose.Types.ObjectId;
        let user_id = req.headers["user_id"];
        let userObjectId = new ObjectID(user_id);

        let data = await TaskModel.aggregate([
            {$match: {user_id: userObjectId}},
            {$group: {_id: "$status", sum: {$count: {}}}}
        ]);
        return res.json({status:'success', message:'Task counted successfully', count:data})
    } catch (error) {
        res.json({status:'fail', 'Massage': error.toString()})
    }
}