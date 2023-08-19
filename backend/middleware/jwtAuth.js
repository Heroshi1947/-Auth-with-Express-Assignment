
// this middleware is used to show user data only if they are already logged in by decrypting jwt-token to get user id stored in cookies instead of accessing user-id from database. 

const JWT = require('jsonwebtoken');

const jwtAuth = (req, res, next ) => {   // next is very imp while creating middlewares as it allows to move forward from one process to another without next process wont go to next step ..
        const token = (req.cookies && req.cookies.token) || null ;

        if (!token) {
            return res.status(400).json({
                success: false,
                message: 'Not Authorized '
            })
        }

        try {
            const payload = JWT.verify(token, process.env.SECRET);
            req.user = {id: payload.id, email: payload.email};
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            })
        }
        
        next();
}

module.exports = jwtAuth; 