require('dotenv').config();

module.exports = {

    listRoles: (req, res) => {

        // const query = req.query;
        // const payload = req.body;
       
      return res.status(200).json({
          status: true
      });
      
      },
}
