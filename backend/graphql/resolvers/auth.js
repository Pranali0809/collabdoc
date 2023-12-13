const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');
const cookieParser = require('cookie-parser');
const User=require('../../models/User.js');
const {app}=require('../../connections/firebaseconfig.js');
const {createUserWithEmailAndPassword}=require("firebase/auth")

const {
    getAuth
} =require("firebase/auth");

const assignCookies = (req, res) => {
    const { uid } = req;
    const token = jwt.sign({ id: uid }, process.env.JWT_SECRET);
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      })
      .status(201)
      .json({ uid });
  };

  module.exports = {

    RootQuery:{login: async (_,{ email, password }) => {
      try {
        const user = await User.findOne({ email });
      if (!user) {
        throw new Error('User Not Found');
      }
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new Error('inValid password');
      }
      const token = jwt.sign({ id: user.uid }, process.env.JWT_SECRET);
      return { userId: user.uid, token: token, tokenExpiration: 1 };

      } catch (error) {
        console.log(error);
      }
    }
  },
    RootMutation:{createUser: async (_,{ email, password },context) => {
      try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
          throw new Error('User exists already.');
        }
        const auth = getAuth(app);
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const token = jwt.sign({ id: user.uid }, process.env.JWT_SECRET);
        const hashedPassword = await bcrypt.hash(password, 12);
        const userMongoDB = new User({
          uid:user.uid,
          email,
          password: hashedPassword
        });
        context.res.cookie('authToken', token, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
        });
  
        const result = await userMongoDB.save();
        console.log(result);
        return { userId: user.uid, token: token, tokenExpiration: 1 };
      } catch (error) {
        console.log(error);
      }
    }
  }
  };