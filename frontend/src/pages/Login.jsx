import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Login = () => {

  const[currentState, setCurrentState] = useState('login')
  const {token ,setToken, navigate, backendUrl} = useContext(ShopContext) 

  const [name,setName] = useState('')
  const [password,setPassword] = useState('')
  const [email,setEmail] = useState('')

  const onSubmitHandler = async (e)=>{
      e.preventDefault();

      try {
        if(currentState === 'sign up'){

          const res = await axios.post(backendUrl + '/api/user/register' , {name,email,password})
          // console.log(res.data);
          if(res.data.success){
            setToken(res.data.token)
            localStorage.setItem('token',res.data.token)
          } else{
            toast.error(res.data.message)
          }

        } else{

          const res = await axios.post(backendUrl + '/api/user/login', {email,password})
          // console.log(res.data);
          if(res.data.success){
            setToken(res.data.token)
            localStorage.setItem('token',res.data.token)
          } else{
            toast.error(res.data.message)
          }

        }


      } catch (error) {
        console.log(error)
        toast.error(error.message)
      }
  }
  useEffect(()=>{
    if(token) {
      navigate('/')
    }
  },[token])


  return (
    <form className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
        <div className='inline-flex items-center gap-2 mb-2 mt-10'>
            <p className='prata-regular text-3xl'>{currentState}</p>
            <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
        </div>
        {currentState === 'login' ? '' :
        <input onChange={(e)=>setName(e.target.value)} value={name} required type="text" className='w-full px-3 py-2 border border-gray-800' placeholder='Name'/> }
        <input onChange={(e)=>setEmail(e.target.value)} value={email} required type="email" className='w-full px-3 py-2 border border-gray-800' placeholder='Email'/>
        <input onChange={(e)=>setPassword(e.target.value)} value={password} required type="password" className='w-full px-3 py-2 border border-gray-800' placeholder='Password'/>
        <div className='w-full flex justify-between text-sm mt-[-8px]'>
            <p className='cursor-pointer'>Forgot your password ?</p>
            {
              currentState === 'login'
              ? <p className='cursor-pointer' onClick={()=>setCurrentState('sign up')}>Create Account</p>
              : <p className='cursor-pointer' onClick={()=>setCurrentState('login')}>login Here</p>
            }
        </div>
        <button type='submit' onClick={onSubmitHandler} className='bg-black text-white font-light px-8 py-2 mt-4'>{currentState ==='login'? 'Sign In' :'Sign up'}</button>
    </form>
  )


}

export default Login