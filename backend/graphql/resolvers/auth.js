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

    RootMutation:{
     
      createUser: async (_,{ email, password },context) => {
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
          // console.log(context.res)
          context.res.cookie('authToken', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
            secure: true,
            sameSite: 'None'
          }).status(201);
          console.log(context.req.headers.cookie);
          const result = await userMongoDB.save();
          // console.log(result);
          return { userId: user.uid, token: token, tokenExpiration: 1 };
        } catch (error) {
          console.log(error);
        }
      },
  },
  RootQuery:{
    login: async (_,{ email, password },context) => {
      try {
        console.log("Inside login resolver")
        const user = await User.findOne({ email });
        console.log(user.uid);
      if (!user) {
        throw new Error('User Not Found');
      }
      console.log(user.uid);
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new Error('inValid password');
      }
      const token = jwt.sign({ id: user.uid }, process.env.JWT_SECRET);
      console.log(user.uid);
      return { userId: user.uid, token: token, tokenExpiration: 1 };

      } catch (error) {
        console.log(error);
      }
    },
  }
  };