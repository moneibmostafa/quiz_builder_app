const { Op } = require('sequelize');
const BaseController = require('./baseController');
const errors = require('../errors/errors');

class QuizController extends BaseController {
  constructor(quizAdaptor, questionAdaptor, answerAdaptor) {
    super({
      adapter: quizAdaptor,
      primaryKey: 'id',
      name: 'quiz',
    });
    this.questionAdaptor = questionAdaptor;
    this.answerAdaptor = answerAdaptor;
  }

  async createQuiz(user, payload) {
    try {
      payload.userId = user.user_id;
      const quiz = await super.create(payload);
      return quiz;
    } catch (error) {
      return super.handleError(error);
    }
  }

  async getUserCreatedQuizzes(user, type) {
    try {
      if (type !== 'published' && type !== 'unpublished' && type !== 'all') {
        throw new errors.BadRequest('Invalid Type');
      }
      const filter = { userId: user.user_id, deleted: false };
      if (type === 'published') filter.published = true;
      else if (type === 'unpublished') filter.published = false;
      const quizzes = await super.list(filter);
      return quizzes;
    } catch (error) {
      return super.handleError(error);
    }
  }

  async getPublishedQuiz(quizId) {
    try {
      const quiz = await super.getOne({
        id: quizId,
        published: true,
        deleted: false,
      });
      if (!quiz) throw new errors.BadRequest('Invalid quiz');

      const response = { quiz, questions: [], answers: [] };

      const questions = await this.questionAdaptor.list({ quizId: quiz.id });
      if (questions.length === 0)
        throw new errors.BadRequest('Invalid Quiz Questions');

      for (let i = 0; i < questions.length; i += 1) {
        const attributes = ['id', 'text', 'questionId', 'quizId'];
        const answers = await this.answerAdaptor.list(
          {
            quizId: quiz.id,
            questionId: questions[i].id,
          },
          undefined,
          attributes
        );
        if (answers.length < 2 || answers.length > 5)
          throw new errors.BadRequest('Invalid Quiz Answers');

        response.questions.push(questions[i]);
        response.answers.push(answers);
      }

      return response;
    } catch (error) {
      return super.handleError(error);
    }
  }

  async getVisitorPublishedQuizzes(user) {
    try {
      const filter = {
        userId: { [Op.ne]: user.user_id },
        published: true,
        deleted: false,
      };
      const quizzes = await super.list(filter);
      return quizzes;
    } catch (error) {
      return super.handleError(error);
    }
  }

  async publishQuiz(user, quizId) {
    try {
      let quiz = await super.getOne({
        id: quizId,
        userId: user.user_id,
        deleted: false,
      });
      if (!quiz) throw new errors.BadRequest('Invalid quiz');

      let questions = await this.questionAdaptor.list({ quizId: quiz.id });
      if (questions.length < 1 || questions.length > 10)
        throw new errors.BadRequest('Invalid quiz questions');

      for (let i = 0; i < questions.length; i += 1) {
        const answers = await this.answerAdaptor.list({
          questionId: questions[i].id,
          quizId: quiz.id,
        });
        if (answers.length < 2 || answers.length > 5)
          throw new errors.BadRequest('Invalid quiz answers');
      }

      if (!quiz.published)
        quiz = await super.update(quiz.id, { published: true });
      return quiz;
    } catch (error) {
      return super.handleError(error);
    }
  }

  async deleteQuiz(user, quizId) {
    try {
      let quiz = await super.getOne({
        id: quizId,
        userId: user.user_id,
        deleted: false,
      });
      if (!quiz) throw new errors.BadRequest('Invalid quiz');

      const deletedQuiz = await super.update(quiz.id, { deleted: true });
      if (!deletedQuiz) throw new errors.ServerError('Failed to delete quiz');

      return deletedQuiz;
    } catch (error) {
      return super.handleError(error);
    }
  }
}

module.exports = QuizController;
