import React from 'react'
import './DescriptionBox.css'

const DescriptionBox = () => {
  return (
    <div className='descriptionbox'>
      
      {/* Tabs */}
      <div className="descriptionbox-navigator">
        <div className="descriptionbox-nav-box">Description</div>
        <div className="descriptionbox-nav-box fade">Reviews (122)</div>
      </div>   {/* ✅ close navigator here */}

      {/* Description Content */}
      <div className="descriptionbox-description">
        <p>
          An e-commerce website is a digital platform that enables the buying and selling of products or services over the internet. 
          It serves as a virtual marketplace where businesses and individuals can showcase their offerings, connect with customers, 
          and complete transactions without the need for a physical store. E-commerce websites have grown in popularity because of 
          their convenience, accessibility, and global reach. They allow customers to shop anytime and anywhere, while businesses 
          benefit from reaching wider audiences and providing a seamless shopping experience.
        </p>

        <p>
          E-commerce has transformed modern trade by breaking down geographical barriers and making shopping accessible 24/7. 
          Whether it’s fashion, electronics, groceries, or services, e-commerce websites provide convenience, speed, and flexibility 
          to both sellers and buyers.
        </p>
      </div>

    </div>
  )
}

export default DescriptionBox
