import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  return (
    <>
    <div className="main">
      <div className="navbar">
        <div className="head_items logo">
          <img src="https://dwc6ndmngc4q3.cloudfront.net/20241024151519/assets/images/logo.png" width="95" alt="logo" />
        </div>
        <div className="head_items search">
          <p style={{ textTransform: 'uppercase' }}>delivery</p>
          <span>Showing Default Loca..</span>
          <div className="dropdown">
            <i className="fa-solid fa-angle-down"></i>
          </div>
        </div>

        <div className="head_items last">
          <div className="item">
            <img
              src="https://dwc6ndmngc4q3.cloudfront.net/20241024151519/assets/images/eatclub.svg"
              alt=""
            />
            Eatclub
          </div>
          <div className="line">|</div>
          <div className="item">
            <img src="/discount.png" width="20" alt="" />
            <pre> Deals </pre>
            <i className="fa-solid fa-angle-down"></i>
          </div>
          <div className="line">|</div>
          <div className="item cart">
            <i className="fa-solid fa-cart-shopping"></i>
            <pre> Cart</pre>
          </div>
          <div className="line">|</div>
          <div className="item">
            <img src="/avatar.png" width="20" alt="" />
            <pre> Sign in</pre>
          </div>
        </div>
      </div>

      <div className="photos">
        <div className="photo1">
          <img src="" alt="" />
        </div>
        <div className="photo2">
          <img src="" alt="" />
        </div>
        <div className="photo3">
          <img src="" alt="" />
        </div>
        <div className="photo4">
          <img src="" alt="" />
        </div>
      </div>

      <div className="sym1">
        <i className="fa-solid fa-less-than"></i>
      </div>
      <div className="sym2">
        <i className="fa-solid fa-greater-than"></i>
      </div>

      <div className="brads">
        <div className="heading">
          <h2>Popular Brands</h2>
          <p>Order food from our curated list of handpicked brands.</p>
        </div>
      </div>

      <div className="boxes">
        <div className="c">
          <div className="box i"></div>
          <div className="box ii r"></div>
          <div className="box iii r"></div>
        </div>
        <div className="c">
          <div className="box iv"></div>
          <div className="box v r"></div>
          <div className="box vi r"></div>
        </div>
        <div className="c">
          <div className="box vii"></div>
          <div className="box viii r"></div>
          <div className="box ix r"></div>
        </div>
        <div className="c">
          <div className="box x"></div>
          <div className="box xi r"></div>
          <div className="box xii r"></div>
        </div>
      </div>

      <div className="lastbox">
        <div className="end">
          <p>Start your free trial.</p>
          <p>Join EatClub @ ₹0</p>
          <div className="download">
            <div className="android">
              <img src="/android.png" width="150" height="45px" alt="" />
            </div>
            <div className="ios">
              <img src="/apple.png" width="150" height="45px" alt="" />
            </div>
          </div>
        </div>
        <div className="phone">
          <img src="/phone.png" width="350" alt="" />
        </div>
      </div>

      <div className="blueline"></div>

      <div className="footer">
        <div className="footer1">
          <div className="details1">
            <h5>EatClub</h5>
            <p>
              Getting food delivered at home is always a great idea. But the whole episode of scrolling endlessly,
              scanning restaurant ratings, hunting for coupon codes...now that’s not fun at all. So, here’s the
              smarter way out with EatClub!
            </p>
            <p>
              A membership program that takes you straight to a no-nonsense, curated selection of restaurants. Get
              unlimited savings with 30% OFF every time on all restaurants and NO extra charges on delivery,
              packaging, or surge.
            </p>
            <p>One membership, many benefits!</p>
          </div>
          <div className="details2">
            <h6>COMPANY</h6>
            <p>About Us</p>
          </div>
          <div className="details3">
            <h6>GET HELP</h6>
            <p>Contact us</p>
            <p>Help & Support</p>
            <p>Delivery Policies</p>
            <p>Privacy Policies</p>
            <p>Disclaimers</p>
          </div>
          <div className="details4">
            <h6>EXPLORE</h6>
            <p>Offers</p>
            <p>Bulk Order</p>
          </div>
        </div>

        <div className="footer2">
          <div className="details5">
            <p>Copyright 2020 - 2024. EatClub Brands Pvt. Ltd. All rights reserved. v5.18.1-0</p>
          </div>
          <div className="details6">
            <div className="logos">
              <i className="fa-brands fa-instagram"></i>
            </div>
            <div className="logos">
              <i className="fa-brands fa-facebook-f"></i>
            </div>
            <div className="logos">
              <i className="fa-brands fa-twitter"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
 


export default App;

    </>
  )
}

export default App
