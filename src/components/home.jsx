import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'


const Home = () => {
   const {user , isAuthenticated} = useAuth0()


  return (
      <div>
      {isAuthenticated && (
        <h1 className='text-[60px] italic font-bold text-[#343282] text-center mt-5 font-arimo'> Welcome Mr. {user?.name} </h1>
      )}
<div className='flex border rounded-full '>
  <img className='w-5' src="search.svg" alt="" />
<input  type="text" id='hospitals ' placeholder='search for hospitals'/>
</div>

    </div>
  )
}

export default Home