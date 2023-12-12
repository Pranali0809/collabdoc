const jwt=require('jsonwebtoken');
const {app}=require('E:/project/collabdoc/backend/connections/firebaseconfig.js');

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

module.exports={

    createUser: async({email,password})=>{
    // const auth=getAuth(app);
    // createUserWithEmailAndPassword(auth, email, password)
    // .then((userCredential) => {
    //   const user = userCredential.user;
    //   return {user};
    // })
    // .catch((error) => {
    // //   res.status(409).json({ error: error.message });
    // });
    }
}