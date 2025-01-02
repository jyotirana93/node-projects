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

const handleCreateId = require('../utilities/createId');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const fsPromises = require('fs').promises;

const handleUserAuth = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ error: 'Username or Password missing' });

  const foundUser = userDB.users.find((person) => person.username === username);

  if (!foundUser)
    return res.status(401).json({ error: `User ${username} not found` });

  const passwordMatch = await bcrypt.compare(password, foundUser.password);
  if (passwordMatch) {
    const newActivityId = handleCreateId(userActivitiesDB.activities);
    const roles = Object.values(foundUser.roles);

    const activity = {
      id: newActivityId,
      type: 'User Login',
      username: foundUser.username,
      timeStamp: new Date().toISOString(),
      details: `User ${foundUser.username} logged In`,
    };

    const accessTokenPayload = {
      userinfo: {
        username: foundUser.username,
        roles: roles,
      },
    };
    const refreshTokenPayload = {
      username: foundUser.username,
    };
    const accessSecretKey = process.env.ACCESS_TOKEN_SECRET_KEY;
    const refreshSecretKey = process.env.REFRESH_TOKEN_SERCET_KEY;

    const accessTokenExpirationTime = { expiresIn: '15s' };
    const refreshTokenExpirationTime = { expiresIn: '1d' };

    const accessToken = jwt.sign(
      accessTokenPayload,
      accessSecretKey,
      accessTokenExpirationTime
    );
    const refreshToken = jwt.sign(
      refreshTokenPayload,
      refreshSecretKey,
      refreshTokenExpirationTime
    );

    req.logActivity(activity);
    const currentUser = { ...foundUser, refreshToken, isLoggedIn: true };
    const otherUsers = userDB.users.filter(
      (person) => person.username !== foundUser.username
    );
    userDB.setUsers([...otherUsers, currentUser]);

    fsPromises.writeFile(
      path.join(__dirname, '..', 'data', 'user.json'),
      JSON.stringify(userDB.users)
    );

    res.cookie('token', refreshToken, {
      httpOnly: true,
      // secure: true,
      // sameSite: 'None',
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.json({
      message: 'You are logged in',
      roles,
      accessToken,
    });
  } else {
    return res
      .status(401)
      .json({ error: 'Pls enter correct Username or Password' });
  }
};

module.exports = handleUserAuth;
