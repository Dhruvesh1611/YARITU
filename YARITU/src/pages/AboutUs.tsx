
import { MapPin, Users, Award, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const AboutUs = () => {
  const stats = [
    { icon: Users, number: '10,000+', label: 'Happy Clients' },
    { icon: Award, number: '25+', label: 'Awards Won' },
    { icon: MapPin, number: '50+', label: 'Cities Served' },
    { icon: Heart, number: '15+', label: 'Years of Excellence' },
  ];

  const storeLocations = [
    { city: 'Mumbai', address: '123 Wedding Street, Bandra West', phone: '+91 98765 43210' },
    { city: 'Delhi', address: '456 Fashion Avenue, CP', phone: '+91 98765 43211' },
    { city: 'Bangalore', address: '789 Style Boulevard, Koramangala', phone: '+91 98765 43212' },
    { city: 'Chennai', address: '321 Designer Lane, T. Nagar', phone: '+91 98765 43213' },
  ];

  return (
    <div className="pt-20 min-h-screen bg-ivory">
      {/* Hero Section */}
      <section className="relative py-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-charcoal mb-6">
                Our <span className="text-gold">Story</span>
              </h1>
              <p className="font-sans text-lg text-gray-600 leading-relaxed mb-6">
                Founded in 2010, Yaritu began as a dream to create timeless wedding attire that celebrates love, tradition, and elegance. What started as a small boutique in Mumbai has grown into one of India's most trusted premium wedding clothing brands.
              </p>
              <p className="font-sans text-lg text-gray-600 leading-relaxed mb-8">
                Our master craftsmen combine traditional techniques with contemporary design, ensuring each piece is a work of art that tells your unique love story.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gold text-charcoal px-8 py-4 font-sans font-semibold rounded-full hover:bg-gold-light transition-colors duration-300"
              >
                Discover Our Journey
              </motion.button>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <img
                src="https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Our Story"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-gold/20 rounded-full animate-float" />
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-maroon/20 rounded-full animate-float" style={{ animationDelay: '1s' }} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-charcoal text-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">
              Our <span className="text-gold">Achievements</span>
            </h2>
            <p className="font-sans text-xl text-gray-300 max-w-2xl mx-auto">
              Numbers that reflect our commitment to excellence
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gold/20 rounded-full mb-4 group-hover:bg-gold/30 transition-colors duration-300">
                  <stat.icon className="h-8 w-8 text-gold" />
                </div>
                <h3 className="font-serif text-3xl font-bold text-gold mb-2">
                  {stat.number}
                </h3>
                <p className="font-sans text-gray-300">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <h2 className="font-serif text-4xl font-bold text-charcoal mb-6">
                Our <span className="text-gold">Mission</span>
              </h2>
              <p className="font-sans text-lg text-gray-600 leading-relaxed">
                To craft exceptional wedding attire that embodies the rich heritage of Indian craftsmanship while embracing contemporary elegance. We strive to make every couple's special day unforgettable through our dedication to quality, artistry, and personalized service.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center lg:text-left"
            >
              <h2 className="font-serif text-4xl font-bold text-charcoal mb-6">
                Our <span className="text-gold">Vision</span>
              </h2>
              <p className="font-sans text-lg text-gray-600 leading-relaxed">
                To become the global leader in luxury wedding fashion, setting new standards of excellence in design, craftsmanship, and customer experience. We envision a world where every celebration is adorned with the finest artistry and timeless beauty.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Store Locations */}
      <section className="py-20 bg-ivory">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-charcoal mb-6">
              Visit Our <span className="text-gold">Stores</span>
            </h2>
            <p className="font-sans text-xl text-gray-600 max-w-2xl mx-auto">
              Experience our collections firsthand at our premium boutiques
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {storeLocations.map((store, index) => (
              <motion.div
                key={store.city}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <MapPin className="h-8 w-8 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-charcoal mb-2">
                      {store.city}
                    </h3>
                    <p className="font-sans text-gray-600 mb-2">{store.address}</p>
                    <p className="font-sans text-gold font-semibold">{store.phone}</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="mt-4 bg-charcoal text-white px-6 py-2 rounded-full font-sans font-medium hover:bg-charcoal/90 transition-colors duration-300"
                    >
                      Get Directions
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Map Placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-16 bg-white rounded-2xl overflow-hidden shadow-lg"
          >
            <div className="h-96 bg-gradient-to-br from-gold/20 to-maroon/20 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-16 w-16 text-gold mx-auto mb-4" />
                <p className="font-sans text-xl text-charcoal">Interactive Map Coming Soon</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;