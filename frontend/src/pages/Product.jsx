import React, { useContext } from 'react'
import { useParams } from 'react-router-dom';
import BreadCrumbs from '../component/BreadCrumbs/BreadCrumbs';
import { ShopContext } from "../context/ShopContext";
import Productdisplay from '../component/ProductDisplay/Productdisplay';
import DiscriptionBox from '../component/DescriptonBox/DescriptionBox';
import Relatedproducts from '../component/RelatedProducts/Relatedproducts';
const Product = () => {
  const {all_product}= useContext(ShopContext);
  const {productId}= useParams();
  const product = all_product.find((e)=> e.id === Number(productId))
  return (
    <div >
      <BreadCrumbs product={product}/>
      <Productdisplay product={product}/>
      <DiscriptionBox/>
      <Relatedproducts/>
    </div>
  )
}

export default Product
