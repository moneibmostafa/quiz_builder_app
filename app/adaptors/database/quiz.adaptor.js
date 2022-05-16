const BaseAdaptor = require('./baseAdaptor');

module.exports = class QuizAdaptor extends BaseAdaptor {
  constructor() {
    super({
      name: 'Quiz',
      model: 'Quiz',
    });
  }
};
