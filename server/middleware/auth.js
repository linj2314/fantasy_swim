import jwt from "jsonwebtoken";
const secretKey = process.env.JWT_SECRET;

const auth = (req, res, next) => {
    try {
        const token = req.headers.authorization;
        const decodedToken = jwt.verify(token, secretKey);
        req.userId = decodedToken.userId;
        next();
    } catch (error) {
        console.log(error)
        return res.status(401).json({ error: 'Authentication failed try Again' });
    }
}

export default auth;