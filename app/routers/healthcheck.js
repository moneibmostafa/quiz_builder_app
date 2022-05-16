const express = require('express');

const router = express.Router();

router.get('/ping', (_, res, next) => {
  res.status(200).json({ message: 'ok' }).end();
  return next();
});

module.exports = router;
