import React, { Component } from 'react';
import {Root} from 'native-base';
import { createStackNavigator } from 'react-navigation';
import HomeScreen from "./src/screens/HomeScreen";
import DetailScreen from "./src/screens/DetailScreen";


const AppNavigationStack = createStackNavigator(
    {
        Home: {
            screen: HomeScreen
        },
        Details: {
            screen: DetailScreen
        }
    },
    {
        initialRouteName: 'Home',
        navigationOptions: {
            title: 'Simply Weather',

            headerStyle: {
                backgroundColor: '#f4511e',
                paddingLeft: 10,
                paddingRight: 15
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            }
        }
    });


export default class App extends Component {
    constructor(){
        super();
    }

  render() {
    return (
        <Root>
            <AppNavigationStack />
        </Root>
    );
  }
}


