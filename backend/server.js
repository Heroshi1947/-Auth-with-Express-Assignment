const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const {Schema} = mongoose;
const JWT = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/comicspecials', {
  useNewUrlParser: true,
  useUnifiedTopology: true,

});

// Define a user schema and model
const userSchema = new Schema({
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
  unique: [true, 'already exists'],
},
password:{
  type : String,
  
}},{
  timestamps: true
})

const User = mongoose.model('User', userSchema);

// Create an Express app
const app = express();

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname,'..', 'public'))); // very imp 

// Parse JSON request bodies
app.use(express.json());

//password-encryption
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


// Validation middleware
const validateSignupInputs = (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ error: 'Password must be at least 6 characters long' });
  }

  next();
};

// const validateSigninInputs = (req, res, next) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({ error: 'All fields are required' });
//   }

//   next();
// };


//--------------------------------- Handle signup request---------------------------------------//

app.post('/signup',validateSignupInputs, async (req, res) => {
  const {username, email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create a new user
    const newUser = new User({ username, email, password });
    await newUser.save();

    return res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
});


app.get('/', (req,res) => {
    res.render('signup.html')
}
)
// -----------------------------------------Handle signin request-------------------------------//

app.post('/signin', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Find the user with the given email
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
  
      if (user.password !== password) {
        return res.status(401).json({ error: 'Invalid password' });
      }
  
      return res.status(200).json({ message: 'Signin successful' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Server error' });
    }
  });

// Start the server
const PORT = 3002 || process.env.PORT
app.listen(PORT, () => {
  console.log(`Server started at  http://localhost:${PORT}`);
});



// The backend code connects to your MongoDB database, defines a user schema and model, and creates an Express app.

// The `/signup` route handles the signup request. It checks if the user with the given email already exists in the database. If not, it creates a new user using the provided email and password and saves it to the database.

// The server listens on given port for incoming requests.