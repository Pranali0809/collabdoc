const authResolver = require('./auth');
const documentResolver=require('./document');


const rootResolver = {
    // ...documentResolver,
    ...authResolver,
  };
  
module.exports=rootResolver;