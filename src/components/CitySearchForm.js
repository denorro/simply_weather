import React, {Component} from 'react';
import {View} from 'react-native';
import {withNavigation} from 'react-navigation';
import {Item, Input, Icon, Text, Button, Toast} from 'native-base';
import AppConstants from '../config/AppConstants';

class CitySearchForm extends Component{
    constructor(props){
        super(props);
        this.state = {
            city: ''
        }
    }

    searchCity = () => {
        const city = this.state.city;
        if(city === ''){
            Toast.show({
                text: 'Enter the name of the city you wish to search...',
                buttonText: "Okay",
                duration: AppConstants.TOAST_DURATION
            });
        }
        else{
            this.setState({city: ''});
            this.props.viewCity(city);
        }
    }

    render() {
        return (
            <View style={{marginBottom: 10}}>
                <Item>
                    <Icon name='globe'/>
                    <Input placeholder='Search City...'
                           value={this.state.city}
                           onChangeText={text => this.setState({city:text})} />
                    <Icon name="close" onPress={() => this.setState({city: ''})}/>
                </Item>
                <Button
                    small
                    block outline bordered
                    style={{marginTop: 10, backgroundColor: 'white', borderColor: AppConstants.AppColor}}
                    onPress={this.searchCity}>
                    <Text style={{color: AppConstants.AppColor}}>Search</Text>
                </Button>
            </View>
        )
    }
}
export default withNavigation(CitySearchForm);