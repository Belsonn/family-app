const DailyTask = require("./../models/dailyTask.model");
const Family = require("./../models/family.model");

exports.createDailyTask = async (req, res, next) => {
  const dailyTask = await DailyTask.create(req.body);

  const family = await Family.findByIdAndUpdate(
    req.family._id,
    {
      $push: { dailyTasks: dailyTask._id },
    },
    { new: true }
  ).populate("dailyTasks");

  res.status(200).json({
    status: "success",
    results: family.dailyTasks.length,
    data: {
      dailyTasks: family.dailyTasks,
    },
  });
};

exports.getDailyTasks = async (req, res, next) => {
  const family = await Family.findById(req.family._id).populate("dailyTasks");

  let dailyTasks = family.dailyTasks;

  res.status(200).json({
    status: "success",
    results: family.dailyTasks.length,
    data: {
      dailyTasks,
    },
  });
};

exports.taskOnDate = async (req, res, next) => {

  const family = await Family.findById(req.family._id).populate("tasks");

  res.status(200).json({
    data: {
      family
    }
  })

};
