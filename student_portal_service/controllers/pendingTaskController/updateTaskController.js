const taskDb = {
  tasks: require('../../data/tasks.json'),
  setTask(data) {
    this.tasks = data;
  },
};
const path = require('path');
const fsPromises = require('fs').promises;

const handleUpdateTask = async (req, res) => {
  const { taskId } = req.params;
  const { task, complete } = req.body;

  const foundTask = taskDb.tasks.find((task) => task.id === parseInt(taskId));

  if (!foundTask) return res.status(404).json({ error: 'Task not found' });

  foundTask.task = task || foundTask.task;
  foundTask.complete = complete;

  const remainingTask = taskDb.tasks.filter(
    (task) => task.id !== parseInt(taskId)
  );

  const unsortedTask = [...remainingTask, foundTask];

  const sortedTask = unsortedTask.sort((a, b) =>
    a.id > b.id ? 1 : a.id < b.id ? -1 : 0
  );

  taskDb.setTask(sortedTask);

  const taskFilePath = path.join(__dirname, '..', '..', 'data', 'tasks.json');
  const updatedTasks = taskDb.tasks;

  try {
    await fsPromises.writeFile(taskFilePath, JSON.stringify(updatedTasks));
  } catch (error) {
    console.log(error);
  }

  res
    .status(201)
    .json({ message: `Task ${foundTask.id} updated successfully` });
};

module.exports = { handleUpdateTask };
