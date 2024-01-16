import React, { useEffect, useRef, useState } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import QuillCursors from "quill-cursors";
import AddDocBut from '../components/AddDocBut';
import ShareDB from "sharedb/lib/client";
import ReconnectingWebSocket from "reconnecting-websocket";
import shareDBConnection from '../connections/shareDBConn';

const QuillSetup = () => {
  const [documentContent, setDocumentContent] = useState('');
  const quillRef = useRef();
  const doc = shareDBConnection.get('examples', 'test-doc3');

  useEffect(() => {
    const initializeQuillEditor = () => {
      const options = {
        placeholder: 'Compose an epic...',
        readOnly: false,
        theme: 'snow',
      };
  
      quillRef.current = new Quill(`#editor`);
  
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
  }, []);

  

  // doc.subscribe((err) => {
  //   if (err) throw err;

  //   // if (!doc.type) {
  //   //   doc.create([{ insert: '\n' }], 'rich-text');
  //   // }
  //   // let delta = doc.data;
  //   // console.log(delta);
  //   // quillRef.current.setContents(delta);
  //   // // quillRef.current.setContents(doc.data);
  //   // document.querySelector("#editor").innerHTML = quillRef.root.innerHTML;
  //   // quillRef.current.on('text-change', (delta, oldDelta, source) => {
  //   //   if (source === 'user') {
  //   //     doc.submitOp(delta, { source: quillRef.current }, (err) => {
  //   //       if (err) console.error('Submit OP returned an error:', err);
  //   //     });
  //   //   }
  //   // });

  //   // doc.on('op', (op, source) => {
  //   //   if (quillRef.current && source !== quillRef.current) {
  //   //     quillRef.current.updateContents(op);
  //   //   }    
  //   // });
  // });


  useEffect(() => {
    // Subscribe to ShareDB document changes
    doc.subscribe((err) => {
      if (err) throw err;

      // Set Quill editor content when document is updated in ShareDB
      quillRef.current.setContents(doc.data);
      console.log(doc.data);
    });

    // Unsubscribe from ShareDB document changes when component unmounts
    return () => {
      doc.unsubscribe();
    };
  }, []); 

  
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
