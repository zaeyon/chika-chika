import React from 'react';
import Styled from 'styled-components/native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const Container = Styled.View`
flex: 1;
background-color: #ffffff;
`;

const HeaderBar = Styled.View`
 width: ${wp('100%')}px;
 height: ${wp('13.8%')}px;
 flex-direction: row;
 align-items: center;
 justify-content: space-between;
 background-color:#ffffff;
 border-bottom-width: 1px;
 border-color: #f0f0f0;
`;

const HeaderLeftContainer = Styled.View`
height: ${wp('13.8%')}px;
padding: 0px 16px 0px 16px;
align-items: center;
justify-content: center;
flex-direction: row;
`;

const HeaderEmptyContainer = Styled.View`
width: ${wp('6.4%')};
height: ${wp('6.4%')};
`;

const HeaderBackIcon = Styled.Image`
width: ${wp('6.4%')};
height: ${wp('6.4%')};
`;

const HeaderTitleText = Styled.Text`
margin-top: 5px;
`;

const HeaderRightContainer = Styled.View`
height: ${wp('13.8%')}px;
padding: 0px 16px 0px 16px;
 align-items: center;
 justify-content: center;
 flex-direction: row;
`;

const HeaderCloseIcon = Styled.Image`
width: ${wp('6.4%')};
height: ${wp('6.4%')};
`;

const BodyContainer = Styled.View`
flex: 1;
`;

const SymptomReportScreen = ({}) => {
    return (
        <Container>
            <HeaderBar>
                <HeaderLeftContainer>
                    <HeaderEmptyContainer/>
                </HeaderLeftContainer>
                <HeaderTitleText>증상</HeaderTitleText>
                <HeaderRightContainer>
                    <HeaderCloseIcon
                    source={require('~/Assets/Images/HeaderBar/ic_X.png')}/>
                </HeaderRightContainer>
            </HeaderBar>
            <BodyContainer>
            </BodyContainer>
        </Container>
    )
}

export default SymptomReportScreen;