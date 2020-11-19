import React, {useState, useEffect} from 'react';
import Styled from 'styled-components/native';
import {TouchableWithoutFeedback, FlatList, ScrollView} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {isIphoneX} from 'react-native-iphone-x-helper';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

// Local Component
import TimerTabScreen from '~/Components/Container/TeethCareScreen/TimerTabScreen';
import AITabScreen from '~/Components/Container/TeethCareScreen/AITabScreen';
import ReportTabScreen from '~/Components/Container/TeethCareScreen/ReportTabScreen';

const Container = Styled.SafeAreaView`
 flex: 1;
 background-color: #FFFFFF;
`;

const HeaderBar = Styled.View`
 width: ${wp('100%')}px;
 height: ${wp('11.7%')}px;
 flex-direction: row;
 align-items: center;
 justify-content: space-between;
 background-color:#ffffff;
`;


const HeaderLeftContainer = Styled.View`
padding: 7px 16px 13px 15px;
 align-items: center;
 justify-content: center;
 flex-direction: row;
`;

const HeaderTitleText = Styled.Text`
 
`;

const HeaderRightContainer = Styled.View`
padding: 7px 16px 13px 15px;
 align-items: center;
 justify-content: center;
 flex-direction: row;
`;

const HeaderEmptyContainer = Styled.View`
width: ${wp('6.4%')};
height: ${wp('6.4%')};
`;

const BodyContainer = Styled.View`
flex: 1;
`;

const TimerTabContainer = Styled.View`
flex: 1;
background-color: #ffffff;
`;

const AiTabContainer = Styled.View`
flex: 1;
backgorund-color: #ffffff;
`;

const ReportTabContainer = Styled.View`
flex: 1;
background-color: #ffffff;
`;




interface Props {
    navigation: any,
    route: any,
}

const TeethCareScreen = ({navigation, route}: Props) => {

    const TeethCareTab = createMaterialTopTabNavigator();

    return (
        <Container>
            <BodyContainer>
                <TeethCareTab.Navigator
                tabBarOptions={{
                    labelStyle: {fontSize: 18, fontWeight: "700", color: "#000000"},
                    tabStyle: {width: 75},
                    indicatorStyle: {backgroundColor: "#000000", height: 2.5}
                }}>
                    <TeethCareTab.Screen name="타이머" component={TimerTabScreen}/>
                    <TeethCareTab.Screen name="AI" component={AITabScreen}/>
                    <TeethCareTab.Screen name="리포트" component={ReportTabScreen}/>
                </TeethCareTab.Navigator>
            </BodyContainer>
        </Container>
    )
}

export default TeethCareScreen


