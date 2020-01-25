const Util = require('../services/Util');
const { User } = require('../models');
const bcrypt = require('bcrypt');
const saltRounds = 10;

require('dotenv-safe').config()
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

// bcrypt.genSalt(saltRounds, function(err, salt) {
//     bcrypt.hash(myPlaintextPassword, salt, function(err, hash) {
//         console.log(hash);

//     });
// });

module.exports = {
    async login(req, res) {
        let { user, password } = req.body, action = 'LOGIN';

        try {
            const query = await User.findOne({
                where: {
                    [Op.or]: [{ user }, { email: user }]
                },
                attributes: ['id', 'name', 'password']
            });

            if (query) {
                const { id, name } = query, hash = query.password;

                const isValid = await bcrypt.compareSync(password, hash);

                if (isValid) {
                    const token = jwt.sign({ id }, process.env.SECRET, {
                        //expiresIn: "12h"
                    })

                    Util.saveLogInfo(action, id)
                    res.status(200).send(
                        { 
                            status: true, 
                            response: {token, id, name}, 
                            code: 10 
                        })
                }
                else {
                    res.status(200).send(
                        {
                            status: false,
                            response: 'invalid password',
                            code: 12
                        }
                    );
                    Util.saveLogInfo(`${action} INVALID PASSWORD`, id);
                }

            }
            else {
                res.status(200).send(
                    {
                        status: false,
                        response: 'invalid user/email',
                        code: 11
                    });
            }

        }
        catch (error) {
            const err = error.stack || error.errors || error.message || error;
            Util.saveLogError(action, err)
            res.status(500).send({ status: false, response: err })
        }
    }
}