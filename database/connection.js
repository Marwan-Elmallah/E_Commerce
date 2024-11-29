const mongoose = require("mongoose");

const dbConnection = async () => {
    await mongoose.connect(process.env.DB_LOCAL_URI)
        .then((conn) => {
            console.log(`DB connected on ${conn.connection.host}`);
        }).catch((err) => console.error(`Error to connect to DB`))
}

module.exports = dbConnection