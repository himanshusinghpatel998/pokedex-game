import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
  const [featuredPokemon, setFeaturedPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Animation variants for consistent effects
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  useEffect(() => {
    const fetchFeaturedPokemon = async () => {
      try {
        // Get a random Pokémon ID (1-898)
        const randomId = Math.floor(Math.random() * 898) + 1;
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch Pokémon data');
        }
        
        const data = await response.json();
        
        setFeaturedPokemon({
          id: data.id,
          name: data.name,
          image: data.sprites.other['official-artwork'].front_default,
          types: data.types.map(typeInfo => typeInfo.type.name),
          stats: {
            hp: data.stats.find(stat => stat.stat.name === 'hp')?.base_stat,
            attack: data.stats.find(stat => stat.stat.name === 'attack')?.base_stat,
          }
        });
      } catch (err) {
        console.error('Error fetching featured Pokémon:', err);
        setError('Unable to load featured Pokémon. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedPokemon();
  }, []);

  // Helper function to get type-based color class
  const getTypeColorClass = (type) => {
    const typeColors = {
      fire: 'from-red-400 to-orange-500',
      water: 'from-blue-400 to-blue-600',
      grass: 'from-green-400 to-green-600',
      electric: 'from-yellow-300 to-yellow-500',
      psychic: 'from-pink-400 to-purple-500',
      fighting: 'from-red-600 to-red-800',
      poison: 'from-purple-400 to-purple-600',
      ground: 'from-amber-500 to-amber-700',
      flying: 'from-indigo-300 to-sky-400',
      bug: 'from-lime-400 to-lime-600',
      rock: 'from-stone-400 to-stone-600',
      ghost: 'from-violet-400 to-violet-600',
      dark: 'from-gray-600 to-gray-800',
      dragon: 'from-indigo-500 to-purple-600',
      steel: 'from-slate-400 to-slate-600',
      fairy: 'from-pink-300 to-pink-500',
      ice: 'from-cyan-300 to-cyan-500',
      normal: 'from-stone-300 to-stone-400'
    };
    
    return typeColors[type] || 'from-yellow-200 to-yellow-400';
  };

  // News items data
  const newsItems = [
    {
      title: "New Region Added to Game",
      date: "April 5, 2025",
      excerpt: "Explore the new Galar region with all your favorite Pokémon from Sword and Shield!",
      image: "/api/placeholder/300/200",
      tag: "Update"
    },
    {
      title: "Legendary Pokémon Event",
      date: "April 3, 2025",
      excerpt: "Don't miss our special event featuring legendary Pokémon from all generations.",
      image: "/api/placeholder/300/200",
      tag: "Event"
    }
  ];

  // Feature section data
  const features = [
    {
      title: "Complete Pokédex",
      description: "Browse all Pokémon with detailed stats, moves, and evolution chains.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500 dark:text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      ),
      color: "red"
    },
    {
      title: "Classic Games",
      description: "Play games inspired by the classic Pokémon titles from every generation.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "blue"
    },
    {
      title: "Trainer Chat",
      description: "Connect with fellow trainers, trade tips, and discuss strategy in real-time.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500 dark:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      color: "green"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-12 mb-20">
        <motion.div 
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5 }}
          className="flex-1 max-w-2xl"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-blue-600 dark:text-blue-400">
            Welcome to <span className="text-red-500">Poké</span>Game!
          </h1>
          <p className="text-lg md:text-xl mb-8 text-gray-700 dark:text-gray-300 leading-relaxed">
            Your ultimate destination to explore the Pokédex, play nostalgic games inspired by classic Pokémon titles, and connect with trainers from around the world!
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/pokedex" className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-full font-bold transition shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              Explore Pokédex
            </Link>
            <Link to="/game" className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-full font-bold transition shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              Play Game
            </Link>
            <Link to="/chat" className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-full font-bold transition shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              Chat Room
            </Link>
          </div>
        </motion.div>

        {/* Featured Pokémon */}
        <motion.div 
          variants={{
            hidden: { opacity: 0, scale: 0.9 },
            visible: { opacity: 1, scale: 1 }
          }}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex-1 flex justify-center"
        >
          {loading ? (
            <div className="w-72 h-72 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
          ) : error ? (
            <div className="text-center p-6 bg-red-100 dark:bg-red-900 rounded-lg">
              <p className="text-red-600 dark:text-red-300">{error}</p>
              <button 
                onClick={() => {
                  setLoading(true);
                  setError(null);
                  // Re-trigger effect by causing component re-render
                  setFeaturedPokemon(null);
                }}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Try Again
              </button>
            </div>
          ) : featuredPokemon && (
            <div className="relative">
              <div className={`absolute inset-0 bg-gradient-to-br ${getTypeColorClass(featuredPokemon.types[0])} rounded-full blur-xl opacity-70 dark:opacity-50 -z-10`}></div>
              <div className="relative p-8">
                <img 
                  src={featuredPokemon.image || "/api/placeholder/300/300"} 
                  alt={featuredPokemon.name} 
                  className="w-72 h-72 object-contain drop-shadow-xl"
                />
                <div className="mt-6 text-center">
                  <span className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-4 py-1 rounded-full text-sm font-medium">
                    Featured Pokémon
                  </span>
                  <h3 className="text-2xl font-bold mt-3 capitalize">{featuredPokemon.name}</h3>
                  <div className="flex justify-center gap-2 mt-2">
                    {featuredPokemon.types.map((type, index) => (
                      <span 
                        key={index}
                        className={`px-3 py-1 rounded-full text-sm font-medium text-white bg-gradient-to-r ${getTypeColorClass(type)}`}
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                  {featuredPokemon.stats && (
                    <div className="flex justify-center gap-4 mt-3">
                      <div className="flex items-center">
                        <span className="text-red-500 font-bold mr-1">HP:</span> 
                        <span>{featuredPokemon.stats.hp}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-orange-500 font-bold mr-1">ATK:</span> 
                        <span>{featuredPokemon.stats.attack}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Features Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="mb-20"
      >
        <h2 className="text-3xl font-bold mb-12 text-center">Discover What We Offer</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className={`bg-${feature.color}-100 dark:bg-${feature.color}-900 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6`}>
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Latest News Section */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Latest News</h2>
          <Link to="/news" className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium flex items-center">
            View all news
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {newsItems.map((news, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="relative">
                <img src={news.image} alt={news.title} className="w-full h-48 object-cover" />
                <span className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {news.tag}
                </span>
              </div>
              <div className="p-6">
                <span className="text-sm text-gray-500 dark:text-gray-400">{news.date}</span>
                <h3 className="text-xl font-bold mt-2">{news.title}</h3>
                <p className="mt-3 text-gray-600 dark:text-gray-400">{news.excerpt}</p>
                <button className="mt-4 flex items-center text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium group">
                  Read more 
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 group-hover:ml-2 transition-all" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Newsletter Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="mt-20 bg-blue-50 dark:bg-blue-900/30 p-8 md:p-12 rounded-2xl"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="md:w-2/3">
            <h3 className="text-2xl font-bold mb-3">Stay Updated</h3>
            <p className="text-gray-600 dark:text-gray-400">Subscribe to our newsletter to get the latest updates on new Pokémon, game features, and community events.</p>
          </div>
          <div className="md:w-1/3">
            <div className="flex">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="px-4 py-3 flex-grow rounded-l-lg border-y border-l border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-r-lg transition">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;