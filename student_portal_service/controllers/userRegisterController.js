const userDB = {
  users: require('../data/user.json'),
  setUsers(data) {
    this.users = data;
  },
};
const bcrypt = require('bcrypt');
const fsPromises = require('fs').promises;
const path = require('path');

const handleUserRegister = async (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);
  if (!username || !password)
    return res.status(400).json({ error: 'Username or Password missing' });

  const duplicate = userDB.users.find((person) => person.username === username);
  if (duplicate)
    return res.status(409).json({ error: `${username} is already registered` });
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      username,
      roles: { user: 2001 },
      password: hashedPassword,
    };
    const otherUsers = userDB.users;
    userDB.setUsers([...otherUsers, newUser]);
    await fsPromises.writeFile(
      path.join(__dirname, '..', 'data', 'user.json'),
      JSON.stringify(userDB.users)
    );
    res
      .status(201)
      .json({ message: `username ${username} registered succesfully` });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = handleUserRegister;
