import User from '../models/User.js'
import jwt from 'jsonwebtoken'

// REGISTER USER
export const registeredUser = async (req, res, next) => {
  try {
    const { name, email, password, role, avatar } = req.body

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

    const user = new User({
      name,
      email,
      password,
      role: 'user',
      avatar: avatar || '/uploads/profile/default-avatar.png',
    })

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

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    })

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

// VERIFY EMAIL FOR PASSWORD RESET
export const verifyEmail = async (req, res, next) => {
  try {
    const { email } = req.body
    const user = await User.findOne({ email })
    if (!user) {
      const error = new Error('User not found.')
      error.statusCode = 404
      throw error
    }
    res.status(200).json({ message: 'Email verified', email })
  } catch (error) {
    next(error)
  }
}

// RESET PASSWORD
export const resetPassword = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email }).select('+password')
    if (!user) {
      const error = new Error('User not found.')
      error.statusCode = 404
      throw error
    }

    user.password = password
    await user.save()

    res.status(200).json({ message: 'Password updated successfully' })
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

    const { name, email, password } = req.body
    if (name) user.name = name
    if (email) user.email = email
    if (password) user.password = password
    if (req.file) user.avatar = `/uploads/profile/${req.file.filename}`

    const updatedUser = await user.save()

    res.status(200).json({
      message: 'Profile updated successfully.',
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

// TOGGLE USER STATUS (Admin only)
export const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      const error = new Error('User not found.')
      error.statusCode = 404
      throw error
    }

    user.isActive = !user.isActive
    await user.save()

    const updatedUser = await User.findById(req.params.id).select('-password')

    res.status(200).json({
      message: `User ${updatedUser.isActive ? 'activated' : 'deactivated'}.`,
      user: updatedUser,
    })
  } catch (error) {
    next(error)
  }
}

// GET ALL USERS (Admin only)
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password')
    res.status(200).json({ users })
  } catch (error) {
    next(error)
  }
}