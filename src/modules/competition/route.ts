import express from 'express';
import Controller from './controller';
import auth from '../../helpers/auth';

const router = express.Router();

router.post('/', auth, (req, res, next) => {
    const controller = new Controller();
    return controller.create(req, res, next);
});

router.get('/', auth, (req, res, next) => {
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

router.get('/leaderboard', auth, (req, res, next) => {
    const controller = new Controller();
    return controller.leaderBoard(req, res, next);
});

router.get('/:id/my', auth, (req, res, next) => {
    const controller = new Controller();
    return controller.findUser(req, res, next);
});


module.exports = router;