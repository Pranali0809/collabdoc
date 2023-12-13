const jwt=require('jsonwebtoken');
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
    RootMutation:{createUser: async (_,{ email, password }) => {
      try {
        if(password==""){
          throw new Error('User already exits');
        }
        const auth = getAuth(app);
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const token = jwt.sign({ userId: user.uid }, process.env.JWT_SECRET)
        return { userId: user.uid, token: token, tokenExpiration: 1 };
      } catch (error) {
        console.log(error);
      }
    }
  }
  };