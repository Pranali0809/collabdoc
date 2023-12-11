import React from 'react';

const AddDocBut = () => {
  return (
    // <button className="bg-transparent border border-blue-500 hover:border-blue-700 text-blue-500 font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline-blue h-1000">
    //   + New Document
    // </button>
      <div className="w-32 h-32 bg-transparent border-dotted border-2 border-black rounded-md flex flex-col items-center justify-center text-black cursor-pointer">
        <div className="text-3xl mb-2">+</div>
        <div className="text-center">Add Document</div>
      </div>
  );
};

export default AddDocBut;