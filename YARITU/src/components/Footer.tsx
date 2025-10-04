// import React from 'react';
import { Crown, MapPin, Phone, Mail, Facebook, Instagram, Twitter } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
  const socialLinks = [
    { icon: Facebook, href: '#', name: 'Facebook' },
    { icon: Instagram, href: '#', name: 'Instagram' },
    { icon: Twitter, href: '#', name: 'Twitter' },
  ];

  return (
    <footer className="bg-charcoal text-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <div className="flex items-center space-x-2">
              <Crown className="h-8 w-8 text-gold" />
              <span className="font-serif text-2xl font-bold">Yaritu</span>
            </div>
            <p className="font-sans text-sm text-gray-300 leading-relaxed">
              Creating timeless elegance for your most precious moments. Premium wedding clothing that celebrates love and tradition.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-4"
          >
            <h3 className="font-serif text-lg font-semibold text-gold">Quick Links</h3>
            <ul className="space-y-2 font-sans text-sm">
              {['Home', 'Collection', 'About Us', 'Contact Us', 'Offers'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-300 hover:text-gold transition-colors duration-300">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            <h3 className="font-serif text-lg font-semibold text-gold">Contact Info</h3>
            <div className="space-y-3 font-sans text-sm">
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-gold mt-1 flex-shrink-0" />
                <span className="text-gray-300">
                  123 Wedding Street, Fashion District, Mumbai 400001
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-gold flex-shrink-0" />
                <span className="text-gray-300">+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-gold flex-shrink-0" />
                <span className="text-gray-300">info@yaritu.com</span>
              </div>
            </div>
          </motion.div>

          {/* Social Media */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-4"
          >
            <h3 className="font-serif text-lg font-semibold text-gold">Follow Us</h3>
            <div className="flex space-x-4">
              {socialLinks.map(({ icon: Icon, href, name }) => (
                <a
                  key={name}
                  href={href}
                  className="p-2 bg-gold/20 rounded-full hover:bg-gold hover:text-charcoal transition-all duration-300 transform hover:scale-110"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
            <p className="font-sans text-xs text-gray-400">
              Stay updated with our latest collections and exclusive offers.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="border-t border-gray-700 mt-8 pt-8 text-center"
        >
          <p className="font-sans text-sm text-gray-400">
            © 2025 Yaritu. All rights reserved. | Crafted with love for your special day.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;