const userDB = {
  users: require('../data/user.json'),
  setUsers(data) {
    this.users = data;
  },
};

const jwt = require('jsonwebtoken');

const handleRefreshToken = (req, res) => {
  const cookies = req.cookies;
  const refreshToken = cookies?.token;

  if (!refreshToken) return res.sendStatus(401);

  const foundPerson = userDB.users.find(
    (person) => person.refreshToken === refreshToken
  );

  if (!foundPerson) return res.sendStatus(403);
  const roles = Object.values(foundPerson.roles);

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SERCET_KEY,
    (err, decoded) => {
      if (err || foundPerson.username !== decoded.username)
        return res.sendStatus(403);
      const accessToken = jwt.sign(
        {
          userinfo: {
            username: decoded.username,
            roles: roles,
          },
        },
        process.env.ACCESS_TOKEN_SECRET_KEY,
        { expiresIn: '30s' }
      );
      res.json({ username: decoded.username, roles, accessToken });
    }
  );
};

module.exports = handleRefreshToken;
