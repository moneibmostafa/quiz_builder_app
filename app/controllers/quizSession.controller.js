const { uuid } = require('uuidv4');
const BaseController = require('./baseController');
const errors = require('../errors/errors');

class QuizSessionController extends BaseController {
  constructor(
    quizSessionAdaptor,
    userAdaptor,
    quizAdaptor,
    questionAdaptor,
    answerAdaptor,
    quizSessionQuestionAnswerAdaptor
  ) {
    super({
      adapter: quizSessionAdaptor,
      primaryKey: 'id',
      name: 'quizSession',
    });
    this.userAdaptor = userAdaptor;
    this.quizAdaptor = quizAdaptor;
    this.questionAdaptor = questionAdaptor;
    this.answerAdaptor = answerAdaptor;
    this.quizSessionQuestionAnswerAdaptor = quizSessionQuestionAnswerAdaptor;
  }

  async startQuizSession(user, quizId) {
    try {
      const initiatedQuiz = await super.list({
        userId: user.user_id,
        quizId,
      });
      if (initiatedQuiz.length > 0)
        throw new errors.BadRequest('Quiz Session has already been initiated');

      const quiz = await this.quizAdaptor.getByPk(quizId);
      if (!quiz) throw new errors.BadRequest('Invalid Quiz');

      if (quiz.deleted) throw new errors.NotFound('Quiz not found');

      if (user.user_id === quiz.userId)
        throw new errors.Forbidden('Can not take own quiz');

      if (!quiz.published)
        throw new errors.BadRequest('Can not initiate unpublished quiz');

      const quizSessionObj = {
        quizOwnerId: quiz.userId,
        userId: user.user_id,
        quizId: quiz.id,
      };
      const quizSession = await super.create(quizSessionObj);
      if (!quizSession)
        throw new errors.ServerError('Failed to create Quiz Session');
    } catch (error) {
      return super.handleError(error);
    }
  }

  async getOpenedSessions(user) {
    try {
      const quizSessions = await super.list({ userId: user.user_id });
      if (!quizSessions || quizSessions.length === 0)
        throw new errors.NotFound('No Opened Quiz Sessions found');

      return quizSessions;
    } catch (error) {
      return super.handleError(error);
    }
  }

  async submitQuizAnswers(user, payload) {
    try {
      const { quizSessionId } = payload;
      const quizSession = await super.getOne({
        id: quizSessionId,
        userId: user.user_id,
      });
      if (!quizSession)
        throw new errors.BadRequest('No Quiz Session has been opened');

      const submittedAnswers = await this.quizSessionQuestionAnswerAdaptor.list(
        { quizSessionId: quizSession.id }
      );
      if (submittedAnswers && submittedAnswers.length > 0)
        throw new errors.BadRequest('Quiz has already been submitted');

      const quizQuestions = await this.questionAdaptor.list({
        quizId: quizSession.quizId,
      });
      if (!quizQuestions || quizQuestions.length === 0)
        throw new errors.NotFound('No Questions found');

      const { questions } = payload;
      const quizSessionQuestionAnswer = [];

      if (quizQuestions.length !== questions.length)
        throw new errors.BadRequest('Invalid Questions Submittion');

      for (let i = 0; i < quizQuestions.length; i += 1) {
        let questionFound = questions.find(
          (element) => element.questionId === quizQuestions[i].id
        );
        if (!questionFound)
          throw new errors.BadRequest('Missing Question Answer');

        if (questionFound.answers.length === 0) {
          const element = {
            id: uuid(),
            quizSessionId: quizSession.id,
            questionId: questionFound.questionId,
            answerId: null,
            score: 0,
            correct: false,
            solvedsoln: 'skipped',
          };
          quizSessionQuestionAnswer.push(element);
        } else {
          if (
            !quizQuestions[i].multipleAnswer &&
            questionFound.answers.length > 1
          )
            throw new errors.BadRequest(
              'Single Question with multiple provided answers'
            );

          const answersSet = new Set();
          for (let j = 0; j < questionFound.answers.length; j += 1) {
            answersSet.add(questionFound.answers[j]);
            const answer = await this.answerAdaptor.getOne({
              questionId: questionFound.questionId,
              id: questionFound.answers[j],
            });
            if (!answer) throw new errors.NotFound('Invalid Answer request');
            const score = answer.correct ? answer.weight : answer.weight * -1;
            const element = {
              id: uuid(),
              quizSessionId: quizSession.id,
              questionId: questionFound.questionId,
              answerId: questionFound.answers[j],
              score,
              correct: answer.correct,
              solvedSoln: answer.text,
            };
            quizSessionQuestionAnswer.push(element);
          }
          if (answersSet.size !== questionFound.answers.length)
            throw new errors.BadRequest('Duplicate answers values');
        }
      }
      const createdQuizSessionQuestionAnswers =
        await this.quizSessionQuestionAnswerAdaptor.bulkCreate(
          quizSessionQuestionAnswer
        );
      if (
        !createdQuizSessionQuestionAnswers ||
        createdQuizSessionQuestionAnswers.length === 0
      )
        throw new errors.ServerError('Failed to create Quiz Answers');

      return true;
    } catch (error) {
      return super.handleError(error);
    }
  }

