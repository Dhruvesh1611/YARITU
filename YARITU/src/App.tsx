import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Collection from './pages/Collection';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import OfferSection from './pages/OfferSection';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-ivory">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/offers" element={<OfferSection />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
