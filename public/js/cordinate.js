
let cordinate={};
const geocodeAddress = async (address) => {
  try {
    const response = await fetch(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(address)}&apiKey=3f73d72f6d0148459bb3db7a0f1e88e7`);
    const data = await response.json();

    if (data.features.length > 0) {
    //   const coords = data.features[0].geometry.coordinates;
    // //   console.log(data.features);
      return data.features[0].geometry;
      
    } else {
      throw new Error('No location found for the provided address.');
    }
  } catch (err) {
    console.error('Geocoding error:', err);
    return null;
  }
};
  
  

module.exports = 
    geocodeAddress

