import React from "react";
import { useParams } from 'react-router-dom';

import Quill from "quill";
import "quill/dist/quill.snow.css";

import shareDBConnection from "../connections/shareDBConn";

import QuillCursors from "quill-cursors";

const QuillSetup = () => {
  const { docId } = useParams();
    const doc = shareDBConnection.get("collaborations", docId);
    const presence = shareDBConnection.getDocPresence("collaborations", docId);
    Quill.register('modules/cursors', QuillCursors);

  
function initializeQuill(){
  var quill = new Quill('#editor', {
    theme: 'snow',
    modules: {cursors: true}
  });


  const cursors = quill.getModule("cursors");
  cursors.createCursor('cursor', 'Pranali', 'pink');
  const localPresence = presence.create()
  quill.setContents(doc.data);
  // localPresence.submit("online");
  quill.on("text-change", (delta, oldDelta, source) => {
    if (source === "user") {
      doc.submitOp(delta, { source: quill }, (err) => {
        if (err) console.error("Submit OP returned an error:", err);
      });
    }
  });

  doc.on("op", (op, source) => {
    if (quill && source !== quill) {
      quill.updateContents(op);
    }
  });
  console.log(localPresence,presence)
  presence.subscribe();
  presence.on('receive', (id, range) => {
    console.log("sdf");
    if (range === null) {
      console.log("remote left")
      // The remote client is no longer present in the document
    } else {
      // Handle the new value by updating UI, etc.
   
    var name = (range && range.name) || "Anonymous";
    cursors.createCursor(id, name, 'green');
    cursors.moveCursor(id, range);
    }
  })
 
  // quill.on("selection-change",  (range, oldRange, source)=> {
  //   if (source !== "user") return;
  //   if (!range) return;

  //     else{
  //       setTimeout(() => cursors.moveCursor('cursor', range));
  //       localPresence.submit(range, function(error) {
  //         if (error) throw error;
  //       });
  //     }
  // });
}
    doc.subscribe((err) => {
      if (err) throw err;
      initializeQuill();
      
    });

   


  return (
    <div>
      <div
        id={`editor`}
        style={{ height: "400px", border: "2px solid purple" }}
      />
    </div>
  );
};

export default QuillSetup;
