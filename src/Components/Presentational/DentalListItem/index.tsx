import React from 'react';
import Styled from 'styled-components/native';
import {
    TouchableWithoutFeedback
} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const Container = Styled.View`
width: ${wp('100%')};
height: ${wp('50%')};
padding: 20px;
background-color: #ffffff;
border-bottom-width: 2px;
border-color: #eeeeee;
`;

const DentalNameText = Styled.Text`
font-weight: bold;
font-size: 20px;
`;

const DentalAddressText = Styled.Text`
margin-top: 5px;
font-size: 17px;
color: #cccccc;
`;

interface Prop {
    name: string,
    address: string,
    navigation: any,
    route: any
}

const DentalListItem = ({name, address, navigation, route}: Prop) => {

    const moveToDentalDetail = () => {
        navigation.navigate("DentalDetailScreen")
    }

    return (
        <TouchableWithoutFeedback onPress={() => moveToDentalDetail()}>
        <Container>
            <DentalNameText>{name}</DentalNameText>
            <DentalAddressText>{address}</DentalAddressText>
        </Container>
        </TouchableWithoutFeedback>
    )
}

export default DentalListItem
