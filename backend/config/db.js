const mongoose = require('mongoose');

const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/pwSkillsAssignment"

const databaseConnect = () => {
    mongoose
    .connect(MONGO_URL)
    .then((conn) => console.log(`Connected to DB: ${conn.connection.host}`))
    .catch((err) => console.log(err.message))
}

module.exports = databaseConnect