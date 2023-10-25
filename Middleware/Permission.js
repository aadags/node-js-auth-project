
const redisIo = require('../redis/redis');

const requireRole = (role) => {
    return async function (req, res, next) {
        const JO = await redisIo.get('user:role:'+req.user.id);
        const userRole = JSON.parse(JO);
        let permissions =  userRole.permissions.map(a => a.identifier);

        if (permissions && permissions.includes(role)) {
            next();
        } else {
            res.status(403).json({
                status: false,
                message: "You are no permitted to access this route.",
            });
        }
    }
}

module.exports = requireRole