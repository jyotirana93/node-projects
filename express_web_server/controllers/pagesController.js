const path = require('path');

const getRootIndexHtmlPage = async (req, res) => {
  try {
    const filePath = path.join(
      __dirname,
      '..',
      'public',
      'views',
      'index.html'
    );

    res.status(200).sendFile(filePath);
  } catch (error) {
    console.log(error);
    res.status(500).send('Something went wrong');
  }
};

const getSubdirIndexHtmlPage = async (req, res) => {
  try {
    const filePath = path.join(
      __dirname,
      '..',
      'public',
      'views',
      'subdir',
      'index.html'
    );
    res.sendFile(filePath);
  } catch (error) {
    console.log(error);
    res.status(500).send('Something went wrong');
  }
};

const getNewPage = (req, res) => {
  try {
    const filePath = path.join(
      __dirname,
      '..',
      'public',
      'views',
      'new-page.html'
    );
    res.sendFile(filePath);
  } catch (error) {
    console.log(error);
    res.status(500).send('Something went wrong');
  }
};

const getNewPageRedirectOnOldPage = (req, res) => {
  try {
    res.redirect(301, '/new-page.html');
  } catch (error) {
    console.log(error);
    res.status(500).send('Something went wrong');
  }
};

module.exports = {
  getRootIndexHtmlPage,
  getSubdirIndexHtmlPage,
  getNewPage,
  getNewPageRedirectOnOldPage,
};
