const BaseController = require('./baseController');
const errors = require('../errors/errors');

class QuestionController extends BaseController {
  constructor(questionAdaptor, quizAdaptor, answerAdaptor) {
    super({
      adapter: questionAdaptor,
      primaryKey: 'id',
      name: 'question',
    });
    this.quizAdaptor = quizAdaptor;
    this.answerAdaptor = answerAdaptor;
  }

  async createQuestion(user, payload) {
    try {
      const { quizId } = payload;
      const quiz = await this.quizAdaptor.getByPk(quizId);
      if (!quiz) throw new errors.BadRequest('Invalid Quiz');

      if (quiz.deleted) throw new errors.NotFound('Quiz not found');

      if (quiz.userId !== user.user_id)
        throw new errors.Unauthorized('Quiz does not belong to user');

      if (quiz.published)
        throw new errors.BadRequest('Published Quizzes can not be editted');

      let questions = await super.list({ quizId: quiz.id });
      if (questions.length === 10)
        throw new errors.BadRequest('Invalid questions number');

      const question = await super.create(payload);
      return question;
    } catch (error) {
      return super.handleError(error);
    }
  }

  async editQuestion(user, questionId, payload) {
    try {
      const { quizId } = payload;
      const quiz = await this.quizAdaptor.getByPk(quizId);
      if (!quiz) throw new errors.BadRequest('Invalid Quiz');

      if (quiz.deleted) throw new errors.NotFound('Quiz not found');

      if (quiz.userId !== user.user_id)
        throw new errors.Unauthorized('Quiz does not belong to user');

      if (quiz.published)
        throw new errors.BadRequest('Published Quizzes can not be editted');

      const question = await super.getByPk(questionId);
      if (!question) throw new errors.BadRequest('Invalid Question');

      const update = await super.update(question.id, {
        text: payload.text,
      });
      return update;
    } catch (error) {
      return super.handleError(error);
    }
  }

  async deleteQuestion(user, questionId) {
    try {
      const question = await super.getByPk(questionId);
      if (!question) throw new errors.BadRequest('Invalid Request');

      const quiz = await this.quizAdaptor.getByPk(question.quizId);
      if (!quiz) throw new errors.NotFound('Quiz not found');

      if (quiz.deleted) throw new errors.NotFound('Quiz not found');

      if (quiz.userId !== user.user_id)
        throw new errors.Unauthorized('Quiz does not belong to user');

      if (quiz.published)
        throw new errors.BadRequest('Published Quizzes can not be editted');

      const answers = await this.answerAdaptor.list({
        questionId: question.id,
      });
      if (answers.length > 0) {
        const deletedAnswers = await this.answerAdaptor.deleteAll({
          questionId: question.id,
        });
        if (!deletedAnswers)
          throw new errors.ServerError('Something went wrong');
      }
      const response = await super.delete(questionId);
      if (!response) throw new errors.ServerError('Failed to delete question');
      return response;
    } catch (error) {
      return super.handleError(error);
    }
  }
}

module.exports = QuestionController;
