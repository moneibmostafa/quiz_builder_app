const express = require('express');
const bodyparser = require('body-parser');
const middlewares = require('../middlewares');

const healthCheckRouter = require('../routers/healthcheck');
const authRouter = require('../routers/auth');
const quizRouter = require('../routers/quiz');
const questionRouter = require('../routers/question');
const answersRouter = require('../routers/answers');
const quizSessionRouter = require('../routers/quizSession');

const app = express();

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

app.use(`/api/healthcheck`, healthCheckRouter);
app.use(`/api/auth`, authRouter);
app.use(middlewares.auth.verifyToken);
app.use(`/api/quiz`, quizRouter);
app.use(`/api/question`, questionRouter);
app.use(`/api/answers`, answersRouter);
app.use(`/api/quizSession`, quizSessionRouter);

app.use(middlewares.errorHandler);

module.exports = app;
