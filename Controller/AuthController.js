require('dotenv').config();
const prisma = require('../prisma/db');
const jwt = require('jsonwebtoken');
var md5 = require('md5');
const redisIo = require('../redis/redis');

module.exports = {

    login: async (req, res) => {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                status: false,
                message: "email and password must be provided",
            });
        }

        const user = await prisma.user.findUnique({
            where: {
              email: email,
            },
            include: {
                role: {
                    select: {
                        name: true,
                        identifier: true,
                        permissions: {
                            select: {
                                name: true,
                                identifier: true,
                            },
                        }
                    },
                },
            },
        });

        if (!user) {
            return res.status(401).json({
                status: false,
                message: "Invalid login credentials.",
            });
        }

        const validPassword = md5(password) == user.password;
        if (!validPassword) {
            return res.status(401).json({
                status: false,
                message: "Invalid login credentials.",
            });
        }

        delete user.password;
        await redisIo.set('user:role:'+user.id, JSON.stringify(user.role));

        const token = jwt.sign({id: user.id, first_name: user.first_name, last_name: user.last_name}, process.env.JWT_SECRET, { expiresIn: '30m' });
       
        return res.status(200).json({
            status: true,
            token: token,
            data: user
        });
      
    },
}
