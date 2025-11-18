import React from 'react'
import Hero from '../component/Hero/Hero'
import Popular from '../component/Popular/Popular'
import Offers from '../component/Offers/Offers'
import NewCollections from '../component/NewCollections/NewCollections'
import Newsletter from '../component/NewsLetter/Newsletter'


const Shop = () => {
  return (
    <div>
      <Hero/>
      <Popular/>
      <Offers/>
      <NewCollections/>
      <Newsletter/>

    </div>
  )
}

export default Shop
