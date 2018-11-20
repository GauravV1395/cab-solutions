const { ObjectId } = require('mongodb');

const validateID = function (req, res, next) {
    let id = req.params.id;
    if(!ObjectId.isValid(id)) {
        res.send({
            notice: 'Invalid ID'
        });
    } else {
        next();
    }
}

module.exports = {
    validateID
}