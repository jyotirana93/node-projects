const taskDb = {
  tasks: require('../../data/tasks.json'),
  setTask(data) {
    this.tasks = data;
  },
};

const handleGetTaskId = (req, res) => {
  const { taskId } = req.params;

  const foundTask = taskDb.tasks.find((task) => task.id === parseInt(taskId));

  console.log(foundTask);
  if (!foundTask) return res.status(404).json({ error: 'Task not found' });

  res.status(200).json(foundTask);
};

module.exports = { handleGetTaskId };
