const animals = require('./controller');
const auth = require('../../utils/auth');
const multer = require('multer');
const ANIMALS = '/animals';
const AGGREGATED = '/aggregated';
const ANIMALID = '/:animalId';
const UPLOAD = '/upload';
const SHELTER = '/shelter';
const ADOPTED = '/adoption';

module.exports = router => {
    /**
     * create an
     * animal
     */
    router.post(ANIMALS, auth.required, animals.createAnimal);

    /**
     * get all 
     * animals
     */
    router.get(ANIMALS, auth.required, animals.getAnimals);


    /**
     * get an 
     * animal
     */
    router.get(ANIMALS + ANIMALID, auth.required, animals.getAnimal);


    /**
     * update an animal
     */
    router.put(ANIMALS + ANIMALID, auth.required, animals.updateAnimal);


    /**
     * delete 
     * an animal
     */
    router.delete(ANIMALS + ANIMALID, auth.required, animals.deleteAnimal);


    /**
     * get aggregated 
     * animlas for adoption
     */
    router.get(ANIMALS + AGGREGATED + ADOPTED, auth.required, animals.getAdoptionAggregated);


     /**
     * get aggregated 
     * animlas for shelter
     */
    router.get(ANIMALS + AGGREGATED + SHELTER, auth.required, animals.getShelteredAggregated);


     /**
     * upload 
     * a pic 
     * of an 
     * animal
     */
    router.post(ANIMALS + ANIMALID + UPLOAD, auth.required, multer({
        limits: '1mb'
    }).single('data'), animals.uploadPic);



}