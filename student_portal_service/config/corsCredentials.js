const allowedOriginsList = require('./allowedOrigins');

const credentails = (req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOriginsList.includes(origin)) {
    res.header('Access-Control-Allow-Credentials', true);
  }
  next();
};

module.exports = credentails;
