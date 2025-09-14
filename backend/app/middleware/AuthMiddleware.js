import { TokenDecode } from "../utility/tokenUtility.js";

export default (req, res, next) => {
    let token = req.headers['token'];
    if (!token) {
        return res.status(401).json({ status: "failed", message: "Unauthorized Access: No token provided" });
    }

    let decoded = TokenDecode(token);

    if (!decoded || !decoded.email || !decoded.user_id) {
        return res.status(401).json({ status: "failed", message: "Unauthorized Access" });
    } else {
        // Add user details to headers or req.user
        req.headers.email = decoded.email;
        req.headers.user_id = decoded.user_id;
        next();
    }
}