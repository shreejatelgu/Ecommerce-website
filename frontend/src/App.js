
import './App.css';
import Navbar from './component/Navbar/Navbar';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import Shop from './pages/Shop';
import ShopCategory from './pages/ShopCategory';
import Product from './pages/Product';
import LoginSignup from './pages/LoginSignup';
import Cart from './pages/Cart';
import Footer from './component/Footer/Footer';
import men_banner from './component/assets/banner_mens.png'
import women_banner from './component/assets/banner_women.png'
import kids_banner from './component/assets/banner_kids.png'
import Checkout from "./pages/Checkout";

function App() {
  return (
    <div > 
        <BrowserRouter>
        <Navbar/>
        <Routes>
          <Route path='/' element={<Shop/>}/>
          <Route path='/men' element={<ShopCategory banner={men_banner} category="men"/>}/>
          <Route path='/women' element={<ShopCategory banner={women_banner} category="women"/>}/>
          <Route path='/kids' element={<ShopCategory banner={kids_banner} category="kid"/>}/>
          <Route path="product" element={<Product/>}>
            <Route path=':productId' element={<Product/>}/>
          </Route>
          <Route path='/cart' element={<Cart/>}/>
          <Route path='/login' element={<LoginSignup/>}/>
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
        <Footer/>
        
        
        
        </BrowserRouter>

    </div>
  );
}

export default App;
