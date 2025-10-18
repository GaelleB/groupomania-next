const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'SECRET_TOKEN');
        const userId = decodedToken.userId;
        req.tokenUserId = userId;
        if(req.body.UserId && req.body.UserId !== userId) {
            throw 'err middleware auth ID utilisateur incorrect !';
        } else {
            next();
        }
    } catch(error) {
        res.status(401).json({ error: 'Token invalide ou expiré' });
    }
}