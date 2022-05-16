const BaseAdaptor = require('./baseAdaptor');
const models = require('../../models');

module.exports = class QuizSessionQuestionAnswerAdaptor extends BaseAdaptor {
  constructor() {
    super({
      name: 'QuizSessionQuestionAnswer',
      model: 'QuizSessionQuestionAnswer',
    });
  }
};
