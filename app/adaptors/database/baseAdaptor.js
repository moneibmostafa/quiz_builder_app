const { logger } = require('../../logger');
const models = require('../../models');

module.exports = class BaseAdaptor {
  constructor({ name, model }) {
    this.name = name;
    this.model = models[model];
  }

  async create(payload, transaction = undefined) {
    let response;
    if (transaction) response = await this.model.create(payload, transaction);
    else response = await this.model.create(payload);
    logger.log('info', `Successfully created ${this.name} in database`);
    return response;
  }

  async bulkCreate(payload) {
    const response = await this.model.bulkCreate(payload);
    logger.log('info', `Successfully created ${this.name} records in database`);
    return response;
  }

  async getByPk(pk) {
    const response = await this.model.findByPk(pk);
    logger.log('info', `Successfully get ${this.name} from database`);
    return response;
  }

  async getOne(filter = {}) {
    const response = await this.model.findOne({ where: filter });
    logger.log('info', `Successfully get ${this.name}/s from database`);
    return response;
  }

  async createIfNotFound(filter = {}, payload = {}) {
    const [response, created] = await this.model.findOrCreate({
      where: filter,
      defaults: payload,
    });
    const action = created ? 'created' : 'get';
    logger.log('info', `Successfully ${action} ${this.name}`);
    return response;
  }

  async list(
    filter = {},
    model = undefined,
    attributes = undefined,
    limits = { limit: undefined, offset: undefined }
  ) {
    let response;
    if (model) {
      response = await this.model.findAll({
        where: filter,
        include: [{ model: models[model] }],
      });
    } else if (attributes && attributes.length !== 0) {
      response = await this.model.findAll({
        where: filter,
        attributes,
      });
    } else if (limits) {
      response = await this.model.findAll({
        where: filter,
        limit: limits.limit,
        offset: limits.offset,
      });
    } else response = await this.model.findAll({ where: filter });
    logger.log('info', `Successfully get ${this.name}s from database`);
    return response;
  }

  async update(id, payload) {
    const response = await this.model.update(payload, {
      where: { id: id },
    });
    logger.log('info', `Successfully updated ${this.name}/s in database`);
    return response;
  }

  async delete(id, transaction = undefined) {
    let response;
    if (transaction)
      response = await this.model.destroy(
        {
          where: {
            id,
          },
        },
        transaction
      );
    else
      response = await this.model.destroy({
        where: {
          id,
        },
      });
    logger.log(
      'info',
      `Successfully deleted ${this.name}/s record in database`
    );
    return response;
  }

  async deleteAll(filter) {
    const response = await this.model.destroy({
      where: filter,
    });
    logger.log(
      'info',
      `Successfully deleted ${this.name}/s records in database`
    );
    return response;
  }
};
