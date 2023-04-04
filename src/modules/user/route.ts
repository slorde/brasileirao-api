import express from 'express';
import Controller from './controller';

const router = express.Router();

router.post('/signin', (req, res, next) => {
    const controller = new Controller();
    return controller.singin(req, res, next);
});
router.post('/', (req, res, next) => {
    const controller = new Controller();
    return controller.create(req, res, next);
});

module.exports = router;