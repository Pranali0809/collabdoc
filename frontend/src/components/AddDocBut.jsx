import React from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_DOCUMENT } from '../queries/Document';
import{useSelector} from 'react-redux';

const AddDocBut = () => {
const userId = useSelector((state) => state.auth.userId);

  const [createDocumentMutation, { loading, error }] = useMutation(CREATE_DOCUMENT);


  const addDocument=async()=>{
    try {
      const { data } = await createDocumentMutation({
        variables: {
          userId: userId,
        }
      });
      console.log(data.createDocument);
    } catch (error) {
      console.error(error);
    }
  }
  return (
    // <button className="bg-transparent border border-blue-500 hover:border-blue-700 text-blue-500 font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline-blue h-1000">
    //   + New Document
    // </button>
      <div className="w-32 h-32 bg-transparent border-dotted border-2 border-black rounded-md flex flex-col items-center justify-center text-black cursor-pointer"
      onClick={addDocument}>
        <div className="text-3xl mb-2">+</div>
        <div className="text-center">Add Document</div>
      </div>
  );
};

export default AddDocBut;