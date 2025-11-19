import React from 'react';
import './BreadCrumbs.css';
import arrow_icon from '../assets/breadcrum_arrow.png';

const BreadCrumbs = ({ product }) => {
  if (!product) return null; // Render nothing until product is available

  return (
    <div className='breadcrum'>
      HOME <img src={arrow_icon} alt="" /> SHOP <img src={arrow_icon} alt="" />
      {product.category} <img src={arrow_icon} alt="" /> {product.name}
    </div>
  );
};

export default BreadCrumbs;
