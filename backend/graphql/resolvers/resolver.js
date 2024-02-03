const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { PubSub } = require("graphql-subscriptions");
const User = require("../../models/User.js");
const { app } = require("../../connections/firebaseconfig.js");
const { createUserWithEmailAndPassword } = require("firebase/auth");
const Document = require("../../models/Document.js");
const ShareDB = require("sharedb");
const { getAuth } = require("firebase/auth");
const pubsub = new PubSub();
const shareDBMongo = require('sharedb-mongo');
const dotenv = require("dotenv");
dotenv.config();
const backend = new ShareDB({
  db: require('sharedb-mongo')(process.env.MONGODB_URI),
  presence:true,
  doNotForwardSendPresenceErrorsToClient: true
  
});;
let connection=backend.connect();

const verifyToken = (req, res) => {
  try {
    let  {authToken}  = req.cookies;
    console.log(authToken)
    if (!authToken) {
      return res.status(403).send("Access Denied");
    }

    if (authToken.startsWith("Bearer ")) {
      authToken = authToken.slice(7, authToken.length).trimLeft();
    }

    const verified = jwt.verify(authToken, process.env.JWT_SECRET);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const everyResolver = {
  Mutation: {
    createUser: async (_, { email, password }, context) => {
      try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          throw new Error("User exists already.");
        }
        const auth = getAuth(app);
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;
        const token = jwt.sign({ id: user.uid }, process.env.JWT_SECRET);
        const hashedPassword = await bcrypt.hash(password, 12);
        const userMongoDB = new User({
          uid: user.uid,
          email,
          password: hashedPassword,
        });
        const result = await userMongoDB.save();
        console.log(result);
        await context.res
          .cookie("authToken", token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            secure: true,
            sameSite: "None",
          })
          .status(201);
        return { userId: user.uid, token: token, tokenExpiration: 1 };
      } catch (error) {
        console.log(error);
      }
    },
    login: async (_, { email, password }, context) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          throw new Error("User Not Found");
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
          throw new Error("inValid password");
        }
        const token = jwt.sign({ id: user.uid }, process.env.JWT_SECRET);
        await context.res
          .cookie("authToken", token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            secure: true,
            sameSite: "None",
          })
          .status(201);
        return { userId: user.uid, token: token, tokenExpiration: 1 };
      } catch (error) {
        console.log(error);
      }
    },
    createDocument: async (_, { userId }, context) => {
      try {
        // console.log(context)
        verifyToken(context.req.cookies,context.res.cookies);
        const document = new Document({
          title: "Untitled",
          owner: userId,
          content: "",
          associatedUsers: [userId],
        });
        const result = await document.save();

        let doc = connection.get('collaborations', result._id);
        doc.fetch(function(err) {
                if (err) throw err;
                    doc.create([{insert: ''}], 'rich-text');
                   
            });

            return {
              _id: result._id,
              title: result.title,
              owner: result.owner,
              content: result.content,
              associatedUsers: result.associatedUsers,
            };
      } catch (error) {
        console.log(error);
      }
    },

    updateDocument: (_parent, args) => {
      // Update the document content
      // const doc = shareDB.get('documents', '657ede539e01bb0d81685798');
      // doc.create({ content: '' });
      // doc.submitOp([{ p: ['content'], od: doc.data.content, oi: content }]);
      const _id = args.documentId;
      const content = args.content;
      pubsub.publish("DOCUMENT_CHANGED", { documentChanged: { _id, content } });
      console.log("inside update doc res");
      return { _id: _id, content: content };
    },
    getDocuments: async (_, { userId },context) => {
      try {
        const documents = await Document.find({ associatedUsers: userId });
        return documents;
      } catch (error) {
        console.log(error);
      }
    },
  },
  Subscription: {
    documentChanged: {
      subscribe: () => pubsub.asyncIterator(["DOCUMENT_CHANGED"]),
    },
  },
};

module.exports = everyResolver;
