const joi = require('joi');

const envVarsSchema = joi
  .object({
    DB_HOST: joi.string().required(),
    DB_USER: joi.string().required(),
    DB_PASSWORD: joi.string().required(),
    DB_NAME: joi.string().required(),
    DB_PORT: joi.number().required(),
  })
  .unknown()
  .required();

const { error, value: envVars } = envVarsSchema.validate(process.env);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  host: envVars.DB_HOST,
  username: envVars.DB_USER,
  password: envVars.DB_PASSWORD,
  database: envVars.DB_NAME,
  port: envVars.DB_PORT,
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};

module.exports = config;
