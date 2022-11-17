import jwt from "jsonwebtoken";
export default class AuthMiddleware {
  validateAuthInput(req, res, next) {
    let { name, email, password } = req.body;

    // check if all fields are filled
    if (!name || !email || !password) {
      return res.status(400).json({
        error: "Please enter all fields",
      });
    }
    // name validation
    if (name.length < 3) {
      return res.status(400).json({
        error: "Name must be at least 3 characters",
      });
    }
    // validate name for strings only
    if (!/^[a-zA-Z ]+$/.test(name)) {
      return res.status(400).json({
        error: "Name must contain only letters",
      });
    }

    // password validation
    if (password.length < 6) {
      return res.status(400).json({
        error: "Password must be at least 6 characters",
      });
    }

    // test strong password with regex
    /* if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/.test(password)) {
      return res.status(400).json({
        error:
        "Password must contain at least one uppercase letter, one lowercase letter and one number",
      });
    }
    */

    //  email validation using regex
    const emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: "Please enter a valid email",
      });
    }

    // console.log("Validation successful");

    // after all above validations, call next middleware
    next();
  }

  // jwt token verification
  verifyToken(req, res, next) {
    const token =
      req.body.token || req.query.token || req.headers["x-access-token"];
    if (!token) {
      return res.status(403).json({
        error: "No token provided",
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      req.response = decoded;
    } catch (error) {
      return res.status(401).json({
        error: "Unauthorized access",
      });
    }
    return next();
  }
}
