import React from 'react'
import './NewsLetter.css'
const Newsletter = () => {
  return (
    <div className='newsletter'>
        <h1>Get Exclusive Offers On Your Email</h1>
        <p>Sibscribe to our newsletter and stay updated</p>
        <div>
            <input type="email" placeholder='Your email id'/>
            <button>Subscribe</button>
        </div>
      
    </div>
  )
}

export default Newsletter
