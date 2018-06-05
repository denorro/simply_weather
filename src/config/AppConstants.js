const AppConstants = {
    OpenWeatherApiKey: '&appid=OPEN_WEATHER_API_KEY',
    OpenWeatherRootURL: 'https://api.openweathermap.org/data/2.5/weather?&units=imperial&type=accurate&q=',
    OpenWeatherImageURL:'https://openweathermap.org/img/w/',
    DefaultWeatherIconWeb: 'http://images.clipartpanda.com/weather-clip-art-inclement_weather_Vector_Clipart.png',
    DefaultWeatherIconProj: require('SimplyWeather/src/images/weather-clip.png'),
    AppColor: '#f4511e',
    SAVED_CITIES: '@SAVED_CITIES',
    TOAST_DURATION: 3000,
    LATITUDE_DELTA: 0.0922
}
export default AppConstants;