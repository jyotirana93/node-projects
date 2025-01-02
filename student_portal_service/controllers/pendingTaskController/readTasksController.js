const taskDb = {
  tasks: require('../../data/tasks.json'),
  setTask(data) {
    this.tasks = data;
  },
};

const handleGetTasks = (req, res) => {
  const tasks = taskDb.tasks;

  res.status(200).json(tasks);
};

module.exports = { handleGetTasks };
