const express = require("express");
const app = express();
const path = require("path");
const { authSequelize } = require('./config/dbConnection');
authSequelize();

// Sécurité
const dotenv = require ('dotenv');
dotenv.config();
const helmet = require('helmet');

// Protection avec Helmet (headers HTTP sécurisés)
app.use(helmet());

// Importation des routes
const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");
const commentRoutes = require("./routes/comment");

// Analyse du corps de la requête
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// CORS - Configuration sécurisée avec whitelist
const allowedOrigins = [
    process.env.FRONTEND_URL || 'http://localhost:3001',
    'http://localhost:3001',
    'http://localhost:3000'
];

app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin);
        res.setHeader("Access-Control-Allow-Credentials", "true");
    }
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    next();
});

app.use("/images", express.static(path.join(__dirname, 'images')));
app.use("/api/auth", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);

module.exports = app;