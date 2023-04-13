import express from 'express';
import Controller from './controller';
import auth from '../../helpers/auth';

const router = express.Router();

router.post('/:id', auth, (req, res, next) => {
    const controller = new Controller();
    return controller.create(req, res, next);
});

router.put('/:id', auth, (req, res, next) => {
    const controller = new Controller();
    return controller.update(req, res, next);
});

router.post('/migration/temp', auth, (req, res, next) => {
    const controller = new Controller();
    return controller.migration(req, res, next);
});


module.exports = router;