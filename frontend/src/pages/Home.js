import AddDocBut from '../components/AddDocBut'
import DocumentList from '../components/DocumentList'
import QuillSetup from '../components/QuillSetup'
import { useState,useEffect } from 'react'
import { useParams, useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie';
import LogOutBut from '../components/LogOutBut';

const Home = () => {
  const [document,setDocument]=useState([]);
  const [cookies, setCookie] = useCookies(['authToken']);
  const navigate=useNavigate();
  useEffect(() => {
    verifyToken()

  }, [])
  
  const verifyToken = () => {
    const authToken = cookies["authToken"];
    console.log(authToken);

    if (!authToken) {
      navigate(`/`);
  };
}
  return (
    <>

      <LogOutBut/>
    <div className='p-4 h-screen w-screen'>
      <AddDocBut  setDocument={setDocument}/>
      <DocumentList document={document}/>
      {/* <QuillSetup/> */}
    </div>
    </>
  )
}


export default Home
