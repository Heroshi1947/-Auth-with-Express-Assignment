
// as we are using Mongo we need to specify how our document looks like so we need to make a schema. 

const mongoose = require('mongoose');
const {Schema} = mongoose;
const JWT = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema =new Schema({
    username:{
        type : String,
        require: [true, 'user name is required'],
        minlength :[5,'Name must be atleast 5 characters'],
        maxlength :[20,'Name must have less than 20 characters' ]
    },
    email:{
        type : String,
        require: [true, 'user email is required'],
        unique: true,
        lowercase:true,
        unique: [true, 'already rxists'],
    },
    password:{
        type : String,
        select :false 
    },
    forgotPasswordToken: {
        type : String,
        
    },
    forPasswordExpiryDate: {
        type : Date ,

    }
    }, {
        timestamps: true
    });

// password encryption - dont save password directly , encrypt it before saving in database by using mongoose+ bcrypt
userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    return next();
})

// method to generate JWT-token provided by mongoose
userSchema.methods = {
    jwtToken(){
        return JWT.sign(
            {id: this._id , email: this.email},
            process.env.SECRET,
            {expiresIn: '24h'}
        )
    }
}


// for mongoose.model (the database) 'user' is database collection which will come in database in userSchema format 
const userModel = mongoose.model('user', userSchema);  

module.exports = userModel;