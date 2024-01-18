import React, { useEffect, useRef, useState } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import shareDBConnection from '../connections/shareDBConn';

const QuillSetup = () => {
  const [documentContent, setDocumentContent] = useState('');
  const quillRef = useRef();
  const docId = 'test-doc4';
  const doc = shareDBConnection.get('examples', docId);

  useEffect(() => {
    const initializeQuillEditor = () => {
      const options = {
        placeholder: 'Compose an epic...',
        readOnly: false,
        theme: 'snow',
      };

      quillRef.current = new Quill('#editor');

      quillRef.current.on('text-change', (delta, oldDelta, source) => {
        if (source === 'user') {
          // Submit the delta to ShareDB when there is a change
          doc.submitOp(delta, { source: quillRef.current }, (err) => {
            if (err) console.error('Submit OP returned an error:', err);
          });
        }
      });
    };

    initializeQuillEditor();

    return () => {
      // Cleanup when component unmounts
      quillRef.current = null;
    };
  }, [doc]);

  useEffect(() => {
    // Subscribe to ShareDB document changes
    doc.subscribe((err) => {
      if (err) throw err;

      // Set Quill editor content when document is updated in ShareDB
      const content = doc.data;
      quillRef.current.setContents(content);
    });

    // Unsubscribe from ShareDB document changes when component unmounts
    return () => {
      doc.unsubscribe();
    };
  }, [doc]);
 
  useEffect(() => {
    // Handle ShareDB operations and update Quill editor
    doc.on('op', (op, source) => {
      if (quillRef.current && source !== quillRef.current) {
        quillRef.current.updateContents(op);
      }
    });
  }, [doc]);

  return (
    <div>
      <div id={`editor`} style={{ height: '400px', border: '2px solid purple' }} />
      {/* <AddDocBut addDocument={handleAddDocument} /> */}
    </div>
  );
};

export default QuillSetup;






 // useEffect(() => {
    
  // const options = {
  //   // modules: {
  //   //   toolbar: [
  //   //     [{ header: [1, 2, false] }],
  //   //     ['bold', 'italic', 'underline', 'strike'],
  //   //     [{ list: 'ordered' }, { list: 'bullet' }],
  //   //     ['link', 'image', 'video'],
  //   //     ['clean'],
  //   //   ],
  //   // },
  //   placeholder: 'Compose an epic...',
  //   readOnly: false,
  //   theme: 'snow',
  // };

  //   quillRef.current = new Quill('#editor');

  //   return () => {
  //     quillRef.current = null;
  //   };
  // }, []); 


    // const handleAddDocument = () => {
  //   // Save the content of the current document if needed
  //   const currentContent = quillRef.current.root.innerHTML;
  //   console.log("Current Content:", currentContent);

  //   // Reset the content of the current document
  //   setDocumentContent('');

  //   // Optionally, you can clear the content of the Quill editor
  //   quillRef.current.root.innerHTML = '';

  //   // You can now start typing in the new document
  // };
