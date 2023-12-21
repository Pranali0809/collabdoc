const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');
const cookieParser = require('cookie-parser');
const User=require('../../models/User.js');
const {app}=require('../../connections/firebaseconfig.js');
const {createUserWithEmailAndPassword}=require("firebase/auth")

const {
    getAuth
} =require("firebase/auth");

  module.exports = {

    RootMutation:{
     
      createUser: async (_,{ email, password },context) => {
          console.log("here")

        try {
          console.log("here")
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
          await context.res.cookie('authToken', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, 
            secure: true,
            sameSite: 'None'
          }).status(201);
          const result = await userMongoDB.save();
          return { userId: user.uid, token: token, tokenExpiration: 1 };
        } catch (error) {
          console.log(error);
        }
      },
      login: async (_,{ email, password },context) => {
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
        await context.res.cookie('authToken', token, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000, 
          secure: true,
          sameSite: 'None'
        }).status(201);
        return { userId: user.uid, token: token, tokenExpiration: 1 };
  
        } catch (error) {
          console.log(error);
        }
      }
  },
  // RootQuery:{
    
  // }
  };