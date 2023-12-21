const Document=require('../../models/Document.js');

module.exports={
    RootMutation:{
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
        }
    }
}