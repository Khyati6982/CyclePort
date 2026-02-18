import User from '../models/User.js'
import jwt from 'jsonwebtoken'

// REGISTER USER
export const registeredUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body

    if (!name || !email || !password) {
      const error = new Error('All fields are required.')
      error.statusCode = 400
      throw error
    }

    if (role === 'admin') {
      const error = new Error('Admin registration is not allowed.')
      error.statusCode = 403
      throw error
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      const error = new Error('User already registered.')
      error.statusCode = 409
      throw error
    }

    const user = new User({ name, email, password, role: 'user' })
    await user.save()
    res.status(201).json({ message: 'User registered successfully.' })
  } catch (error) {
    next(error)
  }
}

// LOGIN USER
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      const error = new Error('All fields are required.')
      error.statusCode = 400
      throw error
    }

    const user = await User.findOne({ email }).select('+password')
    if (!user) {
      const error = new Error('User not found.')
      error.statusCode = 404
      throw error
    }

    if (!user.isActive) {
      const error = new Error('Your account is inactive. Please contact support.')
      error.statusCode = 403
      throw error
    }

    const isMatch = await user.matchPassword(password)
    if (!isMatch) {
      const error = new Error('Invalid credentials.')
      error.statusCode = 401
      throw error
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' })

    res.status(200).json({
      message: 'Login successful.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        isActive: user.isActive,
      },
    })
  } catch (error) {
    next(error)
  }
}

// GET PROFILE
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password')
    if (!user) {
      const error = new Error('User not found.')
      error.statusCode = 404
      throw error
    }
    res.status(200).json({ user })
  } catch (error) {
    next(error)
  }
}

// EDIT PROFILE
export const editProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
    if (!user) {
      const error = new Error('User not found.')
      error.statusCode = 404
      throw error
    }

    const { name, email, password, avatar } = req.body
    let regenerateToken = false

    if (name) user.name = name
    if (email && email !== user.email) {
      user.email = email
      regenerateToken = true
    }
    if (password) {
      user.password = password
      regenerateToken = true
    }

    if (req.file) {
      user.avatar = `/uploads/profile/${req.file.filename}`
    } else if (avatar) {
      user.avatar = avatar
    }

    const updatedUser = await user.save()

    let token
    if (regenerateToken) {
      token = jwt.sign({ id: updatedUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' })
    }

    res.status(200).json({
      message: 'Profile updated successfully.',
      ...(token && { token }), // include token only if regenerated
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        role: updatedUser.role,
        isActive: updatedUser.isActive,
      },
    })
  } catch (error) {
    next(error)
  }
}