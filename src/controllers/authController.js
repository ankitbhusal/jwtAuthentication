import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";

export default class AuthController {
  // add user to database
  async addUser(req, res) {
    let { name, email, password } = req.body;

    // find if email already exist in database;
    const response = await userModel.findAll({
      where: {
        email,
      },
    });

    if (response.length > 0) {
      return res.json({
        message: "Email already exist",
      });
    }

    // generate hash using bcrypt
    password = bcrypt.hashSync(password, 4);
    try {
      const user = await userModel.create({
        name,
        email,
        password,
      });
      return res.status(201).json({
        user,
      });
    } catch (err) {
      return res.status(500).json({
        error: err.message,
      });
    }
  }

  // authentication for login
  async checkLogin(req, res, next) {
    const { email, password } = req.body;

    const response = await userModel.findAll({
      where: {
        email,
      },
    });
    // return res.json(response.length);
    if (response.length > 0) {
      const hashPass = response[0].password;

      // check hash password is matched
      const match = await bcrypt.compare(password, hashPass);
      if (match) {
        // generate jwt token
        const token = jwt.sign(
          {
            user_id: response[0].id,
            email: response[0].email,
          },
          process.env.SECRET_KEY,
          {
            expiresIn: "1h",
          }
        );
        // save user token
        response.token = token;
        return res.status(200).json({
          message: "Auth successful",
          token: token,
        });
      } else {
        return res.status(400).send("Invalid Credentials ");
      }
    } else {
      return res.status(400).send("Invalid Credentials");
    }
  }
}
