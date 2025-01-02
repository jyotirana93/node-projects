const jwt = require('jsonwebtoken');

const handleVerifyJwt = (req, res, next) => {
  const authHeader =
    req.headers['authorization'] || req.headers['Authorization'];

  if (!authHeader) return res.sendStatus(401);

  const accessToken = authHeader.split(' ')[1];
  jwt.verify(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET_KEY,
    (err, decoded) => {
      if (err) return res.status(403).json({ error: 'Unauthorized' });

      req.username = decoded.username;
      next();
    }
  );
};

module.exports = handleVerifyJwt;
