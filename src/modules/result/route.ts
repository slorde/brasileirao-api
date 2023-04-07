import express from 'express';
import Controller from './controller';
import auth from '../../helpers/auth';

const router = express.Router();

router.post('/:id', auth, (req, res, next) => {
    const controller = new Controller();
    return controller.create(req, res, next);
});

module.exports = router;