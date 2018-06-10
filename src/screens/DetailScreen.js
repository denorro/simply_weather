import React, {Component} from 'react';
import {StyleSheet, View, Dimensions} from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import {Container, Content, Text, Thumbnail, Icon, H3, Toast, Spinner} from 'native-base';
import moment from 'moment';
import RetroMapStyles from '../../MapStyles/RetroMapStyles.json';
import AppConstants from "../config/AppConstants";
import CitySearchForm from "../components/CitySearchForm";
import {capitalizeFirstLetter, getFromStorage, parseURL, saveToStorage} from "../helpers/Helper";

let {height, width} = Dimensions.get('window');
const API_URL = AppConstants.OpenWeatherRootURL;
const API_KEY = AppConstants.OpenWeatherApiKey;
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

class DetailScreen extends Component {

    static navigationOptions = ({navigation}) => {
        const tempLocal = navigation.getParam('location').name;
        return {
            headerLeft: <Icon name="list"
                              style={{color: '#FFF'}}
                              onPress={() => navigation.navigate('Home')} />,
            headerRight: <Icon name="add"
                               style={{color: '#FFF'}}
                               onPress={() => navigation.state.params.saveCityToList(tempLocal)} />
        };
    }

    constructor(props){
        super(props);
        this.state = {
            isLoading: false
        }
    }

    componentDidMount(){
        this.props.navigation.setParams({
            saveCityToList: this.saveCityToList
        })
    }

    viewCity = (city) => {
        this.setState({isLoading: true});
        fetch(parseURL(API_URL + city) + API_KEY)
            .then(results => results.json())
            .then(data => {
                if(data.cod !== 200){
                    throw `${data.message}`
                }
                this.setState({isLoading: false});
                this.props.navigation.navigate('Details', {location: data});
            })
            .catch(error => {
                Toast.show({
                    text: capitalizeFirstLetter(error),
                    buttonText: 'OK',
                    duration: AppConstants.TOAST_DURATION
                });
                this.setState({isLoading: false});
            })
    }

     saveCityToList = async (newCity) => {
            let savedCities = await getFromStorage(AppConstants.SAVED_CITIES);
            if(typeof savedCities === 'string'){
                savedCities = JSON.parse(savedCities);
            }
            //If there are already saved cities, then concat
            if(savedCities !== null || savedCities === undefined){
                //check to see if city already saved
                const cityAlreadySaved = savedCities.find(city => city === newCity);
                //if city is already in the saved list, then do nothing
                if(cityAlreadySaved){
                    Toast.show({
                        text: 'City is already saved in your list!',
                        buttonText: "Okay",
                        duration: AppConstants.TOAST_DURATION
                    });
                    return;
                }
                let updatedList = [...savedCities, newCity];
                await saveToStorage(AppConstants.SAVED_CITIES, JSON.stringify(updatedList));
                Toast.show({
                    text: `${newCity} has been saved to your favorites!`,
                    buttonText: 'OK',
                    duration: 5000
                })
            }
            else{
                let newList = [newCity];
                const strNewList = JSON.stringify(newList);
                await saveToStorage(AppConstants.SAVED_CITIES, strNewList );
                Toast.show({
                    text: `${newCity} has been saved to your favorites!`,
                    buttonText: 'OK',
                    duration: 5000
                })
            }
    }

    render() {

        const city = {...this.props.navigation.getParam('location')};
        const icon = city.weather[city.weather.length - 1].icon + '.png';
        const imageURL = AppConstants.OpenWeatherImageURL + icon;
        const screenContent = this.state.isLoading ?
            <Content padder>
                <Spinner animating={this.state.isLoading} hidesWhenStopped={true} color={AppConstants.AppColor} />
            </Content> :
            <Content padder>
                    <CitySearchForm viewCity={this.viewCity} />
                    <H3 style={styles.TextMiddle}>
                        {city.name}
                    </H3>
                    <Text note style={styles.TextMiddle}>
                        Geo: {city.coord.lat},{city.coord.lon}
                    </Text>
                    <Text note style={styles.TextMiddle}>
                        {`Sunrise/Sunset: ${moment.unix(city.sys.sunrise).format("h:mm:ss A")}/${moment.unix(city.sys.sunset).format("h:mm:ss A")}`}
                    </Text>
                    <View style={{flexDirection:'row', justifyContent: 'center', alignItems: 'center'}}>
                        <Thumbnail large
                                   size={100}
                                   source={{uri: imageURL}}
                        />
                        <Text style={[styles.TextMiddle]}>
                            {capitalizeFirstLetter(city.weather[city.weather.length - 1].description)}
                        </Text>

                    </View>
                    <Text style={[styles.TextMiddle, styles.mb5]}>{`Current Temperature: ${city.main.temp} °F`}</Text>
                    <Text style={[styles.TextMiddle, styles.mb5]}>{`Humidity: ${city.main.humidity} %`}</Text>
                    <MapView
                        style={ styles.map }
                        customMapStyle={ RetroMapStyles }
                        initialRegion={{
                            latitude: city.coord.lat,
                            longitude: city.coord.lon,
                            latitudeDelta: LATITUDE_DELTA,
                            longitudeDelta: LONGITUDE_DELTA,
                        }}
                    />
            </Content>

        return (
            <Container>
                {screenContent}
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    TextMiddle: {
        textAlign: 'center'
    },
    mb5: {
        marginBottom: 5
    },
    map: {
        width: '100%',
        height: height * 0.5
    }
})
export default DetailScreen;