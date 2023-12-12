import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const QuillSetup = () => {
  const [content, setContent] = useState('');

  const handleContentChange = (value) => {
    setContent(value);
  };

  return (
    <div className='editor'>
      <ReactQuill   theme="snow" value={content} onChange={handleContentChange} />
    </div>
  );
};

export default QuillSetup;
