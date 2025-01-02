const userDB = {
  users: require('../data/user.json'),
  setUsers(data) {
    this.users = data;
  },
};

const userActivitiesDB = {
  activities: require('../data/activities.json'),
  setActivities(data) {
    this.activities = data;
  },
};

const fsPromises = require('fs').promises;
const path = require('path');

const handleUserLogout = async (req, res) => {
  const cookie = req.cookies;
  console.log(cookie);
  const refreshToken = cookie?.token;
  if (!cookie.token) {
    res.clearCookie('token', { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
    return res.sendStatus(204);
  }

  const foundUser = userDB.users.find(
    (person) => person.refreshToken === refreshToken
  );
  if (!foundUser) {
    res.clearCookie('token', { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
    return res.sendStatus(204);
  }

  const remainingActivities = userActivitiesDB.activities.filter(
    (activity) => activity.username !== foundUser.username
  );
  userActivitiesDB.setActivities([...remainingActivities]);
  const filePath = path.join(__dirname, '..', 'data', 'activities.json');
  await fsPromises.writeFile(
    filePath,
    JSON.stringify(userActivitiesDB.activities)
  );

  const currentUser = { ...foundUser, refreshToken: '', isLoggedIn: false };
  const otherUsers = userDB.users.filter(
    (person) => person.refreshToken !== refreshToken
  );
  userDB.setUsers([...otherUsers, currentUser]);
  await fsPromises.writeFile(
    path.join(__dirname, '..', 'data', 'user.json'),
    JSON.stringify(userDB.users)
  );
  res.clearCookie('token', { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
  return res.sendStatus(204);
};

module.exports = handleUserLogout;
