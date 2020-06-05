const mongoose = require('mongoose')
const validator = require('validator')

const USERS = mongoose.model('Users',{
    name: {
        type : String ,
        required : true,
        trim : true
    },
    email: {
        type : String ,
        required : true,
        trim : true,
        lowercase : true,
        unique : true,
        validate(email){
            if(!validator.isEmail(email)){
                throw new Error('Email is Invalid')
            }
        }
    },
    password: {
        type : String ,
        required : true,
        minlength: 8,
        maxlength: 20,
        trim : true
    },
    codechef: {
        type : String ,
        required : true,
        trim : true,
        validate(codechef_user_url){
            if(!validator.isURL(codechef_user_url)){
                throw new Error('Not a valid URL')
            }
        }
    },
    education: {
        type : String,
        trim: true
    },
    date_of_birth: {
        type : Date
    },
    phone: {
        type : String,
    },
    first_login: {
        type: Date,
        default: Date.now 
    }
})

module.exports = USERS