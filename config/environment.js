const development = {
  name: 'development',
  db: 'tagpix-dev',
  jwt_secret_key: 'tagpix',
}

// eslint-disable-next-line no-unused-vars
const production = {
  name: 'production',
  db: process.env.TAGPIX_DB_NAME,
  jwt_secret_key: process.env.TAGPIX_JWT_SECRET_KEY,
}

// eslint-disable-next-line no-eval
export default eval(process.env.NODE_ENV ? eval(process.env.TAGPIX_ENVIRONMENT) : development)
