import React from 'react'
import {useState} from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_USER } from '../queries/Auth';


const Signup = () => {
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");

  const [createUserMutation, { loading, error }] = useMutation(CREATE_USER);


  const handleSubmit=async (e)=>{
    e.preventDefault();
    try {
      // Call the mutation with the provided variables
      const { data } = await createUserMutation({
        variables: {
          email: email,
          password: password
        }
      });

      // Handle the response from the server
      console.log(data.createUser);

      // You can perform further actions here, such as redirecting the user or storing the token in local storage
    } catch (error) {
      // Handle errors
      console.error(error);
    }

  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="rounded-lg  p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Sign up</h1>
        {/* {renderEmailError()}
        {renderPasswordErrors()} */}
        {/* <span className="text-red-500 text-xs">{signupError}</span> */}
        <form
          className="w-full max-w-sm mx-auto flex flex-col"
        //   onSubmit={handleSubmit(onSubmit)}
        >
          <div className="mb-4">
            <input
              className="appearance-none border rounded w-full py-2 px-3 bg-transparent border-0 leading-tight focus:outline-none focus:border-b-0"
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              
            //   {...register("email", { required: true })}
            //   onChange={(e) => {
            //     handleEmailChange(e);
            //   }}
            />
          </div>
          <div className="mb-4">
            <input
              className="appearance-none border rounded w-full py-2 px-3 bg-transparent border-0 leading-tight focus:outline-none focus:border-b-0"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
            //   {...register("password", { required: true })}
            />
          </div>
          {/* <div className="mb-4">
            <input
              className="appearance-none border rounded w-full py-2 px-3 bg-transparent border-0 leading-tight focus:outline-none focus:border-b-0"
              type="password"
              placeholder="Confirm Password"
            //   {...register("confirmPassword", {
            //     required: true,
            //     validate: (value) => value === watch("password"),
            //   })}
            />
          </div> */}
          <div className="flex flex-col space-y-4 items-center justify-center">
            <button
            //   className={`flex text-white bg-sky-400 border-2 border-sky-400 font-bold py-2 px-4 rounded hover:bg-transparent hover:text-sky-400 hover:border-2  focus:outline-none focus:shadow-outline ${
            //     !isEmailValid ? "opacity-50 cursor-not-allowed" : ""
            //   }`}
              // type="submit"
              onClick={handleSubmit}
            //   disabled={!isEmailValid && errors && !isPasswordStrong}
            >
              Sign Up
            </button>
            {error && <p>Error: {error.message}</p>}
            <div className="registration__form-separator">
              <span className="registration__form-separator-text">
                <div className="p-3 text-slate-500">or</div>
              </span>
            </div>
            <button
              className="flex items-center border border-transparent bg-white text-black font-bold py-2 px-4 rounded-md drop-shadow-lg hover:bg-slate-100 hover:border hover:filter-none focus:outline-none focus:shadow-outline"
            //   onClick={handleGoogleSignIn}
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
            //   onClick={toggleForm}
            >
              Already have an account? Log In
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Signup
