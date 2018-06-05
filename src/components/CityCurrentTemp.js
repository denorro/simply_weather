import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {ListItem, Text, Thumbnail, Body, Right, Icon, ActionSheet} from 'native-base';
import AppConstants from '../config/AppConstants';

const DELETE = 0;
const CANCEL = 1;

class CityCurrentTemp extends Component{
    constructor(props){
        super(props);
    }

    trashCity = () => {
        ActionSheet.show(
            {
                options: ['Delete', 'Cancel'],
                destructiveButtonIndex: DELETE,
                cancelButtonIndex: CANCEL,
                title: `Delete ${this.props.city} from your favorites?`
            },
            buttonIndex => {
                if(buttonIndex == DELETE){
                    this.props.trashCity(this.props.city);
                }
            }
        )
    }

    viewCity = () => {
        this.props.viewCity(this.props.city);
    }

    render() {
        const imageURL = AppConstants.OpenWeatherImageURL + this.props.icon + '.png';
        return (
            <ListItem>
                <Thumbnail square
                           size={100}
                           source={{uri: imageURL}}/>
                <Body>
                    <Text>{this.props.city}</Text>
                    <Text note>Temp: {this.props.tempCurrent} °F</Text>
                    <Text note>{`Forecast: ${this.props.description} `}</Text>
                </Body>
                <Right>
                    <Icon name="eye"
                          style={{color: '#f4511e', fontSize: 30}}
                          onPress={this.viewCity}/>
                </Right>
                <Right>
                    <Icon name="trash"
                          style={{color: '#f4511e', fontSize: 30}}
                          onPress={this.trashCity}/>
                </Right>
            </ListItem>
        )
    }
}

CityCurrentTemp.propType = {
    city: PropTypes.string,
    icon: PropTypes.string,
    description: PropTypes.string,
    tempCurrent: PropTypes.number,
    tempHi: PropTypes.number,
    tempLo: PropTypes.number,
    timeStamp: PropTypes.number
}

CityCurrentTemp.defaultProps = {
    icon: AppConstants.DefaultWeatherIconProj
}
export default CityCurrentTemp;