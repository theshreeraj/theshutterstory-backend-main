import User from "../models/UserSchema.js";
import Photographer from "../models/PhotographerSchema.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "15d",
    }
  );
};

export const register = async (req, res) => {
  const { email, password, name, role, photo, gender } = req.body;

  try {
    let user = null;

    if (role == "customer") {
      user = await User.findOne({ email });
    } else if (role == "photographer") {
      user = await Photographer.findOne({ email });
    }

    // check if user exists
    if (user) {
      return res.status(400).json("User already exists");
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    if (role == "customer") {
      user = new User({
        name,
        email,
        password: hashPassword,
        photo,
        gender,
        role,
      });
    }
    if (role == "photographer") {
      user = new Photographer({
        name,
        email,
        password: hashPassword,
        photo,
        gender,
        role,
      });
    }

    await user.save();

    res
      .status(200)
      .json({ success: true, message: "User created successfully" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Internal server error, Try again" });
  }
};

export const login = async (req, res) => {
  const { email, password: userPassword } = req.body;
  try {
    let user = null;

    const customer = await User.findOne({ email });
    const photographer = await Photographer.findOne({ email });

    if (customer) {
      user = customer;
    }
    if (photographer) {
      user = photographer;
    }

    // check if user exist or not
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // compare password
    const isPasswordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isPasswordMatch) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid credential" });
    }

    // get token
    const token = generateToken(user);

    const { password, role, appointment, ...rest } = user._doc;

    res.status(200).json({
      status: true,
      message: "Sucessfully Login",
      token,
      data: { ...rest },
      role,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Internal server error, Try again" });
  }
};
