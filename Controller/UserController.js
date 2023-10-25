require('dotenv').config();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {

    listUsers: async (req, res) => {

        const currentPage = req.query.page || 1;
        const listPerPage = parseInt(req.query.count) || 10;
        const offset = (currentPage - 1) * listPerPage;

        const allUsers = await prisma.user.findMany({
            skip: offset,
            take: listPerPage, //todo include a where and orderby for filter
        });

       
        return res.status(200).json({
            status: true,
            data: allUsers,
            meta: { page: currentPage, lastPage: (allUsers.length < listPerPage)? true : false },
        });
      
    },

    createUser: async (req, res) => {

        const payload = req.body;

    },
}
