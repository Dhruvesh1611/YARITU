import { useState, useEffect } from 'react';
import { Gift, Star, Crown } from 'lucide-react';
import { motion } from 'framer-motion';

const OfferSection = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 15,
    hours: 8,
    minutes: 42,
    seconds: 30,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const offers = [
    {
      id: 1,
      title: 'Wedding Season Special',
      discount: '40% OFF',
      description: 'On all bridal lehengas and sherwanis',
      validUntil: 'Valid until March 31, 2025',
      image: 'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=500',
      color: 'from-gold to-gold-light',
    },
    {
      id: 2,
      title: 'Couple Combo Deal',
      discount: '₹20,000 OFF',
      description: 'When you buy both bride & groom outfits',
      validUntil: 'Limited time offer',
      image: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=500',
      color: 'from-maroon to-red-600',
    },
    {
      id: 3,
      title: 'Festival Collection',
      discount: '25% OFF',
      description: 'On ethnic wear for all occasions',
      validUntil: 'Ends February 28, 2025',
      image: 'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=500',
      color: 'from-purple-600 to-purple-800',
    },
  ];

  const exclusiveDeals = [
    {
      icon: Crown,
      title: 'VIP Membership',
      benefit: 'Get 15% extra discount on all purchases',
      action: 'Join Now',
    },
    {
      icon: Gift,
      title: 'Free Alterations',
      benefit: 'Complimentary alterations with every purchase',
      action: 'Learn More',
    },
    {
      icon: Star,
      title: 'Early Bird Access',
      benefit: 'Get first access to new collections',
      action: 'Subscribe',
    },
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
            Exclusive <span className="text-gold">Offers</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-sans text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Don't miss out on our limited-time deals and special promotions
          </motion.p>
        </div>
      </section>

      {/* Countdown Timer */}
      <section className="py-16 bg-gradient-to-r from-gold to-gold-light">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-charcoal mb-4">
              🔥 Flash Sale Ending Soon!
            </h2>
            <p className="font-sans text-lg text-charcoal/80 mb-8">
              Up to 50% off on selected items
            </p>

            <div className="flex justify-center space-x-4 md:space-x-8">
              {Object.entries(timeLeft).map(([unit, value]) => (
                <motion.div
                  key={unit}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="bg-white rounded-lg p-4 md:p-6 shadow-lg"
                >
                  <div className="font-serif text-2xl md:text-4xl font-bold text-charcoal">
                    {value.toString().padStart(2, '0')}
                  </div>
                  <div className="font-sans text-sm md:text-base text-gray-600 capitalize">
                    {unit}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Offers */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-4xl font-bold text-charcoal mb-6">
              Featured <span className="text-gold">Deals</span>
            </h2>
            <p className="font-sans text-xl text-gray-600 max-w-2xl mx-auto">
              Handpicked offers just for you
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {offers.map((offer, index) => (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="relative">
                  <img
                    src={offer.image}
                    alt={offer.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className={`absolute top-4 right-4 bg-gradient-to-r ${offer.color} text-white px-4 py-2 rounded-full font-sans font-bold text-sm`}>
                    {offer.discount}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-serif text-2xl font-bold text-charcoal mb-3">
                    {offer.title}
                  </h3>
                  <p className="font-sans text-gray-600 mb-3">
                    {offer.description}
                  </p>
                  <p className="font-sans text-sm text-gold font-semibold mb-4">
                    {offer.validUntil}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full bg-charcoal text-white px-6 py-3 rounded-full font-sans font-semibold hover:bg-charcoal/90 transition-colors duration-300"
                  >
                    Claim Offer
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Exclusive Deals */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-4xl font-bold text-charcoal mb-6">
              Exclusive <span className="text-gold">Benefits</span>
            </h2>
            <p className="font-sans text-xl text-gray-600 max-w-2xl mx-auto">
              Join our premium membership for exclusive perks
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {exclusiveDeals.map((deal, index) => (
              <motion.div
                key={deal.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center bg-ivory p-8 rounded-2xl hover:shadow-lg transition-shadow duration-300"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gold/20 rounded-full mb-6">
                  <deal.icon className="h-8 w-8 text-gold" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-charcoal mb-4">
                  {deal.title}
                </h3>
                <p className="font-sans text-gray-600 mb-6">
                  {deal.benefit}
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gold text-charcoal px-6 py-3 rounded-full font-sans font-semibold hover:bg-gold-light transition-colors duration-300"
                >
                  {deal.action}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 bg-charcoal text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-serif text-4xl font-bold mb-6">
              Never Miss a <span className="text-gold">Deal</span>
            </h2>
            <p className="font-sans text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter and get exclusive offers delivered to your inbox
            </p>

            <div className="max-w-md mx-auto flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-l-full text-charcoal focus:outline-none focus:ring-2 focus:ring-gold"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gold text-charcoal px-8 py-4 rounded-r-full font-sans font-semibold hover:bg-gold-light transition-colors duration-300"
              >
                Subscribe
              </motion.button>
            </div>

            <p className="font-sans text-sm text-gray-400 mt-4">
              Join 10,000+ happy subscribers and get 10% off your first purchase
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default OfferSection;