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
        const auth = getAuth(app);
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Replace the following line to generate a token and handle expiration appropriately
        const token = jwt.sign({ userId: user.uid }, process.env.JWT_SECRET || "defaultSecretKey");
        console.log(user.uid)
        console.log(token);
        return { userId: user.uid, token: token, tokenExpiration: 1 };
      } catch (error) {
        // Handle the error appropriately
        console.log(error)
      }
    }
  }
  };