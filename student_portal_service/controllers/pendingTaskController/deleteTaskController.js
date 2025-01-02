const taskDb = {
  tasks: require('../../data/tasks.json'),
  setTask(data) {
    this.tasks = data;
  },
};
const path = require('path');
const fsPromises = require('fs').promises;

const handleDeleteTask = async (req, res) => {
  const { taskId } = req.params;

  const foundTask = taskDb.tasks.filter((task) => task.id === parseInt(taskId));

  console.log(foundTask);

  console.log(foundTask);
  if (!foundTask) return res.status(404).json({ error: 'Task not found' });

  const remainingTask = taskDb.tasks.filter(
    (task) => task.id !== parseInt(taskId)
  );
  taskDb.setTask([...remainingTask]);
  const taskFilePath = path.join(__dirname, '..', '..', 'data', 'tasks.json');

  try {
    await fsPromises.writeFile(taskFilePath, JSON.stringify(taskDb.tasks));
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { handleDeleteTask };
