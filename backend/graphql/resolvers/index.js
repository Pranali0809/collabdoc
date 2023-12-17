const authResolver = require('./auth');
const documentResolver=require('./document');


const rootResolver = {
    ...authResolver,
    ...documentResolver

  };
  
  module.exports=rootResolver;