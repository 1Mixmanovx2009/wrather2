'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Home() {
  const [location, setLocation] = useState('Tashkent');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      try {
        const data = await fetch(`/api/weather?location=${encodeURIComponent(location)}&days=1`);
        const posts = await data.json();
        setWeatherData(posts);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
      setLoading(false);
    };
    fetchWeather();
  }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    const query = e.target.search.value.trim();
    if (query) {
      setLocation(query);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  if (!weatherData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center">
        <div className="text-white text-2xl">Error loading data</div>
      </div>
    );
  }

  const { location: loc, current, forecast } = weatherData;
  const tempF = (current.temp_c * 9/5) + 32;
  const hourly = forecast.forecastday[0].hour.slice(0, 24); // Next 24 hours

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      <div className="relative max-w-lg mx-auto">
        <div className="mb-4 text-center">
          <div className="bg-white bg-opacity-20 backdrop-blur-xl rounded-2xl shadow-lg p-3 inline-block">
            <p className="text-white text-sm opacity-70">Local Time</p>
            <p className="text-white text-3xl font-bold">{currentTime.toLocaleTimeString()}</p>
          </div>
        </div>
        <form onSubmit={handleSearch} className="mb-8 relative">
          <div className="relative">
            <input
              type="text"
              name="search"
              placeholder="Search for a city or country..."
              className="w-full p-4 pl-12 rounded-3xl bg-white bg-opacity-25 backdrop-blur-xl text-white placeholder-white placeholder-opacity-70 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-50 transition-all duration-300 shadow-lg"
            />
            <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </form>
        
        {!showDetails && (
        <div id='weather' className="bg-white bg-opacity-20 backdrop-blur-xl rounded-3xl shadow-2xl p-8 text-center mb-8 transform hover:scale-105 transition-all duration-300">
          <div className="mb-6">
            <img src={current.condition.icon} alt={current.condition.text} className="mx-auto w-28 h-28 drop-shadow-lg" />
            <h2 className="text-white text-7xl font-thin mt-4 drop-shadow-md">{Math.round(current.temp_c)}°C</h2>
            <p className="text-white text-xl opacity-90 drop-shadow-sm">{Math.round(tempF)}°F</p>
          </div>
          <div className="mb-4">
            <h1 className="text-white text-3xl font-bold drop-shadow-md">{loc.name}, {loc.country}</h1>
            <p className="text-white text-base opacity-80">Updated: {new Date(loc.localtime).toLocaleString()}</p>
          </div>
          <div className="grid grid-cols-2 gap-6 text-white mb-6">
            <div className="bg-white bg-opacity-15 rounded-2xl p-5 backdrop-blur-sm hover:bg-opacity-20 transition-all duration-300">
              <p className="text-sm opacity-80 uppercase tracking-wide">Wind</p>
              <p className="text-2xl font-semibold">{current.wind_kph} km/h</p>
            </div>
            <div className="bg-white bg-opacity-15 rounded-2xl p-5 backdrop-blur-sm hover:bg-opacity-20 transition-all duration-300">
              <p className="text-sm opacity-80 uppercase tracking-wide">Humidity</p>
              <p className="text-2xl font-semibold">{current.humidity}%</p>
            </div>
          </div>
          <div>
            <p className="text-white text-xl font-medium drop-shadow-sm">{current.condition.text}</p>
            <button id="weather" onClick={() => setShowDetails(!showDetails)} className="mt-4 bg-white bg-opacity-20 text-white px-6 py-2 rounded-full hover:bg-opacity-30 transition-all duration-300 shadow-lg">
              {showDetails ? 'Hide Full Details' : 'Show Full Details'}
            </button>
          </div>
        </div>
        )}
        <div className="bg-white bg-opacity-20 backdrop-blur-xl rounded-3xl shadow-2xl p-6 transform hover:scale-105 transition-all duration-300">
          <h3 className="text-white text-2xl font-bold mb-6 text-center drop-shadow-md">24-Hour Forecast</h3>
          <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
            {hourly.map((hour, index) => (
              <div key={index} className="flex-shrink-0 bg-white bg-opacity-15 rounded-2xl p-4 text-center min-w-[110px] backdrop-blur-sm hover:bg-opacity-25 transition-all duration-300 hover:scale-110">
                <p className="text-white text-sm font-medium">{new Date(hour.time).getHours()}:00</p>
                <img src={hour.condition.icon} alt={hour.condition.text} className="w-14 h-14 mx-auto my-3 drop-shadow-sm" />
                <p className="text-white text-xl font-bold">{Math.round(hour.temp_c)}°C</p>
              </div>
            ))}
          </div>
        </div>
        {showDetails && (
          <div className="mt-8 space-y-6">
            <button onClick={() => setShowDetails(false)} className="w-full bg-white bg-opacity-20 text-white px-6 py-2 rounded-full hover:bg-opacity-30 transition-all duration-300 shadow-lg mb-4">
              ← Back to Main View
            </button>
            <div className="bg-white bg-opacity-20 backdrop-blur-xl rounded-3xl shadow-2xl p-6 transform hover:scale-105 transition-all duration-300">
              <h3 className="text-white text-2xl font-bold mb-4 text-center drop-shadow-md">Location Details</h3>
              <div className="grid grid-cols-2 gap-4 text-white">
                <div><strong>Name:</strong> {loc.name}</div>
                <div><strong>Region:</strong> {loc.region}</div>
                <div><strong>Country:</strong> {loc.country}</div>
                <div><strong>Latitude:</strong> {loc.lat}</div>
                <div><strong>Longitude:</strong> {loc.lon}</div>
                <div><strong>Timezone:</strong> {loc.tz_id}</div>
                <div><strong>Local Time:</strong> {loc.localtime}</div>
              </div>
            </div>
            <div className="bg-white bg-opacity-20 backdrop-blur-xl rounded-3xl shadow-2xl p-6 transform hover:scale-105 transition-all duration-300">
              <h3 className="text-white text-2xl font-bold mb-4 text-center drop-shadow-md">Current Weather Details</h3>
              <div className="flex justify-center mb-4">
                <img src={current.condition.icon} alt={current.condition.text} className="w-20 h-20 drop-shadow-lg" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-white text-sm">
                <div><strong>Last Updated:</strong> {current.last_updated}</div>
                <div><strong>Temperature:</strong> {current.temp_c}°C / {current.temp_f}°F</div>
                <div><strong>Feels Like:</strong> {current.feelslike_c}°C / {current.feelslike_f}°F</div>
                <div><strong>Condition:</strong> {current.condition.text}</div>
                <div><strong>Wind:</strong> {current.wind_kph} km/h ({current.wind_dir})</div>
                <div><strong>Pressure:</strong> {current.pressure_mb} mb</div>
                <div><strong>Precipitation:</strong> {current.precip_mm} mm</div>
                <div><strong>Humidity:</strong> {current.humidity}%</div>
                <div><strong>Cloud:</strong> {current.cloud}%</div>
                <div><strong>Visibility:</strong> {current.vis_km} km</div>
                <div><strong>UV Index:</strong> {current.uv}</div>
                <div><strong>Gust:</strong> {current.gust_kph} km/h</div>
              </div>
            </div>
            <div className="bg-white bg-opacity-20 backdrop-blur-xl rounded-3xl shadow-2xl p-6 transform hover:scale-105 transition-all duration-300">
              <h3 className="text-white text-2xl font-bold mb-4 text-center drop-shadow-md">24-Hour Temperature Chart</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={hourly}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
                  <XAxis dataKey={(hour) => new Date(hour.time).getHours() + ':00'} stroke="white" />
                  <YAxis stroke="white" />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px' }} />
                  <Legend />
                  <Line type="monotone" dataKey="temp_c" stroke="#ff6b6b" name="Temperature (°C)" strokeWidth={2} dot={{ fill: '#ff6b6b' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white bg-opacity-20 backdrop-blur-xl rounded-3xl shadow-2xl p-6 transform hover:scale-105 transition-all duration-300">
              <h3 className="text-white text-2xl font-bold mb-4 text-center drop-shadow-md">24-Hour Humidity & Wind</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={hourly}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
                  <XAxis dataKey={(hour) => new Date(hour.time).getHours() + ':00'} stroke="white" />
                  <YAxis stroke="white" />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px' }} />
                  <Legend />
                  <Bar dataKey="humidity" fill="#4ecdc4" name="Humidity (%)" />
                  <Bar dataKey="wind_kph" fill="#ffd93d" name="Wind (km/h)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white bg-opacity-20 backdrop-blur-xl rounded-3xl shadow-2xl p-6 transform hover:scale-105 transition-all duration-300">
              <h3 className="text-white text-2xl font-bold mb-4 text-center drop-shadow-md">Forecast Details</h3>
              {forecast.forecastday.map((day, index) => (
                <div key={index} className="mb-6 bg-white bg-opacity-10 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-white text-xl font-semibold">{day.date}</h4>
                    <img src={day.day.condition.icon} alt={day.day.condition.text} className="w-16 h-16 drop-shadow-lg" />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-white text-sm mb-4">
                    <div className="bg-white bg-opacity-10 p-2 rounded-lg"><strong>Max Temp:</strong> {day.day.maxtemp_c}°C</div>
                    <div className="bg-white bg-opacity-10 p-2 rounded-lg"><strong>Min Temp:</strong> {day.day.mintemp_c}°C</div>
                    <div className="bg-white bg-opacity-10 p-2 rounded-lg"><strong>Avg Temp:</strong> {day.day.avgtemp_c}°C</div>
                    <div className="bg-white bg-opacity-10 p-2 rounded-lg"><strong>Max Wind:</strong> {day.day.maxwind_kph} km/h</div>
                    <div className="bg-white bg-opacity-10 p-2 rounded-lg"><strong>Total Precip:</strong> {day.day.totalprecip_mm} mm</div>
                    <div className="bg-white bg-opacity-10 p-2 rounded-lg"><strong>Avg Humidity:</strong> {day.day.avghumidity}%</div>
                    <div className="bg-white bg-opacity-10 p-2 rounded-lg"><strong>Chance of Rain:</strong> {day.day.daily_chance_of_rain}%</div>
                    <div className="bg-white bg-opacity-10 p-2 rounded-lg"><strong>UV:</strong> {day.day.uv}</div>
                  </div>
                  <div className="text-white text-sm mb-3">
                    <strong>Condition:</strong> {day.day.condition.text}
                  </div>
                  <div className="mt-4">
                    <h5 className="text-white text-lg font-medium mb-2">Astro</h5>
                    <div className="grid grid-cols-2 gap-2 text-white text-sm">
                      <div className="bg-white bg-opacity-10 p-2 rounded-lg">🌅 <strong>Sunrise:</strong> {day.astro.sunrise}</div>
                      <div className="bg-white bg-opacity-10 p-2 rounded-lg">🌇 <strong>Sunset:</strong> {day.astro.sunset}</div>
                      <div className="bg-white bg-opacity-10 p-2 rounded-lg">🌙 <strong>Moonrise:</strong> {day.astro.moonrise}</div>
                      <div className="bg-white bg-opacity-10 p-2 rounded-lg">🌙 <strong>Moonset:</strong> {day.astro.moonset}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}