import jwt from 'jsonwebtoken';

export default (req:any, res: any, next: Function) => {
    const token = req.headers['x-access-token'];

    if (!token) return res.status(401).send('Access denied. No token provided.');

    try {
        const decoded = jwt.verify(token, process.env.PRIVATE_KEY||'');
        req.user = decoded;
    } catch (ex) {
        res.status(400).send('Invalid token.');
    }

    return next();
};