import React, { useEffect } from "react";
import { useParams } from 'react-router-dom';
import Quill from "quill";
import "quill/dist/quill.snow.css";
import shareDBConnection from "../connections/shareDBConn";
import QuillCursors from "quill-cursors";
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

const QuillSetup = () => {
  const [cookies, setCookie] = useCookies(['authToken']);
  const navigate = useNavigate();

  const { docId } = useParams();
  const doc = shareDBConnection.get("collaborations", docId);
  const presence = shareDBConnection.getDocPresence("collaborations", docId);
  Quill.register('modules/cursors', QuillCursors);

  const initializeQuill = () => {
    var quill = new Quill('#editor', {
      theme: 'snow',
      modules: { cursors: true }
    });

    const cursors = quill.getModule("cursors");
    cursors.createCursor('cursor', 'Pranali', 'pink');
    const localPresence = presence.create();
    quill.setContents(doc.data);

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

    console.log(localPresence, presence);
    presence.subscribe();
    presence.on('receive', (id, range) => {
      if (range === null) {
        console.log("remote left");
      } else {
        var name = (range && range.name) || "Anonymous";
        cursors.createCursor(id, name, 'green');
        cursors.moveCursor(id, range);
      }
    })
  }

  useEffect(() => {
    verifyToken();
  }, []); 

  const verifyToken = () => {
    const authToken = cookies['authToken'];
    console.log(authToken);

    if (authToken) {
      doc.subscribe((err) => {
        if (err) throw err;
        initializeQuill(); 
      });
    } else {
      console.log('AuthToken is not set.');
      navigate(`/`);
    }
  };

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
