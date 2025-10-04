import { useState } from 'react';
import { Filter, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const Collection = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedGender, setSelectedGender] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = {
    men: ['Blazer', 'Suit', 'Kurta', 'Sherwani', 'Dhoti', 'Nehru Jacket'],
    women: ['Saree', 'Chaniya Choli', 'Lehenga', 'Gown', 'Anarkali', 'Sharara'],
  };

  const products = [
    { id: 1, name: 'Royal Red Lehenga', category: 'Lehenga', gender: 'women', price: '₹45,000', image: 'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { id: 2, name: 'Designer Sherwani', category: 'Sherwani', gender: 'men', price: '₹35,000', image: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { id: 3, name: 'Silk Saree', category: 'Saree', gender: 'women', price: '₹28,000', image: 'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { id: 4, name: 'Premium Suit', category: 'Suit', gender: 'men', price: '₹22,000', image: 'https://images.pexels.com/photos/1674666/pexels-photo-1674666.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { id: 5, name: 'Bridal Gown', category: 'Gown', gender: 'women', price: '₹55,000', image: 'https://images.pexels.com/photos/1125328/pexels-photo-1125328.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { id: 6, name: 'Silk Kurta', category: 'Kurta', gender: 'men', price: '₹18,000', image: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { id: 7, name: 'Chaniya Choli Set', category: 'Chaniya Choli', gender: 'women', price: '₹32,000', image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { id: 8, name: 'Wedding Blazer', category: 'Blazer', gender: 'men', price: '₹25,000', image: 'https://images.pexels.com/photos/1321909/pexels-photo-1321909.jpeg?auto=compress&cs=tinysrgb&w=400' },
  ];

  const filteredProducts = products.filter((product) => {
    const matchesGender = selectedGender === 'all' || product.gender === selectedGender;
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesGender && matchesCategory && matchesSearch;
  });

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
            Our <span className="text-gold">Collection</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-sans text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Discover our exquisite range of wedding attire for every special occasion
          </motion.p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            {/* Search */}
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-gold focus:border-transparent"
              />
            </div>

            {/* Gender Filter */}
            <div className="flex items-center space-x-4">
              <span className="font-sans font-medium text-charcoal">Gender:</span>
              <div className="flex space-x-2">
                {['all', 'men', 'women'].map((gender) => (
                  <button
                    key={gender}
                    onClick={() => setSelectedGender(gender)}
                    className={`px-4 py-2 rounded-full font-sans font-medium transition-colors duration-300 ${
                      selectedGender === gender
                        ? 'bg-gold text-charcoal'
                        : 'bg-gray-100 text-charcoal hover:bg-gold/20'
                    }`}
                  >
                    {gender.charAt(0).toUpperCase() + gender.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Category Filters */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full font-sans font-medium transition-colors duration-300 ${
                selectedCategory === 'all'
                  ? 'bg-gold text-charcoal'
                  : 'bg-gray-100 text-charcoal hover:bg-gold/20'
              }`}
            >
              All Categories
            </button>
            {(selectedGender === 'all' 
              ? [...categories.men, ...categories.women] 
              : categories[selectedGender as keyof typeof categories] || []
            ).map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full font-sans font-medium transition-colors duration-300 ${
                  selectedCategory === category
                    ? 'bg-gold text-charcoal'
                    : 'bg-gray-100 text-charcoal hover:bg-gold/20'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-gold text-charcoal px-3 py-1 rounded-full text-sm font-sans font-medium">
                      {product.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-xl font-semibold text-charcoal mb-2">
                    {product.name}
                  </h3>
                  <p className="font-sans text-2xl font-bold text-gold mb-4">
                    {product.price}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full bg-charcoal text-white px-4 py-3 rounded-full font-sans font-medium hover:bg-charcoal/90 transition-colors duration-300"
                  >
                    View Details
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <Filter className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="font-sans text-xl text-gray-500">
                No products found matching your criteria
              </p>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Collection;