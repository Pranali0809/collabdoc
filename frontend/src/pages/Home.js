import AddDocBut from '../components/AddDocBut'
import DocumentList from '../components/DocumentList'
import QuillSetup from '../components/QuillSetup'
import { useState } from 'react'

const Home = () => {
  const [document,setDocument]=useState([]);
  
  return (
    <div className='p-4 h-screen w-screen'>
      <AddDocBut  setDocument={setDocument}/>
      <DocumentList document={document}/>
      {/* <QuillSetup/> */}
    </div>
  )
}

export default Home
