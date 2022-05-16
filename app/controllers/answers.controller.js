const { uuid } = require('uuidv4');
const BaseController = require('./baseController');
const errors = require('../errors/errors');

class AnswersController extends BaseController {
  constructor(answersAdaptor, quizAdaptor, questionAdaptor) {
    super({
      adapter: answersAdaptor,
      primaryKey: 'id',
      name: 'answer',
    });
    this.questionAdaptor = questionAdaptor;
    this.quizAdaptor = quizAdaptor;
  }

  async addAnswers(user, questionId, payload) {
    try {
      const question = await this.questionAdaptor.getByPk(questionId);
      if (!question) throw new errors.BadRequest('Invalid Question');

      const quiz = await this.quizAdaptor.getByPk(question.quizId);
      if (!quiz) throw new errors.BadRequest('Invalid Quiz');

      if (quiz.deleted) throw new errors.NotFound('Quiz not found');

      if (quiz.userId !== user.user_id)
        throw new errors.Unauthorized('Quiz does not belong to user');

      if (quiz.published)
        throw new errors.BadRequest('Published Quizzes can not be editted');

      let correctAnswersCount = 0;
      const duplicateSet = new Set();
      payload.forEach((element) => {
        correctAnswersCount += element.correct;
        element.text = element.text.trim();
        if (duplicateSet.has(element.text))
          throw new errors.BadRequest('Duplicate Answers');
        duplicateSet.add(element.text);
        element.quizId = quiz.id;
        element.questionId = question.id;
        element.id = uuid();
      });

      if (correctAnswersCount < 1 || correctAnswersCount >= payload.length)
        throw new errors.BadRequest('Invalid correct answers');

      if (
        (question.multipleAnswer && correctAnswersCount < 2) ||
        (!question.multipleAnswer && correctAnswersCount > 1)
      )
        throw new errors.BadRequest('Invalid answers type');

      const wrongAnswersCount = payload.length - correctAnswersCount;
      payload.forEach((element) => {
        if (element.correct) element.weight = 1 / correctAnswersCount;
        else element.weight = 1 / wrongAnswersCount;
      });

      const prevAnswers = await super.list({ questionId: question.id });
      if (prevAnswers.length > 0) {
        await this.adapter.deleteAll({ questionId: question.id });
      }

      const answers = await this.adapter.bulkCreate(payload);
      if (!answers || answers.length === 0)
        throw new errors.ServerError('Failed to create Question Answers');

      const response = { question, answers };
      return response;
    } catch (error) {
      return super.handleError(error);
    }
  }
}

module.exports = AnswersController;
