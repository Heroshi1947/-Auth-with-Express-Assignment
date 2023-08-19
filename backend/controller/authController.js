const userModel = require('../model/user.Schema')
const emailValidator = require("email-validator")
const bcrypt = require('bcrypt');
//----------------------------
//const jwt = require('jsonwebtoken');



// signup function which will be used in .post('/signup' , signup )
const signup = async (req, res, next) => {
    const { username, email, password } = req.body;
    console.log(username, email, password);

    //validations before saving in database 
    if (!username || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "Every field is required"
        })
    }

    const validEmail = emailValidator.validate(email);
    if (!validEmail) {
        return res.status(400).json({
            success: false,
            message: "Please provide a valid Email id."
        })
    }
    try {
        const userInfo = userModel(req.body);
        const result = await userInfo.save(); // this line will directly save userinfo in database 
        return res.status(200).json({
            success: true,
            data: result
        })
    } catch (e) {
        if (e.code === 1000) {
            return res.status(400).json({
                success: false,
                message: 'This Email id already exists '
            })
        }
        return res.status(400).json({
            success: false,
            message: e.message,
        })
    }
}

// -----------------------------SIGNin function ----------------------------------------//

const signin = async (req, res) => {
    const { email, password } = req.body;

    //validations before trigerring database
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Every field is required"
        })
    }

    try {
        // check if email written by user exists or not in our database
        const user = await userModel
            .findOne({
                email
            })
            .select('+password'); // slecting a specific data from database so that we can compare it with provided password

        if (!user || !(await bcrypt.compare(password, user.password))) {  // we need to encrypt are password by bcrypt before storing in database or anyone can see password string in database
            return res.status(400).json({
                success: false,
                message: "Invalid Email or Password"
            })
        }

    // if no problem happens user will signin by below code  
        // generate token
         const token = user.jwtToken(); 
         user.password = undefined;  // hides password to avoid leakage 
       // const token = jwt.sign({ userId: user.id }, 'process.env.SECRET', { expiresIn: '24h' });
        //generate cookie 
        const cookieOption = {
            maxAge: 24 * 60 * 60 * 1000,  // 24hrs only 
            httpOnly: true  // this cookie can't be accessed from client-side
        }

        res.cookie("token", token,  cookieOption);
        res.status(200).json({
            success: true,
            data: user
        })
    }
    catch(e) {
    return res.status(400).json({
        success: false,
        message: e.message
    })
  }
    
}
    // for a signup we need steps:  email+password> verification (authController)> token generation (jwt token)> save token in cookie , this token makes it easy to process many queries once it is validated 



module.exports = { signup, signin};