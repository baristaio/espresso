
const jwt = require('jsonwebtoken');

const verifyJWTToken = token => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if (err || !decodedToken) {
                return reject(err);
            }
            return resolve(decodedToken);
        });
    });
};
module.exports = {
    verifyJWTToken
};
