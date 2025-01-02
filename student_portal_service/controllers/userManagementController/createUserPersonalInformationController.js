const userPersonalInformationDB = {
  userPersonalInformation: require('../../data/userPersonalInformation.json'),
  setUserPersonalInformation(data) {
    this.userPersonalInformation = data;
  },
};

const fsPromises = require('fs').promises;
const path = require('path');
const handleCreateId = require('../../utilities/createId');

// const createNewUserId = (userId) => {
//   let newUserId;
//   if (!userId) {
//     newUserId = userPersonalInformationDB.userPersonalInformation.length + 1;
//   } else if (userPersonalInformationDB.userPersonalInformation.length === 1) {
//     newUserId = userId + 1;
//   } else if (
//     userId > userPersonalInformationDB.userPersonalInformation.length
//   ) {
//     newUserId = userId + 1;
//   }

//   return newUserId;
// };

const handleAddUserPersonalInformation = async (req, res) => {
  const { firstname, lastname, mobile, email, gender, image } = req.body;

  if (!firstname || !lastname || !mobile || !email || !gender || !image)
    return res.status(401).json({ error: 'Pls fill all input fields' });

  const isUserEmailDuplicate =
    userPersonalInformationDB.userPersonalInformation.find(
      (person) => person.email === email
    );

  if (isUserEmailDuplicate)
    return res.status(409).json({ error: 'Email id already present' });

  try {
    const newUserId = handleCreateId(
      userPersonalInformationDB.userPersonalInformation
    );
    const imageParts = image.split(',');
    const imageExtension = imageParts[0]
      .split(':')[1]
      .split(';')[0]
      .split('/')[1];
    const base64Parts = image.split(`${imageParts[0]},`)[1];
    console.log(imageParts[0]);

    const buffer = Buffer.from(base64Parts, 'base64');
    let imageName;

    if (imageExtension === 'png') {
      imageName = firstname + newUserId + '.png';
    } else if (imageExtension === 'jpeg') {
      imageName = firstname + newUserId + '.jpeg';
    } else if (imageExtension === 'jpg') {
      imageName = firstname + newUserId + '.jpg';
    }

    const imageFilePath = path.join(
      __dirname,
      '..',
      '..',
      'public',
      'images',
      imageName
    );

    await fsPromises.writeFile(imageFilePath, buffer);

    const newUserPersonalData = {
      userId: newUserId,
      dateCreated: new Date().toISOString(),
      firstname,
      lastname,
      mobile,
      email,
      gender,
      image: `/images/${imageName}`,
    };
    const remainingUsersPersonalData =
      userPersonalInformationDB.userPersonalInformation;

    userPersonalInformationDB.setUserPersonalInformation([
      ...remainingUsersPersonalData,
      newUserPersonalData,
    ]);

    await fsPromises.writeFile(
      path.join(__dirname, '..', '..', 'data', 'userPersonalInformation.json'),
      JSON.stringify(userPersonalInformationDB.userPersonalInformation)
    );
    res.status(201).json({ message: `User ${firstname} added successfully` });
  } catch (error) {
    console.log(error);
    res.json({ error: error });
  }
};

module.exports = { handleAddUserPersonalInformation };
