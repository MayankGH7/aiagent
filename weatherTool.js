function getWeather(city) {
  if (city === "Delhi") {
    return "rainy";
  } else {
    return "sunny";
  }
}

export default getWeather;