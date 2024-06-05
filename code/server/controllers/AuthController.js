const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/User.js");
const Role = require("../models/Role.js");
const { Op } = require("sequelize");
const { logConfig } = require("../middleware/logger.js");

const register = async (req, res, next) => {
  const { first_name, last_name, username, email, password, role_name } =
    cleanBody(req.body);

  // Check for missing required fields
  if (
    !first_name ||
    !last_name ||
    !username ||
    !email ||
    !password ||
    !role_name
  ) {
    const error = new Error("Missing required fields.");
    error.status = 400;
    return next(error);
  }

  // Validate email format using a regular expression
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    const error = new Error("Invalid email format.");
    error.status = 400;
    return next(error);
  }

  if (role_name === "Admin") {
    try {
      const token = req.header("Authorization").replace("Bearer ", "");
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("[Backend] Decoded:", decoded);
      const user = await User.findByPk(decoded.id, {
        include: Role,
      });
      if (user.role_name !== "Admin") {
        const error = new Error("Admin cannot be created.");
        error.status = 400;
        return next(error);
      }
    } catch (error) {
      // Handle the error (e.g., token verification failure)
      const err = new Error("Unauthorized. Only Admin can create new admin.");
      err.status = 401;
      return next(err);
    }
  }

  try {
    // Check first if the user exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ username: req.body.username }, { email: req.body.email }],
      },
    });

    if (existingUser) {
      let errorMessage;

      if (existingUser.username === req.body.username) {
        errorMessage = `User with username ${req.body.username} already exists.`;
      } else {
        errorMessage = `User with email ${req.body.email} already exists.`;
      }

      const error = new Error(errorMessage);
      error.status = 409;
      throw error;
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Get the role_id based on the provided role_name
    const role = await Role.findOne({
      where: {
        role_name,
      },
    });

    if (!role) {
      const error = new Error(`Role with name ${role_name} not found.`);
      error.status = 404;
      throw error;
    }

    const role_id = role.id;

    const newUser = await User.create({
      first_name,
      last_name,
      username,
      email,
      password: passwordHash,
      role_name,
      role_id,
    });

    // Send credentials to user email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Your CaveIS Account Credentials",
      text: `
      Dear ${first_name} ${last_name},
      
      Welcome to CaveIS! An administrator has created an account for you. Below are your login credentials:

      Username: ${username}
      Password: ${password}

      Once logged in, you can change your password in the settings page.

      Please keep this information secure and do not share it with anyone else.

      Best regards,
      The CaveIS Team
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        const error = new Error("Failed to send email to new user.");
        error.status = 500;
        throw error;
      }
    });

    logConfig.info("User successfully created in the database.");
    res.status(201).json({
      message: "Successful user registration.",
      user: newUser,
    });
  } catch (error) {
    next(error);
  }
};

let cleanBody = (body) => {
  body.first_name = body.first_name.trim();
  body.last_name = body.last_name.trim();
  body.username = body.username.trim();
  body.email = body.email.trim();
  body.password = body.password.trim();
  body.role_name =
    body.role_name.trim().charAt(0).toUpperCase() + body.role_name.slice(1);

  return body;
};

const login = async (req, res, next) => {
  const { username, password } = req.body;

  // Check for missing required fields
  if (!username || !password) {
    const error = new Error("Missing required fields.");
    error.status = 400;
    throw error;
  }

  try {
    // Check first if the user exists
    const existingUser = await User.findOne({
      where: {
        username: req.body.username,
      },
    });

    if (!existingUser) {
      const error = new Error(
        `User with username ${req.body.username} does not exist.`
      );
      error.status = 404;
      throw error;
    }

    // Compare the provided password with the stored hashed password
    const passwordMatch = await bcrypt.compare(password, existingUser.password);

    if (!passwordMatch) {
      const error = new Error(`Incorrect password.`);
      error.status = 401;
      throw error;
    }

    const accessToken = jwt.sign(
      {
        id: existingUser.id,
        username: existingUser.username,
        role_name: existingUser.role_name,
      },
      process.env.JWT_SECRET
    );

    // Set the JWT token as a cookie in the response
    res.cookie("accessToken", accessToken, {
      httpOnly: true, // Ensure cookie is only accessible through HTTP requests
      maxAge: 7 * 24 * 60 * 60 * 1000, // Set cookie to expire in 7 days
      secure: process.env.NODE_ENV === "production", // Ensure cookie is only sent over HTTPS in production
      sameSite: "strict", // Ensure cookie is only sent to the same site as the request
    });

    logConfig.info("User has successfully logged in.");
    res.status(201).json({
      message: "Successfully logged in!",
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
};
