export default {
  jwt: {
    secret: process.env.JWT_SECRET || 'potato',
    expiresIn: '08h'
  }
}