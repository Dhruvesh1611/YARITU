import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, Facebook, Instagram, Twitter } from 'lucide-react';
import { motion } from 'framer-motion';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [focusedField, setFocusedField] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission here
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Visit Us',
      details: ['123 Wedding Street', 'Fashion District, Mumbai 400001'],
      color: 'text-gold',
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: ['+91 98765 43210', '+91 98765 43211'],
      color: 'text-maroon',
    },
    {
      icon: Mail,
      title: 'Email Us',
      details: ['info@yaritu.com', 'support@yaritu.com'],
      color: 'text-gold',
    },
    {
      icon: Clock,
      title: 'Business Hours',
      details: ['Mon - Sat: 10:00 AM - 8:00 PM', 'Sun: 12:00 PM - 6:00 PM'],
      color: 'text-maroon',
    },
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', name: 'Facebook', color: 'hover:text-blue-600' },
    { icon: Instagram, href: '#', name: 'Instagram', color: 'hover:text-pink-600' },
    { icon: Twitter, href: '#', name: 'Twitter', color: 'hover:text-blue-400' },
  ];

  return (
    <div className="pt-20 min-h-screen bg-ivory">
      {/* Header */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-serif text-4xl md:text-5xl font-bold text-charcoal mb-6"
          >
            Get in <span className="text-gold">Touch</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-sans text-xl text-gray-600 max-w-2xl mx-auto"
          >
            We'd love to hear from you. Let's create something beautiful together.
          </motion.p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-white p-8 rounded-2xl shadow-lg"
            >
              <h2 className="font-serif text-3xl font-bold text-charcoal mb-8">
                Send us a Message
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField('')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-300 peer"
                      placeholder=" "
                      required
                    />
                    <label className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                      focusedField === 'name' || formData.name
                        ? '-top-2 text-sm text-gold bg-white px-2'
                        : 'top-3 text-gray-500'
                    }`}>
                      Full Name
                    </label>
                  </div>

                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField('')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-300"
                      placeholder=" "
                      required
                    />
                    <label className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                      focusedField === 'email' || formData.email
                        ? '-top-2 text-sm text-gold bg-white px-2'
                        : 'top-3 text-gray-500'
                    }`}>
                      Email Address
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('phone')}
                      onBlur={() => setFocusedField('')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-300"
                      placeholder=" "
                    />
                    <label className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                      focusedField === 'phone' || formData.phone
                        ? '-top-2 text-sm text-gold bg-white px-2'
                        : 'top-3 text-gray-500'
                    }`}>
                      Phone Number
                    </label>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('subject')}
                      onBlur={() => setFocusedField('')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-300"
                      placeholder=" "
                      required
                    />
                    <label className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                      focusedField === 'subject' || formData.subject
                        ? '-top-2 text-sm text-gold bg-white px-2'
                        : 'top-3 text-gray-500'
                    }`}>
                      Subject
                    </label>
                  </div>
                </div>

                <div className="relative">
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('message')}
                    onBlur={() => setFocusedField('')}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-300 resize-none"
                    placeholder=" "
                    required
                  />
                  <label className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                    focusedField === 'message' || formData.message
                      ? '-top-2 text-sm text-gold bg-white px-2'
                      : 'top-3 text-gray-500'
                  }`}>
                    Your Message
                  </label>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="w-full bg-gold text-charcoal px-8 py-4 font-sans font-semibold rounded-lg hover:bg-gold-light transition-colors duration-300 flex items-center justify-center space-x-2"
                >
                  <Send className="h-5 w-5" />
                  <span>Send Message</span>
                </motion.button>
              </form>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-8"
            >
              <div>
                <h2 className="font-serif text-3xl font-bold text-charcoal mb-8">
                  Contact Information
                </h2>
                
                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <motion.div
                      key={info.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                      className="flex items-start space-x-4"
                    >
                      <div className={`flex-shrink-0 p-3 rounded-lg bg-gold/10`}>
                        <info.icon className={`h-6 w-6 ${info.color}`} />
                      </div>
                      <div>
                        <h3 className="font-serif text-xl font-semibold text-charcoal mb-2">
                          {info.title}
                        </h3>
                        {info.details.map((detail, idx) => (
                          <p key={idx} className="font-sans text-gray-600">
                            {detail}
                          </p>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Social Media */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="bg-white p-8 rounded-2xl shadow-lg"
              >
                <h3 className="font-serif text-2xl font-bold text-charcoal mb-6">
                  Connect With Us
                </h3>
                <div className="flex space-x-4">
                  {socialLinks.map(({ icon: Icon, href, name, color }) => (
                    <motion.a
                      key={name}
                      href={href}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`p-3 bg-gray-100 rounded-full text-gray-600 ${color} transition-all duration-300 hover:shadow-lg`}
                    >
                      <Icon className="h-6 w-6" />
                    </motion.a>
                  ))}
                </div>
                <p className="font-sans text-sm text-gray-600 mt-4">
                  Follow us for the latest updates and exclusive offers
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;