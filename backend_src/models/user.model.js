const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      validate (email) {
        if (!validator.isEmail(email)) {
          throw new Error('Email is Invalid')
        }
      }
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      trim: true
    },
    codechef: {
      type: String,
      required: true,
      trim: true,
      validate (codechefUserUrl) {
        if (!validator.isURL(codechefUserUrl)) {
          throw new Error('Not a valid URL')
        }
      }
    },
    education: {
      type: String,
      trim: true
    },
    date_of_birth: {
      type: Date
    },
    phone: {
      type: String
    },
    first_login: {
      type: Date,
      default: Date.now
    },
    tokens: [{
      token: {
        type: String,
        required: true
      }
    }]
  }
)

userSchema.methods.generateAuthToken = async function () {
  const user = this
  const token = jwt.sign({ email: user.email }, 'Pratul1997', { expiresIn: '14d' })
  user.tokens = user.tokens.concat({ token })
  await user.save()
  return token
}

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await USER.findOne({ email })
  if (!user) {
    throw new Error('Unable to login')
  }
  const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch) {
    throw new Error('Unable to login')
  }

  return user
}

userSchema.pre('save', async function (next) {
  const user = this
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
  }

  next()
})

const USER = mongoose.model('Users', userSchema)

module.exports = USER
