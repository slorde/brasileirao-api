import express from 'express';
import Controller from './controller';

const router = express.Router();

router.post('/', (req, res, next) => {
    const controller = new Controller();
    return controller.create(req, res, next);
});

router.get('/', (req, res, next) => {
    const controller = new Controller();
    return controller.find(req, res, next);
});

router.put('/:id/start', (req, res, next) => {
    const controller = new Controller();
    return controller.start(req, res, next);
});

router.put('/:id/end', (req, res, next) => {
    const controller = new Controller();
    return controller.end(req, res, next);
});

router.get('/leaderboard', (req, res, next) => {
    const controller = new Controller();
    return controller.leaderBoard(req, res, next);
});

module.exports = router;