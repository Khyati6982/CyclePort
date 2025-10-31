import User from '../models/User.js'
import jwt from 'jsonwebtoken'

// REGISTER USER
export const registeredUser = async (req, res) => {
  try {
    const { name, email, password, role, avatar } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' })
    }

    if (role === 'admin') {
      return res.status(403).json({ message: 'Admin registration is not allowed.' })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(409).json({ message: 'User already registered.' })
    }

    const user = new User({
      name,
      email,
      password,
      role: 'user',
      avatar: avatar || '/images/default-avatar.png',
    })

    await user.save()
    return res.status(200).json({ message: 'User registered successfully.' })
  } catch (error) {
    res.status(500).json({ message: 'Server error. Please try again later.' })
  }
}

// LOGIN USER
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required.' })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: 'User not found.' })
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Your account is inactive. Please contact support.' })
    }

    const isMatch = await user.matchPassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' })
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
    res.status(500).json({ message: 'Server error. Please try again later.' })
  }
}

// VERIFY EMAIL FOR PASSWORD RESET
export const verifyEmail = async (req, res) => {
  const { email } = req.body
  try {
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    res.status(200).json({ message: 'Email verified', email })
  } catch (error) {
    res.status(500).json({ error: 'Verification failed' })
  }
}

// RESET PASSWORD
export const resetPassword = async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    user.password = password
    await user.save()

    res.status(200).json({ message: 'Password updated successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to reset password' })
  }
}

// GET PROFILE
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    if (!user) {
      return res.status(404).json({ message: 'User not found.' })
    }

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        isActive: user.isActive,
      }
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

// EDIT PROFILE
export const editProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    if (!user) {
      return res.status(404).json({ message: 'User not found.' })
    }

    const { name, email, password, avatar } = req.body

    user.name = name || user.name
    user.email = email || user.email
    if (password) user.password = password
    if (avatar) user.avatar = avatar

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
      }
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error. Please try again later.' })
  }
}

// TOGGLE USER STATUS (Admin only)
export const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found.' })
    }

    user.isActive = !user.isActive
    await user.save()

    const updatedUser = await User.findById(req.params.id).select('-password')

    res.status(200).json({
      message: `User ${updatedUser.isActive ? 'activated' : 'deactivated'}.`,
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        avatar: updatedUser.avatar,
        isActive: updatedUser.isActive,
      }
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error.' })
  }
}

// GET ALL USERS (Admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password')
    res.status(200).json({ users })
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users' })
  }
}