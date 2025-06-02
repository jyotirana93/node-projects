const getImageUtils = (image) => {
  const imageBase64URL = image.replace(/^data:image\/\w+;base64,/, '');

  const imageExtension = image.match(/^data:(image\/(\w+));base64,/);

  return { imageBase64URL, imageExtension };
};

module.exports = getImageUtils;
