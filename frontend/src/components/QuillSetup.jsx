import React, { useEffect } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import shareDBConnection from "../connections/shareDBConn";
import tinycolor from "tinycolor2";
import ObjectID from "bson-objectid";
import QuillCursors from "quill-cursors";

const QuillSetup = () => {
  




    const docId = "test-doc7";
    const doc = shareDBConnection.get("examples", docId);
    const presence = shareDBConnection.getDocPresence("examples", docId);
    Quill.register('modules/cursors', QuillCursors);

  

    var colors = {};

    doc.subscribe((err) => {
      if (err) throw err;
      const content = doc.data;
      var quill = new Quill('#editor', {
        theme: 'snow',
        modules: {cursors: true}
      });


      const cursors = quill.getModule("cursors");
      cursors.createCursor('cursor', 'Pranali', 'pink');
      const localPresence = presence.create()
      console.log(localPresence);
      quill.setContents(content);
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
      
      presence.subscribe( (error)=> {
        if (error) throw error;
      });
      presence.on('receive', (id, range) => {
        console.log("sdf");
        if (range === null) {
          console.log("remote left")
          // The remote client is no longer present in the document
        } else {
          // Handle the new value by updating UI, etc.
        colors[id] = colors[id] || tinycolor.random().toHexString();
        var name = (range && range.name) || "Anonymous";
        cursors.createCursor(id, name, 'green');
        cursors.moveCursor(id, range);
        }
      })
     
  
      quill.on("selection-change",  (range, oldRange, source)=> {
        if (source !== "user") return;
        if (!range) return;
  
        else{
          setTimeout(() => cursors.moveCursor('cursor', range));
          localPresence.submit(range, function(error) {
            if (error) throw error;
          });
        }
      });
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