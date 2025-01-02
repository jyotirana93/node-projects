const taskDb = {
  tasks: require('../../data/tasks.json'),
  setTask(data) {
    this.tasks = data;
  },
};

const generateId = require('../../utilities/createId');
const path = require('path');
const fsPromises = require('fs').promises;

const handleAddTask = async (req, res) => {
  const { task, complete } = req.body;

  const currentTask = {
    id: generateId(taskDb.tasks),
    task,
    complete,
  };

  const taskFilePath = path.join(__dirname, '..', '..', 'data', 'tasks.json');

  taskDb.setTask([...taskDb.tasks, currentTask]);
  try {
    await fsPromises.writeFile(taskFilePath, JSON.stringify(taskDb.tasks));
  } catch (error) {
    console.log(error);
  }

  res.status(201).json({ message: 'Task added successfully' });
};

module.exports = { handleAddTask };
