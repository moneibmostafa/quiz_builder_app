const BaseAdaptor = require('./baseAdaptor');

module.exports = class QuestionAdaptor extends BaseAdaptor {
  constructor() {
    super({
      name: 'Question',
      model: 'Question',
    });
  }
};
