const userPersonalInformationDB = {
  userPersonalInformation: require('../../data/userPersonalInformation.json'),
  setUserPersonalInformation(data) {
    this.userPersonalInformation = data;
  },
};

const path = require('path');
const fsPromises = require('fs').promises;
const fs = require('fs');

const handleUpdateUserPersonalInformation = async (req, res) => {
  const { firstname, lastname, mobile, email, gender, image } = req.body;
  const { userId } = req.params;

  const user = userPersonalInformationDB.userPersonalInformation.find(
    (person) => person.userId === parseInt(userId)
  );

  if (!user) return res.status(404).json({ error: 'User not found' });

  const oldImage = user.image;
  const oldImageFilePath = path.join(__dirname, '..', '..', 'public', oldImage);

  let imageName;
  if (image) {
    const imageParts = image.split(',');
    const imageExtension = imageParts[0]
      .split(':')[1]
      .split(';')[0]
      .split('/')[1];
    const base64Parts = image.split(`${imageParts[0]},`)[1];
    console.log(imageParts[0]);

    const buffer = Buffer.from(base64Parts, 'base64');

    const uniqueImageId =
      userPersonalInformationDB.userPersonalInformation.length + 1;

    if (imageExtension === 'png') {
      imageName = firstname + uniqueImageId + '.png';
    } else if (imageExtension === 'jpeg') {
      imageName = firstname + uniqueImageId + '.jpeg';
    } else if (imageExtension === 'jpg') {
      imageName = firstname + uniqueImageId + '.jpg';
    }

    let imageFilePath = path.join(
      __dirname,
      '..',
      '..',
      'public',
      'images',
      imageName
    );

    if (fs.existsSync(oldImageFilePath)) {
      await fsPromises.unlink(oldImageFilePath);
    }

    await fsPromises.writeFile(imageFilePath, buffer);
  }

  user.firstname = firstname || user.firstname;
  user.lastname = lastname || user.lastname;
  user.mobile = mobile || user.mobile;
  user.email = email || user.email;
  user.gender = gender || user.gender;
  user.image = !image ? user.image : `/images/${imageName}`;

  const remainingUser =
    userPersonalInformationDB.userPersonalInformation.filter(
      (person) => person.userId !== parseInt(userId)
    );

  const unsortedUser = [...remainingUser, user];

  const sortedUser = unsortedUser.sort((a, b) =>
    a.userId > b.userId ? 1 : a.userId < b.userId ? -1 : 0
  );

  const updatedUser = userPersonalInformationDB.userPersonalInformation.map(
    (person) => {
      if (person.userId === parseInt(userId)) {
        return {
          ...person,
          firstname,
          lastname,
          mobile,
          email,
          gender,
          image: !image ? person.image : `/images/${imageName}`,
        };
      }
      return person;
    }
  );

  console.log('updated Person===>', updatedUser);

  // userPersonalInformationDB.setUserPersonalInformation(sortedUser);
  userPersonalInformationDB.setUserPersonalInformation(updatedUser);

  const filePath = path.join(
    __dirname,
    '..',
    '..',
    'data',
    'userPersonalInformation.json'
  );

  const updatedUserInformation =
    userPersonalInformationDB.userPersonalInformation;
  await fsPromises.writeFile(filePath, JSON.stringify(updatedUserInformation));

  res
    .status(201)
    .json({ message: `User updated ${user.firstname} successfully` });
};

module.exports = { handleUpdateUserPersonalInformation };
