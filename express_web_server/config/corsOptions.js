const allowedOrigins = ['http://localhost:3500', 'https://www.google.com'];
const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by cors'));
  },
  optionSuccessStatus: 200,
};

module.exports = corsOptions;
