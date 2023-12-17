import{useSelector} from 'react-redux';
import AddDocBut from '../components/AddDocBut'
import QuillSetup from '../components/QuillSetup'

const Home = () => {
  return (
    <div className='p-4 h-screen w-screen'>
      {/* <AddDocBut/> */}
      <QuillSetup/>
    </div>
  )
}

export default Home
