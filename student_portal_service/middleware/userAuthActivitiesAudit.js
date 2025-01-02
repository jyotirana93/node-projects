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
const jwt = require('jsonwebtoken');
const path = require('path');
const fsPromises = require('fs').promises;

const handleUserAuthActivitiesAudit = () => {
  return async (req, res, next) => {
    const cookie = req.cookies;
    const refreshToken = cookie?.token;

    const tokenExpirationData = jwt.decode(
      refreshToken,
      process.env.REFRESH_TOKEN_SERCET_KEY
    );

    const currentTime = Date.now() / 1000;
    console.log(
      'current time is greater that token expiration time',
      currentTime > tokenExpirationData?.exp
    );

    if (currentTime > tokenExpirationData?.exp) {
      const remainingActivity = userActivitiesDB.activities.filter(
        (person) => person.username !== tokenExpirationData?.username
      );

      const foundUser = userDB.users.find(
        (person) => person.username === tokenExpirationData?.username
      );
      const remainingUsers = userDB.users.filter(
        (person) => person.username !== tokenExpirationData?.username
      );
      const currentUser = { ...foundUser, refreshToken: '', isLoggedIn: false };
      userDB.setUsers([...remainingUsers, currentUser]);

      const activitiesFilePath = path.join(
        __dirname,
        '..',
        'data',
        'activities.json'
      );
      const usersFilePath = path.join(__dirname, '..', 'data', 'user.json');

      userActivitiesDB.setActivities([...remainingActivity]);

      try {
        await fsPromises.writeFile(usersFilePath, JSON.stringify(userDB.users));
        await fsPromises.writeFile(
          activitiesFilePath,
          JSON.stringify(userActivitiesDB.activities)
        );
      } catch (error) {
        console.log(error);
      }
    }
    next();
  };
};

module.exports = handleUserAuthActivitiesAudit;
