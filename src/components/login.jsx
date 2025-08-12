import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'

const login = () => {
    const {loginWithRedirect , isAuthenticated} = useAuth0()
  return (

 <div className="min-h-screen bg-landing-bg bg-cover bg-no-repeat">
 <div>
       { !isAuthenticated && (
            <button onClick={()=> loginWithRedirect()}>
             sign in 
            </button>
        )}

    </div>
</div>



   
  )
}

export default login