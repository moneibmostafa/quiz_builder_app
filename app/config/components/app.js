const joi = require('joi');

const envVarsSchema = joi
  .object({
    PORT: joi.number().required(),
    SERVER_NAME: joi.string().required(),
    TOKEN_KEY: joi.string().required(),
  })
  .unknown()
  .required();

const { error, value: envVars } = envVarsSchema.validate(process.env);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  serverName: envVars.SERVER_NAME,
  port: envVars.PORT,
  token_key: envVars.TOKEN_KEY,
};

module.exports = config;
