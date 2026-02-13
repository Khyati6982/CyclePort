import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const protect = async (req, res, next) => {
  let token

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1]
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      const user = await User.findById(decoded.id).select('-password')
      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }

      req.user = user
      next()
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired. Please log in again.' })
      }
      return res.status(401).json({ message: 'Not authorized. Invalid token.' })
    }
  } else {
    return res.status(401).json({ message: 'No token provided.' })
  }
}

export default protect