import { useState } from 'react';
import {useDispatch} from'react-redux';
import { useNavigate } from 'react-router-dom';
import { useMutation,useSubscription} from '@apollo/client';
import { setUserId } from './../state/authStates.js'
import { LOGIN } from '../queries/Auth';

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [showUserCredentialsError, setShowUserCredentialsError] =
    useState(false);
  
  const [loginMutation,{logout,error}]=useMutation(LOGIN);

  const dispatch = useDispatch();
  const navigate=useNavigate();
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const {data}=await loginMutation({
        variables:{
          email:email,
          password:password
        }
      });
      dispatch(setUserId(data.login.userId));
      // const { data: documentData, loading, error } = useSubscription(DOCUMENT_CHANGED_SUBSCRIPTION, {
      //   variables: { docId: '657ede539e01bb0d81685798' }, // Replace with the actual document ID
      //   skip: !userId, // Skip the subscription if userId is not available
      // });
      navigate('/home');
      console.log(data.login);

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
    <div className="rounded-lg  p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Welcome Back</h1>
      {/* {renderEmailError()}
      {renderPasswordError()}
      {renderUserCredentialsError()} */}
      <form
        className="w-full max-w-sm mx-auto"
        onSubmit={()=>handleSubmit()}
      >
        <div className="mb-4">
          <input
            className="appearance-none border rounded w-full py-2 px-3 bg-transparent border-0 leading-tight focus:outline-none focus:border-b-0"
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            
          />
        </div>
        <div className="mb-4">
          <input
            className="appearance-none border rounded w-full py-2 px-3 bg-transparent border-0 leading-tight focus:outline-none focus:border-b-0"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
          />
        </div>
        <div className="flex flex-col space-y-4 items-center justify-center">
          <button
            // className={`flex text-white bg-sky-400 border-2 border-sky-400 font-bold py-2 px-4 rounded hover:bg-transparent hover:text-sky-400 hover:border-2  focus:outline-none focus:shadow-outline ${
            //   !isEmailValid ? "opacity-50 cursor-not-allowed" : ""
            // }`}
            onClick={handleSubmit}
            // disabled={!isEmailValid}
          >
            Log in
          </button>
          <div className="registration__form-separator">
            <span className="registration__form-separator-text">
              <div className="p-3 text-slate-500">or</div>
            </span>
          </div>
          <button
            className="flex items-center border border-transparent bg-white text-black font-bold py-2 px-4 rounded-md drop-shadow-lg hover:bg-slate-100 hover:border hover:filter-none focus:outline-none focus:shadow-outline"
            type="submit"
          >
            <img
              src="https://firebasestorage.googleapis.com/v0/b/graph-networking-app.appspot.com/o/utility%2Fgoogle-icon.svg?alt=media&token=3cf598dd-2cc5-4c83-be58-5e58196b1245"
              alt=""
              style={{
                maxWidth: "20px",
                paddingRight: "5px",
              }}
            />
            Google
          </button>
        </div>
        <div className="flex items-center justify-center mt-4">
          <button
            className="text-blue-500 hover:text-blue-700 text-sm font-semibold focus:outline-none"
            type="button"
          >
            Don't have an account? Sign up
          </button>
        </div>
      </form>
    </div>
  </div>
  )
}

export default Signin
