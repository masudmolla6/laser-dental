import React from 'react'
import logo from "/logo.png"

const Logo = () => {
  return (
    <div className="h-16 flex items-center">
      <img 
        src={logo} 
        alt="E-Store Logo" 
        className="h-full w-auto object-contain" 
      />
    </div>
  )
}

export default Logo;