import AddDocBut from '../components/AddDocBut'
import DocumentList from '../components/DocumentList'
import QuillSetup from '../components/QuillSetup'

const Home = () => {
  return (
    <div className='p-4 h-screen w-screen'>
      <AddDocBut/>
      <DocumentList/>
      {/* <QuillSetup/> */}
    </div>
  )
}

export default Home
