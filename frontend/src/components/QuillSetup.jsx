import React, { useEffect, useRef, useState } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import QuillCursors from "quill-cursors";
import AddDocBut from '../components/AddDocBut';
import ShareDB from "sharedb/lib/client";
import ReconnectingWebSocket from "reconnectingwebsocket"

const QuillSetup = () => {
  const [documentContent, setDocumentContent] = useState('');
  const quillRef = useRef();

  ShareDB.types.register(require('rich-text').type);
  var shareDBSocket = new ReconnectingWebSocket( 'ws' + '://' + 'localhost:4200' + '/graphql');
  var shareDBConnection = new ShareDB.Connection(shareDBSocket);

  var doc = shareDBConnection.get('documents', '1');

  useEffect(() => {
    initializeQuillEditor();
  }, []);

  const initializeQuillEditor = () => {
    const options = {
      placeholder: 'Compose an epic...',
      readOnly: false,
      theme: 'snow',
    };

    quillRef.current = new Quill(`#editor`);
  };

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

  doc.subscribe((err) => {
    if (err) throw err;

    if (!doc.type) {
      doc.create([{ insert: '\n' }], 'rich-text');
    }

    quillRef.current.setContents(doc.data);

    quillRef.current.on('text-change', (delta, oldDelta, source) => {
      if (source === 'user') {
        doc.submitOp(delta, { source: quillRef.current }, (err) => {
          if (err) console.error('Submit OP returned an error:', err);
        });
      }
    });

    doc.on('op', (op, source) => {
      if (source !== quillRef.current) {
        quillRef.current.updateContents(op);
      }
    });

  });


  return (
    <div>
      <div id={`editor`} style={{ height: '400px', border: '2px solid purple' }} dangerouslySetInnerHTML={{ __html: documentContent }} />
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
