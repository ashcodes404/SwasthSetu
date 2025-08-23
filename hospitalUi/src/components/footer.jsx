import React from 'react'

const Footer = () => {
  return (
    <footer className=" text-white py-4">
      <div className="container mx-auto flex flex-col sm:flex-row justify-center items-center gap-0 text-center">
        <p className="text-sm">
          © {new Date().getFullYear()} SwasthSetu Ltd. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer
