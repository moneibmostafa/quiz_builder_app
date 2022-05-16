const express = require('express');
const { logger } = require('../logger');
const { userController } = require('../controllers');
const schemas = require('../schemas');

const { userAuthRequestSchema } = schemas.userSchema;
const router = express.Router();

router.post('/register', userAuthRequestSchema, async (req, res, next) => {
  try {
    logger.log('info', 'Processing User Register Request');
    const user = await userController.createUser(req.body);
    res.status(201).json(user);
    return next();
  } catch (err) {
    return next(err);
  }
});

router.post('/login', userAuthRequestSchema, async (req, res, next) => {
  try {
    logger.log('info', 'Processing User Login Request');
    const user = await userController.loginUser(req.body);
    res.status(200).json(user);
    return next();
  } catch (err) {
    return next(err);
  }
});

// router.get('/:id', async (req, res, next) => {
//   try {
//     logger.log('info', 'Processing User Get Request');
//     const user = await userController.getByPk(req.params.id);
//     res.status(200).json(user);
//     return next();
//   } catch (err) {
//     return next(err);
//   }
// });

module.exports = router;
