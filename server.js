const express = require("express");
const morgan = require("morgan");
const dbConnection = require("./database/connection");
const appRoutes = require("./routes");
require("dotenv").config();
const ApiError = require("./utils/apiErrors");
const globalError = require("./middelware/errorHandler");
const cors = require("cors");


const port = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());

dbConnection();

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
    console.log("Development Mode");
}

process.on('uncaughtException', (err) => {
    console.error(`Uncaught Exception: ${err.message}`);
    console.error(err.stack);
    console.log(`Shutting down server due to an uncaught exception...`);
    process.exit(1);
});

process.on("unhandledRejection", (err) => {
    console.error(`Unhandled Rejection: ${err.message}`);
    server.close(() => {
        console.log(`Shutting down server due to an unhandled promise rejection...`);
        process.exit(1);
    });
});

app.use(appRoutes);  // Adjust path as needed

app.all("*", (req, res, next) => {
    next(new ApiError(`Can't Find this route: ${req.originalUrl}`, 404));
});

app.use(globalError);

const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
