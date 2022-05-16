const BaseAdaptor = require('./baseAdaptor');
const database = require('../../database');

module.exports = class AnswersAdaptor extends BaseAdaptor {
  constructor() {
    super({
      name: 'Answer',
      model: 'Answer',
    });
  }
};
