import React, { useEffect, useState } from 'react';
import './Popular.css';
import Item from '../Item/Item.jsx';

// ⭐ Change the backend URL here only once
const BACKEND_URL = "https://ecommerce-website-uw5x.onrender.com";

const Popular = () => {
  const [popularProducts, setPopular] = useState([]);

  useEffect(() => {
    fetch(`${BACKEND_URL}/popularinwomen`)
      .then((response) => response.json())
      .then((data) => setPopular(data))
      .catch((err) => console.error("Error fetching popular products:", err));
  }, []);

  return (
    <div className="popular">
      <h1>POPULAR IN WOMEN</h1>
      <hr />
      <div className="popular-item">
        {popularProducts.map((item, i) => (
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

export default Popular;
