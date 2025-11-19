import React, { useEffect, useState } from 'react';
import './NewCollections.css';
import Item from '../Item/Item.jsx';

// ⭐ Use your Render backend URL
const BACKEND_URL = "https://ecommerce-website-uw5x.onrender.com";

const NewCollections = () => {
  const [new_collection, setNew_collection] = useState([]);

  useEffect(() => {
    fetch(`${BACKEND_URL}/newcollections`)
      .then((response) => response.json())
      .then((data) => setNew_collection(data))
      .catch((err) =>
        console.error("Error fetching new collections:", err)
      );
  }, []);

  return (
    <div className='new-collections'>
      <h1>NEW COLLECTION</h1>
      <hr />
      <div className="collections">
        {new_collection.map((item, i) => (
          <Item
            key={i}
            id={item.id}
            name={item.name}
            image={item.image}
            new_price={item.new_price}
            old_price={item.old_price}
          />
        ))}
      </div>
    </div>
  );
};

export default NewCollections;
