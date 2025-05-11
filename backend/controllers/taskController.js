import Task from "../models/taskModel.js";

//CREATE TASK
export const createTask = async (req, res) => {
  const { title, description, priority, dueDate, completed } = req.body;

  if (!title || !description) {
    return res
      .status(400)
      .json({ success: false, message: "Title and description are required" });
  }

  try {
    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      completed: completed === "YES" || completed === "true",
      owner: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
//GET ALL TASKS FORM LOGGED IN USER
export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ owner: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json({
      success: true,
      message: "Tasks fetched successfully",
      tasks,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
//GET SINGLE TASK BY ID(MUST BELONG TO LOGGED IN USER)
export const getTaskById = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findOne({ _id: id, owner: req.user._id });
    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }
    res.status(200).json({
      success: true,
      message: "Task fetched successfully",
      task,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

//UPDATE A TASK
export const updateTask = async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.completed !== undefined) {
      data.completed =
        data.completed === "YES" ||
        data.completed === "Yes" ||
        data.completed === true;
    }
    const update = await Task.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      data,
      { new: true, runValidators: true }
    );
    if (!update) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task: update,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

//DELETE A TASK
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }
    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
