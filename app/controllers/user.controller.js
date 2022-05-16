const BaseController = require('./baseController');
const { signToken } = require('../middlewares/auth');
const hash = require('../hashing');
const errors = require('../errors/errors');

class UserController extends BaseController {
  constructor(userAdaptor) {
    super({
      adapter: userAdaptor,
      primaryKey: 'id',
      name: 'user',
    });
  }

  async createUser(payload) {
    try {
      let user = await super.getOne({ email: payload.email });
      if (user) throw new errors.Conflict('user already exists');
      payload.password = await hash.hash(payload.password);
      user = await super.create(payload);
      return user;
    } catch (error) {
      return super.handleError(error);
    }
  }

  async loginUser(payload) {
    try {
      let user = await super.getOne({ email: payload.email });
      if (!user) throw new errors.NotFound('Invalid credentials');
      const valid = await hash.compare(payload.password, user.password);
      if (!valid) throw new errors.NotFound('Invalid credentials');
      const token = signToken(user.id, user.email);
      return token;
    } catch (error) {
      return super.handleError(error);
    }
  }
}

module.exports = UserController;
