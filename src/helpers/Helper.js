import {AsyncStorage} from "react-native";
import {Toast} from "native-base";
import AppConstants from "../config/AppConstants";

export function parseURL(url){
    return (url.includes(' ')) ? url.replace(' ', '%20') : url;
}

export function capitalizeFirstLetter(text){
    let firstLetter = text.substring(0, 1);
    firstLetter = firstLetter.toUpperCase();
    return firstLetter + text.substring(1);
}

export async function getFromStorage(key){
    try{
        let retrievedItem = await AsyncStorage.getItem(key);
        let item = JSON.parse(retrievedItem);
        return item;
    }
    catch(error){
        console.log('Async Get Failed: ', error);
    }
    return;
}

export async function saveToStorage(key, item){
    try{
        const tempItem = JSON.stringify(item);
        let jsonItem = await AsyncStorage.setItem(key, tempItem);
        return jsonItem;
    }
    catch(error){
        console.log('Async Saved Failed: ', error);
    }
    return;
}

export async function searchCityByName(city){
    return await fetch(parseURL(AppConstants.OpenWeatherCityURL + city) + AppConstants.OpenWeatherApiKey)
        .then(results => results.json())
        .then(data => {
            this.setState({
                readings: [...this.state.readings, data]
            })
        })
        .catch(error => console.log(error))
}

export async function searchCityByCoordinates(lat, lon){
    return await fetch(`${AppConstants.OpenWeatherCoordURL}&lat=${lat}&lon=${lon}${AppConstants.OpenWeatherApiKey}`)
        .then(results => results.json())
        .then(data => {
            return data;
        })
        .catch(error => {
            Toast.show({
                text: error,
                buttonText: 'OK',
                duration: 3000
            })
            return null;
        })
}
