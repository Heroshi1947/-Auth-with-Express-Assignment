# -Auth-with-Express-Assignment
Building a Full-Stack User Management System Similar to Instagram

“/signup” → create a signUp routes which takes {name,username,bio,email,password} as response
and hash password and then store data in database
“signupDataValidate” → create a middleware which checks if user has provided required data or not
based on that send response or move further
“/login” → create a login routes which takes {user,password} as response, generate jwt token and set to
cookie and response with success message
“loginDataValidate” → create a middleware which checks if user has provided required data or not
based on that send response or move further

”authenticateUser” → create authenticate user which verify token given by user through cache then
then proceed based on the output

FrontEnd:
SignUp Page: Create a sign up page after successful signup redirect to login page
Login Page: Build Login Page after successful Login Redirect to User Page
User Page: Create a user page which has demo image and rest of the data fetch from server by
authenticating user
