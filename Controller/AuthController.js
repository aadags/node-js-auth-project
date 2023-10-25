require('dotenv').config();
const prisma = require('../prisma/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
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
            select: {
                id: true,
                first_name: true,
                last_name: true,
            },
        });

        if (!user) {
            return res.status(403).json({
                status: false,
                message: "Invalid login credentials.",
            });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(403).json({
                status: false,
                message: "Invalid login credentials.",
            });
        }
          

        const token = jwt.sign(req.user, process.env.JWT_SECRET, { expiresIn: '30m' });
        redisIo.hSet('user:'+user.id, user);
       
        return res.status(200).json({
            status: true,
            token: token,
            data: user
        });
      
    },
}
