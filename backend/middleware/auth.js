const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        console.log(req.body);
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'SECRET_TOKEN');
        const userId = decodedToken.userId;
        req.tokenUserId = userId;
        if(req.body.UserId && req.body.UserId !== userId) {
            throw 'err middleware auth ID utilisateur incorrect !';
        } else {
            next();
        }
    } catch(error) {
        res.status(401).json({error});
    }
}