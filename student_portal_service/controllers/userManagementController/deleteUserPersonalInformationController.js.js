const userPersonalInformationDB = {
  userPersonalInformation: require('../../data/userPersonalInformation.json'),
  setUserPersonalInformation(data) {
    this.userPersonalInformation = data;
  },
};

const path = require('path');
const fsPromises = require('fs').promises;
const fs = require('fs');

const handleDeleteUserPersonalInformation = async (req, res) => {
  const { userId } = req.params;

  const foundUser = userPersonalInformationDB.userPersonalInformation.find(
    (person) => person.userId === parseInt(userId)
  );

  if (!foundUser)
    return res.status(404).json({ error: `User id ${userId} not found` });

  const remainingUsers =
    userPersonalInformationDB.userPersonalInformation.filter(
      (person) => person.userId !== parseInt(userId)
    );

  const oldImage = foundUser.image;
  const oldImageFilePath = path.join(__dirname, '..', '..', 'public', oldImage);

  userPersonalInformationDB.setUserPersonalInformation([...remainingUsers]);

  const filePath = path.join(
    __dirname,
    '..',
    '..',
    'data',
    'userPersonalInformation.json'
  );

  try {
    await fsPromises.writeFile(
      filePath,
      JSON.stringify(userPersonalInformationDB.userPersonalInformation)
    );

    if (fs.existsSync(oldImageFilePath)) {
      await fsPromises.unlink(oldImageFilePath);
    }
  } catch (error) {
    console.log(error);
  }

  res
    .status(200)
    .json({ message: `User ${foundUser.firstname} deleted successfully` });
};

module.exports = { handleDeleteUserPersonalInformation };
