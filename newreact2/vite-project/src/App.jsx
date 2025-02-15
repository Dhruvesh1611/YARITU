import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  

  return (
    <>
      
    <div className="main">
      {/* First Page */}
      <div className="firstpage">
        <div className="nevbar">
          <div className="menu">
            <i className="fa-solid fa-bars"></i>
            <pre>
              <p12> MENU</p12>
            </pre>
          </div>
          <div className="logo">
            <img src="https://www.eurocity.gi/wp-content/uploads/2018/02/Rolls-Royce-RR-logo-1920x1080.png" width="60" alt="Rolls Royce Logo" />
          </div>
          <div className="search">
            <i className="fa-solid fa-magnifying-glass"></i>
            <pre> FIND A DEALER</pre>
          </div>
        </div>
        <div className="line"></div>
        <div className="text">
          <p1>‘This is Gold, Mr. Bond.’</p1>
          <p2>AURIC GOLDFINGER</p2>
        </div>
      </div>

      {/* Second Page */}
      <div className="secondpage">
        <div className="nevbar">
          <div className="menu">
            <i className="fa-solid fa-bars"></i>
            <pre>
              <p12> MENU</p12>
            </pre>
          </div>
          <div className="logo">
            <img src="/rrlogo.png" width="60" alt="Rolls Royce Logo" />
          </div>
          <div className="search">
            <i className="fa-solid fa-magnifying-glass"></i>
            <pre> FIND A DEALER</pre>
          </div>
        </div>
        <div className="text">
          <p3>‘All my life, I've been in </p3>
          <p3>love with its colour, </p3>
          <p3>its brilliance,</p3>
          <p3>its divine heaviness.’</p3>
          <p2>AURIC GOLDFINGER</p2>
        </div>
      </div>

      {/* Third Page */}
      <div className="thirdpage">
        <div className="nevbar2"></div>
        <div className="text">
          <p4>PHANTOM</p4>
          <p5>GOLDFINGER</p5>
        </div>
        <div className="discover">
          <div className="button">
            <h5>DISCOVER NOW</h5>
          </div>
        </div>
      </div>

      {/* Explore Section */}
      <div className="explore">
        <p6>EXPLORE FURTHER</p6>
        <p7>CONTINUE YOUR JOURNEY</p7>
      </div>

      {/* Photos Section */}
      <div className="photos">
        <div className="c1">
          <div className="photo1"></div>
          <div className="text1">
            <div className="border">
              <p8>INSPIRING GREATNESS SERIES</p8>
              <p9>
                In this exploratory series from Rolls-Royce lies a
              </p9>
              <p9>
                collection of aspirational stories from those who
              </p9>
              <p9> the boundaries of greatness.</p9>
            </div>
          </div>
        </div>
        <div className="c1">
          <div className="photo2"></div>
          <div className="text2">
            <div className="border">
              <p8>PHANTOM EXTENDED</p8>
              <p9>
                Serenity awaits with Phantom Extended — the
              </p9>
              <p9>pinnacle Rolls-Royce realised through master</p9>
              <p9> craftsmanship.</p9>
            </div>
          </div>
        </div>
        <div className="c3">
          <div className="photo3"></div>
          <div className="text3">
            <div className="border">
              <p8>Discover Bespoke</p8>
              <p9>Choose from our exclusive collections or</p9>
              <p9>collaborate with our craftspeople and designers to</p9>
              <p9> create a Rolls-Royce wholly unique to you. This is</p9>
              <p9> Rolls-Royce Bespoke.</p9>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="footer">
        <div className="first">
          <p10>ROLLS-ROYCE </p10>
          <p11>MOTOR CARS</p11>
        </div>
        <div className="second">
          <div className="r1">
            <p>Pre-owned</p>
            <p>EU tyre labels</p>
            <p>Whispers</p>
          </div>
          <div className="r2">
            <p>Cookies</p>
            <p>Battery Regulation</p>
            <p>Language</p>
          </div>
          <div className="r3">
            <p>Pressclub</p>
            <p>Contact</p>
          </div>
          <div className="r4">
            <p>Legal</p>
            <p>Privacy</p>
          </div>
          <div className="r5">
            <p>Careers</p>
            <p>Complaints</p>
          </div>
          <div className="r6">
            <p>Find a dealer</p>
            <p>Site Map</p>
          </div>
        </div>
        <div className="third">
          <div className="logos">
            <div className="y">
              <i className="fa-brands fa-youtube" style={{ color: "#ffffff" }}></i>
            </div>
            <div className="f">
              <i className="fa-brands fa-square-facebook" style={{ color: "#ffffff" }}></i>
            </div>
            <div className="i">
              <i className="fa-brands fa-instagram" style={{ color: "#ffffff" }}></i>
            </div>
            <div className="l">
              <i className="fa-brands fa-linkedin" style={{ color: "#ffffff" }}></i>
            </div>
            <div className="t">
              <i className="fa-brands fa-twitter" style={{ color: "#ffffff" }}></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    </>
  )
}

export default App
