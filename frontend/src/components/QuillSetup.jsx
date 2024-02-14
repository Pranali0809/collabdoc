import {React,useEffect,useState,useCallback} from "react";
import { useParams, useNavigate } from "react-router-dom";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import shareDBConnection from "../connections/shareDBConn";
import QuillCursors from "quill-cursors";
import { useCookies } from 'react-cookie';
import { useMutation } from '@apollo/client';
import { ADD_CLICKED_DOCUMENTS } from "../queries/Document";
import{useSelector} from 'react-redux';
import LogOutBut from "./LogOutBut";

const QuillSetup = () => {


  const { docId } = useParams();
    const userId = useSelector((state) => state.auth.userId);
  const navigate=useNavigate();
  const [cookies, setCookie] = useCookies(['authToken']);
  const doc = shareDBConnection.get("collaborations", docId);
  const presence = shareDBConnection.getDocPresence("collaborations", docId);
  Quill.register("modules/cursors", QuillCursors);
  const [addClickedDoc] = useMutation(ADD_CLICKED_DOCUMENTS);
  const [content, setContent] = useState("");
  let quill;
  
  const wrapperRef=useCallback(wrapper=>{
    verifyToken();
    if(wrapper==null)return
    wrapper.innerHTML=""
    const editor=document.createElement("div")
    editor.style.height = "100%";
    editor.style.border = "2px solid purple";
    editor.style.width = "100%";
    wrapper.append(editor)
    quill = new Quill(editor, {
      theme: "snow",
      modules: { cursors: true },
    });
    quill.setContents(doc.data);
  },[])
  const initializeQuill = useCallback(()=> {
    // var quill = new Quill("#editor", {
    //   theme: "snow",
    //   modules: { cursors: true },
    // });
    setContent(quill.root.innerHTML);
    const cursors = quill.getModule("cursors");
    cursors.createCursor("cursor", "Pranali", "pink");
    const localPresence = presence.create();
    quill.setContents(doc.data);
    // localPresence.submit("online");

    quill.on("text-change", (delta, oldDelta, source) => {
      if (source === "user") {
        doc.submitOp(delta, { source: quill }, (err) => {
          if (err) console.error("Submit OP returned an error:", err);
        });
        const content = quill.root.innerHTML;
        setContent(content);
        console.log(content)

      }
    });

    doc.on("op", (op, source) => {
      if (quill && source !== quill) {
        quill.updateContents(op);
      }
    });

    presence.subscribe();

    presence.on("receive", (id, range) => {
      console.log("sdf");
      if (range === null) {
        console.log("remote left");
        // The remote client is no longer present in the document
      } else {
        // Handle the new value by updating UI, etc.

        var name = (range && range.name) || "Anonymous";
        cursors.createCursor(id, name, "green");
        cursors.moveCursor(id, range);
      }
    });

    quill.on("selection-change", (range, oldRange, source) => {
      if (source !== "user") return;
      if (!range) return;
      else {
        setTimeout(() => cursors.moveCursor("cursor", range));
        localPresence.submit(range, function (error) {
          if (error) throw error;
        });
      }
    });
  },[]);


  const handleAddClickedDocuments = async () => {
    try {
      const { data } = await addClickedDoc({
        variables: {
          userId,
          docId
        }
      });
    } catch (error) {
      console.error(error);
    }
  }
    



  const verifyToken = () => {
    const authToken = cookies["authToken"];
    console.log(authToken);

    if (authToken) {
      doc.subscribe((err) => {
        if (err) throw err;
        handleAddClickedDocuments();
        initializeQuill();
      });
    } else {
      console.log("AuthToken is not set.");
      navigate(`/`);
    }
  };

  return (
    <>

      <LogOutBut/>
    <div className="container" style={{ height: "400px" }} ref={wrapperRef}>
      {/* <div
        id={`editor`}
        style={{ height: "400px", border: "2px solid purple" }}
      /> */}
    </div>
    </>
  );
};

export default QuillSetup;
