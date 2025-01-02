const userPersonalInformationDB = {
  userPersonalInformation: require('../../data/userPersonalInformation.json'),
  setUserPersonalInformation(data) {
    this.userPersonalInformation = data;
  },
};

const fs = require('fs');
const path = require('path');

const handleGetUserPersonalInformation = (req, res) => {
  const users = userPersonalInformationDB.userPersonalInformation;

  const newData = users.map((user) => {
    let newUserData = {};
    const imagePath = path.join(
      __dirname,
      '..',
      '..',
      'public',
      `${user.image}`
    );
    if (!fs.existsSync(imagePath)) {
      newUserData = {
        ...user,
        image: `/images/image_placeholder.png`,
      };
    } else {
      newUserData = user;
    }

    // const remainingUsers = users.filter(
    //   (person) => person.userId !== newUserData.userId
    // );

    // console.log('remaining users=>', remainingUsers.flat());

    return newUserData;
  });

  res.status(200).json({ users: newData });
};

module.exports = { handleGetUserPersonalInformation };
