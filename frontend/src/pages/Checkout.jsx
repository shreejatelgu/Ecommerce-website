import React, { useState } from "react";
import "./CSS/Checkout.css";

const Checkout = () => {
  const [step, setStep] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    cardName: "",
    cardNumber: "",
    exp: "",
    cvv: "",
  });

  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];

  const API_BASE = "https://ecommerce-website-uw5x.onrender.com"; // 🔥 Render backend

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const orderData = { ...formData, cartItems };

      // 🔥 FIXED BACKEND URL
      const res = await fetch(`${API_BASE}/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.removeItem("cart");
        setOrderPlaced(true);
      } else {
        alert("❌ " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    }
  };

  if (orderPlaced) {
    return (
      <div className="checkout-container">
        <h2>🎉 Order Placed Successfully!</h2>
        <p>Your cart is now empty.</p>
        <p>Thank you for shopping with us 🛍️</p>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div className="step">
            <h3>Shipping Information</h3>
            <input name="fullName" placeholder="Full Name" onChange={handleChange} required />
            <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
            <input name="phone" type="tel" placeholder="Phone Number" onChange={handleChange} required />
            <input name="address" placeholder="Street Address" onChange={handleChange} required />
            <input name="city" placeholder="City" onChange={handleChange} required />
            <input name="state" placeholder="State" onChange={handleChange} required />
            <input name="zip" placeholder="Postal Code" onChange={handleChange} required />
            <button type="button" onClick={nextStep}>Next →</button>
          </div>
        )}

        {step === 2 && (
          <div className="step">
            <h3>Payment Details</h3>
            <input name="cardName" placeholder="Name on Card" onChange={handleChange} required />
            <input name="cardNumber" placeholder="Card Number" maxLength="16" onChange={handleChange} required />
            <input name="exp" placeholder="MM/YY" maxLength="5" onChange={handleChange} required />
            <input name="cvv" placeholder="CVV" maxLength="3" onChange={handleChange} required />
            <div className="buttons">
              <button type="button" onClick={prevStep}>← Back</button>
              <button type="button" onClick={nextStep}>Next →</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="step">
            <h3>Review & Confirm</h3>
            <div className="summary">
              <p><strong>Name:</strong> {formData.fullName}</p>
              <p><strong>Email:</strong> {formData.email}</p>
              <p><strong>Address:</strong> {formData.address}, {formData.city}</p>
              <p><strong>Payment:</strong> **** **** **** {formData.cardNumber.slice(-4)}</p>
              <h4>🛒 Cart Items:</h4>
              {cartItems.length === 0 ? (
                <p>No items in cart.</p>
              ) : (
                <ul>
                  {cartItems.map((item, i) => (
                    <li key={i}>
                      {item.name} — {item.quantity} × ₹{item.price}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="buttons">
              <button type="button" onClick={prevStep}>← Back</button>
              <button type="submit">Place Order ✅</button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default Checkout;
