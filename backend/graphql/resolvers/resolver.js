const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');
const {PubSub}=require('graphql-subscriptions')
 const User=require('../../models/User.js');
const {app}=require('../../connections/firebaseconfig.js');
const {createUserWithEmailAndPassword}=require("firebase/auth");
const Document=require('../../models/Document.js');
const ShareDB = require('sharedb');

const {
    getAuth
} =require("firebase/auth");
const shareDB = new ShareDB();
const pubsub = new PubSub();
const everyResolver = {

  Mutation:
  {
     
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
        const result = await userMongoDB.save();
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
      },
    createDocument: async(_,{userId},context)=>{
      try{
        console.log("here");
        const document=new Document({
          title:"Untitled",
          owner:userId,
          content:"",
          associatedUsers:[userId]
        })
        const result = await document.save();
        console.log(result);

        return {
          _id: result._id,
          title: result.title,
          owner: result.owner,
          content: result.content,
          associatedUsers: result.associatedUsers
        };
        }catch(error){
            console.log(error);
        }   
     },
    
    updateDocument: (_parent,args) => {
      // Update the document content
      // const doc = shareDB.get('documents', '657ede539e01bb0d81685798');
      // doc.create({ content: '' });
      // doc.submitOp([{ p: ['content'], od: doc.data.content, oi: content }]);
      const _id=args.documentId;
      const content=args.content;
      pubsub.publish('DOCUMENT_CHANGED', { documentChanged: {_id,content} });
      console.log("inside update doc res")
      return {_id:_id,content:content};
     },

    },
    Subscription: 
    {
      documentChanged: {
          subscribe: () => pubsub.asyncIterator(['DOCUMENT_CHANGED'])
      }
    }
  };

  module.exports=everyResolver;