const mongoose = require('mongoose');
const Animals = mongoose.model('Animals');
const QueryUtils = require('../../utils/queryUtils');
const moment = require('moment');
const controller = {};


controller.createAnimal = async (req, res) => {
    try {
        let animal = new Animals(req.body);
        animal.createdBy = req.payload._id;
        animal.createdOn = moment().utc().valueOf();
        animal = await animal.save();
        return res.status(200).send(animal);
    } catch (err) {
        res.status(500).send('internal server error', err);
    }
}





controller.updateAnimal = async (req, res) => {
    try {
        let animalId,
            animal = {},
            updater = {};

        animalId = req.params.animalId;
        updater = req.body;
        updater.updatedOn = moment().utc().valueOf();
        animal = await Animals.findByIdAndUpdate(animalId, updater, {
            new: true
        }).lean();
        return res.status(200).send(animal);
    } catch (err) {
        res.status(500).send('internal server error', err);
    }
}




controller.getAnimal = async (req, res) => {
    try {
        let animal = {},
            animalId = {};

        animalId = req.params.animalId;
        animal = await Animals.findById(animalId).lean();
        return res.status(200).send(animal);
    } catch (err) {
        res.status(500).send('internal server error', err);
    }
}



controller.deleteAnimal = async (req, res) => {
    try {
        let animalId = {};

        animalId = req.params.animalId;
        await Animals.findByIdAndRemove(animalId).lean();
        return res.status(200).send('Animal deleted successfully');
    } catch (err) {
        res.status(500).send('internal server error', err);
    }
}




controller.getAnimals = async (req, res) => {
    try {
        let query = {},
            options = {
                sort: {
                    'createdOn': -1
                },
                select: 'name type gender adopted createdOn createdBy updatedBy updatedOn',
                lean: true
            };

        /**
         * create 
         * dynamic 
         * query
         */
        for (key in req.query) {
            if (req.query[key]) {
                if (
                    QueryUtils
                    .queryConstants
                    .requestParamsArr
                    .indexOf(key) != -1) {
                    options[key] = parseInt(req.query[key]);
                } else if (key == 'adopted') {
                    query[key] = req.query[key] == 'true';
                } else {
                    query[key] = new RegExp(req.query[key], 'i');
                }
            }
        }

        query.createdBy = req.payload._id;
        let animals = await Animals.paginate(query, options);
        return res.status(200).send(animals);
    } catch (err) {
        res.status(500).send('internal server error', err);
    }
}



controller.getAdoptionAggregated = async (req, res) => {
    try {
        let query = {};

        query = [{
            $match: {
                $and: [{
                        adopted: false
                    },
                    {
                        createdBy: mongoose.Types.ObjectId(req.payload._id)
                    }
                ]
            }
        }, {
            $group: {
                _id: '$type',
                count: {
                    '$sum': 1
                }
            }
        }]

        let animals = await Animals.aggregate(query);
        return res.status(200).send(animals);
    } catch (err) {
        res.status(500).send('internal server error', err);
    }
}


controller.getShelteredAggregated = async (req, res) => {
    try {
        let query = {};

        query = [{
            $match: {
                $and: [{
                    createdOn: {
                        $gte: moment().utc().startOf('day').subtract('day', 6).toDate(),
                        $lte: moment().utc().endOf('day').toDate()
                    }
                }, {
                    createdBy: mongoose.Types.ObjectId(req.payload._id)
                }]
            }
        }, {
            $group: {
                _id: '$type',
                count: {
                    '$sum': 1
                }
            }
        }];

        let animals = await Animals.aggregate(query);
        return res.status(200).send(animals);
    } catch (err) {
        res.status(500).send('internal server error', err);
    }
}





controller.uploadPic = async (req, res) => {
    try {
        let animalId,
            animal = {},
            updater = {};

        updater.data = {};
        animalId = req.params.animalId;
        updater.data.data = req.file.buffer;
        updater.fileName = req.file.originalname;
        updater.mimetype = req.file.mimetype;
        updater.size = req.file.size;
        if (updater.size > 1000000) {
            return responder(httpStatuses.BadRequest, "File limit size 1Mb");
        }

        animal = await Animals.findByIdAndUpdate(animalId, updater, {
            new: true
        }).lean();
        return res.status(200).send(animal);
    } catch (err) {
        res.status(500).send('internal server error', err);
    }
}

module.exports = controller;