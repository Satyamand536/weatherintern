import React, { useState, useEffect } from 'react';
import { Search, MapPin, Thermometer, Wind, Droplets, Eye, Sun, Moon, Gauge, AlertCircle, RefreshCw } from 'lucide-react';

// Weather data hook
const useWeatherData = (city = 'London') => {
  const [weatherData, setWeatherData] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [hourlyForecast, setHourlyForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock data for demonstration
  const mockWeatherData = {
    location: city,
    country: 'GB',
    temperature: 22,
    feelsLike: 25,
    description: 'Partly cloudy',
    humidity: 65,
    windSpeed: 3.5,
    pressure: 1013,
    visibility: 10,
    uvIndex: 6,
    sunrise: '06:30',
    sunset: '20:15',
    icon: '02d'
  };

  const mockForecast = [
    { date: '2024-01-15', day: 'Today', high: 24, low: 18, description: 'Partly cloudy', icon: '02d', humidity: 65, windSpeed: 3.5 },
    { date: '2024-01-16', day: 'Tomorrow', high: 26, low: 20, description: 'Sunny', icon: '01d', humidity: 55, windSpeed: 2.8 },
    { date: '2024-01-17', day: 'Wednesday', high: 23, low: 17, description: 'Light rain', icon: '10d', humidity: 78, windSpeed: 4.2 },
    { date: '2024-01-18', day: 'Thursday', high: 21, low: 15, description: 'Cloudy', icon: '04d', humidity: 70, windSpeed: 3.8 },
    { date: '2024-01-19', day: 'Friday', high: 25, low: 19, description: 'Partly cloudy', icon: '02d', humidity: 60, windSpeed: 3.2 }
  ];

  const mockHourlyForecast = [
    { time: '12:00', temperature: 22, icon: '02d', description: 'Partly cloudy' },
    { time: '13:00', temperature: 23, icon: '02d', description: 'Partly cloudy' },
    { time: '14:00', temperature: 24, icon: '01d', description: 'Sunny' },
    { time: '15:00', temperature: 25, icon: '01d', description: 'Sunny' },
    { time: '16:00', temperature: 24, icon: '02d', description: 'Partly cloudy' },
    { time: '17:00', temperature: 23, icon: '02d', description: 'Partly cloudy' },
    { time: '18:00', temperature: 22, icon: '03d', description: 'Cloudy' },
    { time: '19:00', temperature: 21, icon: '03d', description: 'Cloudy' },
  ];

  useEffect(() => {
    const fetchWeatherData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setWeatherData({ ...mockWeatherData, location: city });
        setForecast(mockForecast);
        setHourlyForecast(mockHourlyForecast);
      } catch (err) {
        setError('Failed to fetch weather data');
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [city]);

  const refetch = () => {
    setWeatherData(null);
    setForecast([]);
    setHourlyForecast([]);
  };

  return { weatherData, forecast, hourlyForecast, loading, error, refetch };
};

// Utility functions
const getWeatherIcon = (iconCode) => {
  const iconMap = {
    '01d': '☀️', '01n': '🌙', '02d': '🌤️', '02n': '☁️', '03d': '☁️', '03n': '☁️',
    '04d': '☁️', '04n': '☁️', '09d': '🌧️', '09n': '🌧️', '10d': '🌦️', '10n': '🌧️',
    '11d': '⛈️', '11n': '⛈️', '13d': '🌨️', '13n': '🌨️', '50d': '🌫️', '50n': '🌫️',
  };
  return iconMap[iconCode] || '🌤️';
};

const celsiusToFahrenheit = (celsius) => Math.round((celsius * 9/5) + 32);
const mpsToKmh = (mps) => Math.round(mps * 3.6);

// Animated Counter Component
const AnimatedCounter = ({ value, duration = 1000, suffix = '', prefix = '' }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime = null;
    const startValue = displayValue;
    const endValue = parseFloat(value) || 0;

    const animate = (currentTime) => {
      if (startTime === null) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = startValue + (endValue - startValue) * easeOutQuart;
      
      setDisplayValue(Math.round(currentValue));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return <span className="tabular-nums">{prefix}{displayValue}{suffix}</span>;
};

// Search Bar Component
const SearchBar = ({ onSearch, currentLocation }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setQuery('');
    }
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => onSearch('Current Location'),
        (error) => console.error('Error getting location:', error)
      );
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-8 animate-fade-in-up animation-delay-400">
      <form onSubmit={handleSubmit} className="flex-1 relative group">
        <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-all duration-300 ${isFocused ? 'text-purple-400 scale-110' : 'text-gray-400'}`} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search for a city..."
          className="w-full pl-12 pr-4 py-3 bg-gray-800/50 backdrop-blur-md rounded-2xl border border-gray-600/50 text-white placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 focus:bg-gray-800/70 focus:scale-105 focus:shadow-lg focus:shadow-purple-500/20 hover:bg-gray-800/60 hover:border-purple-500/30"
        />
      </form>
      
      <button
        type="button"
        onClick={handleCurrentLocation}
        className="flex items-center gap-2 px-6 py-3 bg-gray-800/50 backdrop-blur-md rounded-2xl border border-cyan-500/30 text-white transition-all duration-300 hover:bg-cyan-500/20 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/20 active:scale-95 group"
      >
        <MapPin className="w-5 h-5 group-hover:animate-bounce text-cyan-400" />
        <span className="hidden sm:inline">Current Location</span>
      </button>
    </div>
  );
};

// Weather Card Component
const WeatherCard = ({ data, unit }) => {
  const temperature = unit === 'celsius' ? data.temperature : celsiusToFahrenheit(data.temperature);
  const feelsLike = unit === 'celsius' ? data.feelsLike : celsiusToFahrenheit(data.feelsLike);
  const tempUnit = unit === 'celsius' ? '°C' : '°F';

  return (
    <div className="bg-gray-900/50 backdrop-blur-md rounded-3xl p-8 border border-gray-700/50 shadow-xl hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <div className="mb-6 lg:mb-0">
          <h2 className="text-3xl font-bold text-white mb-2 animate-fade-in-up">
            {data.location}, {data.country}
          </h2>
          <p className="text-gray-300 text-lg capitalize animate-fade-in-up animation-delay-200">{data.description}</p>
        </div>
        
        <div className="text-center lg:text-right animate-fade-in-up animation-delay-400">
          <div className="text-7xl mb-4 animate-float">{getWeatherIcon(data.icon)}</div>
          <div className="text-6xl font-bold text-white mb-2 animate-scale-in animation-delay-600">
            <AnimatedCounter value={temperature} suffix={tempUnit} />
          </div>
          <p className="text-gray-300 text-lg animate-fade-in-up animation-delay-800">
            Feels like <AnimatedCounter value={feelsLike} suffix={tempUnit} />
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: Wind, label: 'Wind Speed', value: mpsToKmh(data.windSpeed), suffix: ' km/h', color: 'cyan' },
          { icon: Droplets, label: 'Humidity', value: data.humidity, suffix: '%', color: 'blue' },
          { icon: Eye, label: 'Visibility', value: data.visibility, suffix: ' km', color: 'purple' },
          { icon: Gauge, label: 'Pressure', value: data.pressure, suffix: ' hPa', color: 'green' }
        ].map((item, index) => (
          <div 
            key={item.label}
            className="bg-gray-800/50 rounded-2xl p-4 text-center animate-fade-in-up border border-gray-700/30 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
            style={{ animationDelay: `${1000 + index * 200}ms` }}
          >
            <item.icon className="w-6 h-6 text-gray-300 mx-auto mb-2 animate-float" />
            <p className="text-gray-400 text-sm">{item.label}</p>
            <p className="text-white text-lg font-semibold">
              <AnimatedCounter value={item.value} suffix={item.suffix} />
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6 mt-6">
        <div className="bg-gray-800/50 rounded-2xl p-4 text-center animate-fade-in-up animation-delay-1800 border border-gray-700/30 hover:border-orange-500/30 hover:shadow-lg hover:shadow-orange-500/20 transition-all duration-300">
          <Sun className="w-6 h-6 text-orange-400 mx-auto mb-2 animate-pulse-gentle" />
          <p className="text-gray-400 text-sm">Sunrise</p>
          <p className="text-white text-lg font-semibold">{data.sunrise}</p>
        </div>
        
        <div className="bg-gray-800/50 rounded-2xl p-4 text-center animate-fade-in-up animation-delay-2000 border border-gray-700/30 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300">
          <Moon className="w-6 h-6 text-purple-400 mx-auto mb-2 animate-pulse-gentle" />
          <p className="text-gray-400 text-sm">Sunset</p>
          <p className="text-white text-lg font-semibold">{data.sunset}</p>
        </div>
      </div>
    </div>
  );
};

// Hourly Forecast Component
const HourlyForecast = ({ data, unit }) => {
  return (
    <div className="bg-gray-900/50 backdrop-blur-md rounded-3xl p-6 border border-gray-700/50 shadow-xl hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500">
      <h3 className="text-2xl font-bold text-white mb-6 animate-fade-in-up">Hourly Forecast</h3>
      
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {data.map((hour, index) => {
          const temperature = unit === 'celsius' ? hour.temperature : celsiusToFahrenheit(hour.temperature);
          const tempUnit = unit === 'celsius' ? '°C' : '°F';
          
          return (
            <div
              key={index}
              className="flex-shrink-0 bg-gray-800/50 rounded-2xl p-4 text-center min-w-[100px] transform transition-all duration-500 hover:scale-110 hover:bg-gray-800/70 animate-slide-in-right border border-gray-700/30 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/20"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <p className="text-gray-400 text-sm mb-2 animate-fade-in">{hour.time}</p>
              <div className="mb-2 text-3xl animate-float">{getWeatherIcon(hour.icon)}</div>
              <p className="text-white text-lg font-semibold animate-scale-in animation-delay-300">
                <AnimatedCounter value={temperature} suffix={tempUnit} />
              </p>
              <p className="text-gray-500 text-xs mt-1 capitalize animate-fade-in animation-delay-500">
                {hour.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Weekly Forecast Component
const WeeklyForecast = ({ data, unit }) => {
  return (
    <div className="bg-gray-900/50 backdrop-blur-md rounded-3xl p-6 border border-gray-700/50 shadow-xl hover:shadow-2xl hover:shadow-pink-500/20 transition-all duration-500">
      <h3 className="text-2xl font-bold text-white mb-6 animate-fade-in-up">5-Day Forecast</h3>
      
      <div className="space-y-4">
        {data.map((day, index) => {
          const high = unit === 'celsius' ? day.high : celsiusToFahrenheit(day.high);
          const low = unit === 'celsius' ? day.low : celsiusToFahrenheit(day.low);
          const tempUnit = unit === 'celsius' ? '°C' : '°F';
          
          return (
            <div
              key={index}
              className="bg-gray-800/50 rounded-2xl p-4 flex items-center justify-between hover:bg-gray-800/70 transition-all duration-300 hover:scale-105 transform hover:shadow-lg hover:shadow-cyan-500/20 border border-gray-700/30 animate-slide-in-left hover:border-cyan-500/30"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="flex items-center gap-4">
                <div className="animate-float text-3xl" style={{ animationDelay: `${index * 200}ms` }}>
                  {getWeatherIcon(day.icon)}
                </div>
                <div>
                  <p className="text-white font-semibold text-lg animate-fade-in-up">{day.day}</p>
                  <p className="text-gray-400 text-sm capitalize animate-fade-in-up animation-delay-200">{day.description}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="hidden sm:flex items-center gap-4 text-gray-400">
                  <div className="flex items-center gap-1 animate-fade-in animation-delay-400">
                    <Droplets className="w-4 h-4 animate-pulse-gentle text-blue-400" />
                    <span className="text-sm"><AnimatedCounter value={day.humidity} suffix="%" /></span>
                  </div>
                  <div className="flex items-center gap-1 animate-fade-in animation-delay-600">
                    <Wind className="w-4 h-4 animate-sway text-cyan-400" />
                    <span className="text-sm"><AnimatedCounter value={mpsToKmh(day.windSpeed)} suffix=" km/h" /></span>
                  </div>
                </div>
                
                <div className="text-right animate-scale-in animation-delay-800">
                  <div className="text-white font-semibold text-lg">
                    <AnimatedCounter value={high} suffix={tempUnit} />
                  </div>
                  <div className="text-gray-400 text-sm">
                    <AnimatedCounter value={low} suffix={tempUnit} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Loading Spinner Component
const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-gray-700/50 border-t-purple-500 rounded-full animate-spin"></div>
        <div className="absolute top-2 left-2 w-16 h-16 border-4 border-gray-600/50 border-b-cyan-500 rounded-full animate-spin-reverse"></div>
        <div className="absolute top-4 left-4 w-12 h-12 border-4 border-gray-500/50 border-l-pink-500 rounded-full animate-spin"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full animate-pulse"></div>
        </div>
      </div>
      <div className="absolute mt-32 text-white text-lg font-medium animate-pulse">
        Loading weather data...
      </div>
    </div>
  );
};

// Error Message Component
const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-gray-900/50 backdrop-blur-md rounded-3xl p-8 border border-gray-700/50 text-center max-w-md animate-scale-in">
        <div className="animate-shake">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-4 animate-fade-in-up animation-delay-200">
          Oops! Something went wrong
        </h3>
        <p className="text-gray-300 mb-6 animate-fade-in-up animation-delay-400">{message}</p>
        <button
          onClick={onRetry}
          className="flex items-center gap-2 mx-auto px-6 py-3 bg-gray-800/50 backdrop-blur-md rounded-2xl border border-red-500/30 text-white transition-all duration-300 hover:bg-red-500/20 hover:scale-105 hover:shadow-lg hover:shadow-red-500/20 active:scale-95 group animate-fade-in-up animation-delay-600"
        >
          <RefreshCw className="w-5 h-5 group-hover:animate-spin text-red-400" />
          Try Again
        </button>
      </div>
    </div>
  );
};

// Main App Component
function App() {
  const [city, setCity] = useState('London');
  const [unit, setUnit] = useState('celsius');
  const { weatherData, forecast, hourlyForecast, loading, error, refetch } = useWeatherData(city);

  const handleSearch = (newCity) => {
    setCity(newCity);
  };

  const toggleUnit = () => {
    setUnit(unit === 'celsius' ? 'fahrenheit' : 'celsius');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-black/40"></div>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-black/40"></div>
        <ErrorMessage message={error} onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden transition-all duration-1000">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-black/40"></div>
      
      {/* Floating orbs with neon colors */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-full blur-3xl animate-float animation-delay-1000"></div>
      <div className="absolute top-3/4 left-1/3 w-48 h-48 bg-gradient-to-r from-pink-500/10 to-orange-500/10 rounded-full blur-3xl animate-float animation-delay-2000"></div>
      
      {/* Aurora effect with neon colors */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-purple-400/20 via-transparent to-cyan-400/20 animate-aurora"></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 flex items-center justify-center gap-3 animate-fade-in-up">
            <div className="p-3 bg-gradient-to-r from-purple-500/30 to-cyan-500/30 rounded-2xl backdrop-blur-md border border-purple-500/30 animate-float">
              ☀️
            </div>
            <span className="animate-gradient-text bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
              WeatherPro
            </span>
          </h1>
          <p className="text-gray-300 text-lg animate-fade-in-up animation-delay-200">
            Beautiful weather, beautifully presented
          </p>
        </header>

        {/* Search Bar */}
        <SearchBar onSearch={handleSearch} currentLocation={city} />

        {/* Unit Toggle */}
        <div className="flex justify-center mb-8 animate-fade-in-up animation-delay-600">
          <button
            onClick={toggleUnit}
            className="flex items-center gap-2 px-6 py-3 bg-gray-800/50 backdrop-blur-md rounded-2xl border border-purple-500/30 text-white transition-all duration-300 hover:bg-purple-500/20 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20 active:scale-95 group"
          >
            <Thermometer className="w-5 h-5 group-hover:animate-bounce text-purple-400" />
            <span className="font-medium">
              {unit === 'celsius' ? '°C' : '°F'}
            </span>
          </button>
        </div>

        {/* Weather Content */}
        {weatherData && (
          <div className="space-y-8">
            <div className="animate-fade-in-up animation-delay-800">
              <WeatherCard data={weatherData} unit={unit} />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="animate-slide-in-left animation-delay-1000">
                <HourlyForecast data={hourlyForecast} unit={unit} />
              </div>
              <div className="animate-slide-in-right animation-delay-1200">
                <WeeklyForecast data={forecast} unit={unit} />
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-400 animate-fade-in animation-delay-1400">
          <p>&copy; 2025 WeatherPro. Crafted with care for weather enthusiasts.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;