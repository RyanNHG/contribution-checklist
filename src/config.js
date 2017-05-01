try {
  require('dotenv').load()
} catch (ignore) {
  console.warn('No .env file found')
}

module.exports = {
  port: process.env.PORT || 3000,
  token: process.env.TOKEN || 'token',
  secret: process.env.SECRET || 'secret',
  commentLimit: process.env.COMMENT_LIMIT || 10
}