  async getQuizStatsSolver(user, quizSessionId) {
    try {
      const quizSession = await super.getByPk(quizSessionId);
      if (!quizSession) throw new errors.NotFound('Quiz Session not found');

      if (user.user_id !== quizSession.userId)
        throw new errors.Unauthorized('Unauthorized request');

      const quizAnswers = await this.quizSessionQuestionAnswerAdaptor.list(
        {
          quizSessionId,
        },
        'Question'
      );
      if (!quizAnswers || quizAnswers.length === 0)
        throw new errors.BadRequest('Invalid Quiz Session');

      let totalScore = 0;
      const response = { quizSession, questions: {} };

      for (let i = 0; i < quizAnswers.length; i += 1) {
        const question = response.questions[quizAnswers[i].questionId];
        if (question) {
          question.score += quizAnswers[i].score;
          response.questions[quizAnswers[i].questionId] = question;
        } else {
          const mapElement = {
            title: quizAnswers[i].question.text,
            score: quizAnswers[i].score,
          };
          response.questions[quizAnswers[i].questionId] = mapElement;
        }
        totalScore += quizAnswers[i].score;
      }
      totalScore = (totalScore / Object.keys(response.questions).length) * 100;
      response.totalScore = totalScore;
      return response;
    } catch (error) {
      return super.handleError(error);
    }
  }

  async getSolverSolutions(user, quizSessionId) {
    try {
      const quizSession = await super.getOne({
        id: quizSessionId,
        userId: user.user_id,
      });
      if (!quizSession) throw new errors.NotFound('Invalid Quiz Session');

      const quizAnswers = await this.quizSessionQuestionAnswerAdaptor.list(
        {
          quizSessionId: quizSession.id,
        },
        'Question'
      );
      if (!quizAnswers || quizAnswers.length === 0)
        throw new errors.NotFound('Answers not found');

      const questions = {};
      for (let i = 0; i < quizAnswers.length; i += 1) {
        const question = questions[quizAnswers[i].questionId];
        if (question) {
          if (quizAnswers[i].solvedSoln)
            question.answers.push(quizAnswers[i].solvedSoln);
        } else {
          questions[quizAnswers[i].questionId] = {
            title: quizAnswers[i].question.text,
            answers: quizAnswers[i].solvedSoln
              ? [quizAnswers[i].solvedSoln]
              : [],
          };
        }
      }

      const response = { quizSession, questions };
      return response;
    } catch (error) {
      return super.handleError(error);
    }
  }

  async getUserQuizSolutions(user, quizSessionId) {
    try {
      const quizSession = await super.getOne({
        id: quizSessionId,
        quizOwnerId: user.user_id,
      });
      if (!quizSession) throw new errors.NotFound('Invalid Quiz Session');

      const quizAnswers = await this.quizSessionQuestionAnswerAdaptor.list(
        {
          quizSessionId: quizSession.id,
        },
        'Question'
      );
      if (!quizAnswers || quizAnswers.length === 0)
        throw new errors.NotFound('Answers not found');

      const questions = {};
      let totalScore = 0;
      for (let i = 0; i < quizAnswers.length; i += 1) {
        const question = questions[quizAnswers[i].questionId];
        if (question) {
          question.score += quizAnswers[i].score;
          if (quizAnswers[i].solvedSoln)
            question.answers.push(quizAnswers[i].solvedSoln);
        } else {
          questions[quizAnswers[i].questionId] = {
            title: quizAnswers[i].question.text,
            score: quizAnswers[i].score,
            answers: quizAnswers[i].solvedSoln
              ? [quizAnswers[i].solvedSoln]
              : [],
          };
        }
        totalScore += quizAnswers[i].score;
      }

      const response = { quizSession, questions };
      totalScore = (totalScore / Object.keys(response.questions).length) * 100;
      response.totalScore = totalScore;

      return response;
    } catch (error) {
      return super.handleError(error);
    }
  }

  async getSpecificQuizOpenSessions(user, quizId, page, limit) {
    try {
      page = parseInt(page);
      limit = parseInt(limit);
      if (isNaN(limit) || isNaN(page) || limit === 0)
        throw new errors.BadRequest('Invalid Limitations');
      const limits = { offset: page * limit, limit };
      const quizSessions = await super.list(
        {
          quizOwnerId: user.user_id,
          quizId,
        },
        undefined,
        undefined,
        limits
      );
      if (!quizSessions || quizSessions.length === 0)
        throw new errors.NotFound('No Opened Quiz Sessions found');

      return quizSessions;
    } catch (error) {
      return super.handleError(error);
    }
  }
}

module.exports = QuizSessionController;
