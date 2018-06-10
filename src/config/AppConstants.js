const AppConstants = {
    OpenWeatherApiKey: '&appid=eb0ecaa19e421f5e691c839551fe4793',
    OpenWeatherCityURL: 'https://api.openweathermap.org/data/2.5/weather?&units=imperial&type=accurate&q=',
    OpenWeatherCoordURL: 'https://api.openweathermap.org/data/2.5/weather?&units=imperial&type=accurate&',
    OpenWeatherImageURL:'https://openweathermap.org/img/w/',
    DefaultWeatherIconWeb: 'http://images.clipartpanda.com/weather-clip-art-inclement_weather_Vector_Clipart.png',
    DefaultWeatherIconProj: require('SimplyWeather/src/images/weather-clip.png'),
    AppColor: '#f4511e',
    SAVED_CITIES: '@SAVED_CITIES',
    TOAST_DURATION: 3000,
    LATITUDE_DELTA: 0.0922
}
export default AppConstants;