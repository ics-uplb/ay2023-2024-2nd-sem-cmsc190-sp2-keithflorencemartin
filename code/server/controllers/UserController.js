const bcrypt = require("bcrypt");
const User = require("../models/User.js");
const { Op } = require("sequelize");
const { logConfig } = require("../middleware/logger.js");

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll();
    if (!users || users.length === 0) {
      //Handle empty result
      logConfig.info("No users found in the database.");
      res.status(204).json(users);
    } else {
      logConfig.info("Retrieved all users from the database.");
      res.status(200).json(users);
    }
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!user || user.length === 0) {
      const error = new Error(`User with ID ${req.params.id} not found.`);
      error.status = 404;
      throw error;
    }
    logConfig.info(
      `Retrieved user with ID ${req.params.id} from the database.`
    );
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  const { first_name, last_name, username } = req.body;

  try {
    if (req.query.role_name === "Researcher") {
      if (req.params.id !== req.user.id) {
        const error = new Error(`Cannot update another user's profile.`);
        error.status = 403;
        throw error;
      }
    }

    // Check first if the user exists
    const user = await User.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!user) {
      const error = new Error(`User with ID ${req.params.id} not found.`);
      error.status = 404;
      throw error;
    }

    // Check if the new username already exists in the database
    if (username) {
      const existingUser = await User.findOne({
        where: {
          username: username,
          id: { [Op.not]: req.params.id }, // Exclude the current user from the check
        },
      });

      if (existingUser) {
        const error = new Error(
          `Username ${username} already exists. Please choose a different one.`
        );
        error.status = 400;
        throw error;
      }
    }

    // Perform update if user is found
    if (first_name || last_name || username) {
      await User.update(req.body, {
        where: {
          id: req.params.id,
        },
      });

      const updatedUser = await User.findByPk(req.params.id);

      if (!updatedUser) {
        const error = new Error(
          `User with ID ${req.params.id} not found after update.`
        );
        error.status = 404;
        throw error;
      }

      logConfig.info(`User with ID ${req.params.id} updated in the database.`);
      res.status(200).json(updatedUser);
    } else {
      const error = new Error("No data provided for update.");
      error.status = 400;
      throw error;
    }
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    // Check first if the user exists
    const user = await User.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!user) {
      const error = new Error(
        `User with ID ${req.params.id} not found. Cannot delete.`
      );
      error.status = 404;
      throw error;
    }

    await User.destroy({
      where: {
        id: req.params.id,
      },
    });

    logConfig.info(`User with ID ${req.params.id} deleted from the database.`);
    res.status(200).json({
      message: "User successfully deleted.",
    });
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  const { new_password, current_password } = req.body;

  try {
    // Check first if the user exists
    const user = await User.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!user) {
      const error = new Error(
        `User with ID ${req.params.id} not found. Cannot delete.`
      );
      error.status = 404;
      throw error;
    }

    const passwordMatch = await bcrypt.compare(current_password, user.password);

    if (!passwordMatch) {
      const error = new Error("Current password is incorrect.");
      error.status = 400;
      throw error;
    }

    const saltRounds = 10;
    const newPasswordHash = await bcrypt.hash(new_password, saltRounds);

    await User.update(
      { password: newPasswordHash },
      {
        where: {
          id: req.params.id,
        },
      }
    );

    logConfig.info(`Password updated for user with ID ${req.params.id}.`);
    res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  changePassword,
};
