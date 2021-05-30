const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    branchName: {
        type: String,
        required: true,
        trim: true,
    },
    branchIncharge: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5
    },
    tokens: [{
        token: {
            type: String,
            required:true
        }
    }],
    created_date:{
        type: Date,
        default:Date.now()
    }
})

UserSchema.statics.findByCredential = async (branchName, password) => {
    const user = await User.findOne({ branchName: branchName });
    if (!user) {
        throw new Error('user not registered');
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error('password incorrect');
    }

    return user;
}

//methods are accessiable on model instance
UserSchema.methods.generateAuthToken = async function () {
    const user = this;
    console.log(user);
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
    console.log(token);
    user.tokens=user.tokens.concat({token});
    await user.save();
    
    return token;
}

UserSchema.methods.toJSON= function(){
    const user=this;
    const userObject=user.toObject();

    delete userObject.password;
    delete userObject.tokens;
    return userObject;
}

//shouldnot use arrow funtion for need "this" inside the func
UserSchema.pre('save', async function (next) {
    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
})


const User = mongoose.model('User', UserSchema)

module.exports = User;

