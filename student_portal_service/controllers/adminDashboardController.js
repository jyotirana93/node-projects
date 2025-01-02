const userDB = {
  users: require('../data/user.json'),
  setUsers(data) {
    this.users = data;
  },
};

const userActivitiesDB = {
  activities: require('../data/activities.json'),
};

const os = require('os');

const taskDb = {
  tasks: require('../data/tasks.json'),
  setTask(data) {
    this.tasks = data;
  },
};

const handleAdminDashboard = (req, res) => {
  const totalUsers = userDB.users.length;
  const usernames = userDB.users.map((person) => person.username);
  const activeUsers = userDB.users
    .filter((person) => person.isLoggedIn === true)
    .map((activeUser) => {
      let extractedActiveUserData = {
        username: activeUser.username,
      };
      return extractedActiveUserData;
    });

  const recentUserActivities = userActivitiesDB.activities;
  const adminSystemStatus = {
    platform: os.platform(),
  };
  const isOnline = userDB.users.find((person) => person.isLoggedIn === true);
  const pendingTasks = taskDb.tasks.filter(
    (task) => task.complete === false
  ).length;

  console.log(pendingTasks);

  res.status(200).json({
    numberOfUsers: totalUsers,
    users: usernames,
    activeUsers,
    recentUserActivities,
    adminSystemStatus,
    isOnline: isOnline?.isLoggedIn,
    pendingTasks,
  });
};

module.exports = handleAdminDashboard;
