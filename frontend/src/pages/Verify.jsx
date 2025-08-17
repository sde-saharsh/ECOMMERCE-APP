import React, { useContext, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'

const Verify = () => {

    const {navigate, token , setCartItems, backendUrl} = useContext(ShopContext)
    const [searchParams,setSearchParams] = useSearchParams()

    const success = searchParams.get('success')
    const orderId = searchParams.get('orderId')

    const verifyPayment = async()=>{

        try {
            
            if(!token){
                return null
            } else{

                const res = await axios.post(backendUrl+'/api/order/verifyStripe',{success,orderId},{headers:{token}})
                if(res.data.success){
                    setCartItems({})
                    navigate('/orders')
                } else{
                    navigate('/cart')
                }

            }

        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }

    }

    useEffect(()=>{
        verifyPayment()
    },[token])

  return (
    <div>

    </div>
  )
}

export default Verify