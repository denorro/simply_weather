import React, { Component } from 'react';
import {AsyncStorage} from 'react-native';
import {Container, Content, List, Icon, Toast, Spinner, ActionSheet} from 'native-base';
import AppData from '../data/AppData';
import AppConstants from '../config/AppConstants';
import CityCurrentTemp from "../components/CityCurrentTemp";
import {
    capitalizeFirstLetter,
    getFromStorage,
    parseURL,
    saveToStorage,
    searchCityByCoordinates
} from "../helpers/Helper";
import CitySearchForm from "../components/CitySearchForm";

const API_URL = AppConstants.OpenWeatherCityURL;
const API_KEY = AppConstants.OpenWeatherApiKey;
const DELETE = 0;
const CANCEL = 1;

class HomeScreen extends Component {

    static navigationOptions = ({navigation}) => {
        return {
            headerLeft: <Icon name="trash"
                              style={{color: 'white'}}
                              onPress={() => navigation.state.params.trashAllCities()} />,
            headerRight: <Icon name="refresh"
                               style={{color: 'white'}}
                               onPress={() => navigation.state.params.refresh()} />
        }
    }

    constructor(props){
        super(props);
        this.state = {
            readings: [],
            isLoading: false,
            currentPosition: {
                latitude: 0.00,
                longitude: 0.00
            },
            localWeatherReading: {}
        }

    }

    async componentDidMount(){
        this.props.navigation.setParams({
            trashAllCities: this.trashAllCities,
            refresh: this.refresh
        });
        await this.populateWeatherReadings();
        await navigator.geolocation.getCurrentPosition(position => {
                console.log(position);
                searchCityByCoordinates(position.coords.latitude, position.coords.longitude)
                    .then(results => console.log(results));

            },
            error => {
                console.log(error)
            },
            {
                timeout: 5000,
                enableHighAccuracy: true
            });
    }

    trashAllCities = () => {
        ActionSheet.show(
            {
                options: ['Delete All', 'Cancel'],
                destructiveButtonIndex: DELETE,
                cancelButtonIndex: CANCEL,
                title: 'Delete all cities from your favorites?'
            },
            buttonIndex => {
                if(buttonIndex == DELETE){
                    AsyncStorage.clear();
                    Toast.show({
                        text: 'All cities have been deleted from your saved list!',
                        buttonText: 'OK',
                        duration: AppConstants.TOAST_DURATION
                    });
                    this.populateWeatherReadings();
                }
            }
        )
    }

    refresh = () => {
       this.populateWeatherReadings();
    }

    populateWeatherReadings = async () => {
        this.setState({isLoading: true, readings: []});
        let savedList = await getFromStorage(AppConstants.SAVED_CITIES);
        if(typeof savedList === 'string'){
            savedList = JSON.parse(savedList);
        }
        if(savedList === null || savedList.length < 1) {
            await AppData.mainCityList.forEach(city => {
                fetch(parseURL(API_URL + city.name) + API_KEY)
                    .then(results => results.json())
                    .then(data => {
                        this.setState({
                            readings: [...this.state.readings, data]
                        })
                    })
                    .catch(error => console.log(error))
            });
            this.setState({isLoading: false});
        }
        else{
            await savedList.forEach(city => {
                fetch(parseURL(API_URL + city) + API_KEY)
                    .then(results => results.json())
                    .then(data => {
                        this.setState({
                            readings: [...this.state.readings, data]
                        })
                    })
                    .catch(error => console.log(error))
            });
            this.setState({isLoading: false});
        }
    }

    trashCity = async (city) => {
        Toast.show({
            text: `${city} has been removed from your favorites!`,
            buttonText: 'OK',
            duration: AppConstants.TOAST_DURATION
        })
        let savedList = await getFromStorage(AppConstants.SAVED_CITIES);
        if(typeof savedList === 'string'){
            savedList = JSON.parse(savedList);
        }
        const updatedList = savedList.filter(currentCity => currentCity !== city);
        const strUpdatedList = JSON.stringify(updatedList);
        await saveToStorage(AppConstants.SAVED_CITIES, strUpdatedList);
        this.populateWeatherReadings();
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

    render(){
        const screenContent = this.state.isLoading ?
            <Content padder>
                <Spinner animating={this.state.isLoading} hidesWhenStopped={true} color={AppConstants.AppColor} />
            </Content> :
            <Content padder>
                <CitySearchForm viewCity={this.viewCity}/>
                <List dataArray={this.state.readings}
                      renderRow={ city =>
                          <CityCurrentTemp
                              city={city.name}
                              icon={city.weather[city.weather.length - 1].icon}
                              description={city.weather[0].description}
                              tempCurrent={city.main.temp}
                              tempHi={city.main.temp_max}
                              tempLo={city.main.temp_min}
                              timeStamp={city.dt}
                              viewCity={this.viewCity}
                              trashCity={this.trashCity}
                          />
                      }>
                </List>
            </Content>
        return (
            <Container>
                {screenContent}
            </Container>
        )
    }
}
export default HomeScreen;