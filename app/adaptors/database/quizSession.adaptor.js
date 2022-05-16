const BaseAdaptor = require('./baseAdaptor');

module.exports = class QuizSessionAdaptor extends BaseAdaptor {
  constructor() {
    super({
      name: 'QuizSession',
      model: 'QuizSession',
    });
  }
};
