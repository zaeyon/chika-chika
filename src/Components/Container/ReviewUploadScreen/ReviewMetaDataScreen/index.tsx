import React, {useState, useEffect} from 'react';
import Styled from 'styled-components/native';
import {TouchableWithoutFeedback} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { NavigationContainer } from '@react-navigation/native';

const Container = Styled.SafeAreaView`
 flex: 1;
 background-color: #FFFFFF;
 align-items: center;
`;

const HeaderBar = Styled.View`
 width: ${wp('100%')}px;
 height: ${wp('13.8%')}px;
 flex-direction: row;
 align-items: center;
 justify-content: space-between;
 background-color:#ffffff;
 border-bottom-width: 0.6px;
 border-color: #ECECEE;
`;


const HeaderLeftContainer = Styled.View`
padding: 7px 16px 13px 15px;
 align-items: center;
 justify-content: center;
 flex-direction: row;
`;

const HeaderBackIcon = Styled.Image`
width: ${wp('6.4%')};
height: ${wp('6.4%')};
`;

const HeaderTitleText = Styled.Text`
font-size: 18px;
color: #000000;
font-weight: bold
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
align-items: center;
padding-top: 39px;
`;

const TakePhotoText = Styled.Text`
`;

const GalleryText = Styled.Text`
margin-top: 30px;
`;

const MetaDataItemContainer = Styled.View`
width: ${wp('91.46%')};
height: ${wp('12.799%')};
background-color: #F0F6FC;
border-radius: 8px;
justify-content: center;
padding-left: 12px;
padding-right: 12px;
`;

const MetaDataText = Styled.Text`
font-weight: 300
font-size: 16px;
color: #0075FF
`;

const FooterContainer = Styled.View`
position: absolute;
bottom: 53px;

`;

const FinishButton = Styled.View`
width: ${wp('91.46%')};
height: ${wp('12.799%')};
border-radius: 8px;
background-color: #0075FF;
align-items: center;
justify-content: center;
`;

const FinishText = Styled.Text`
font-weight: bold;
font-size: 16px;
color: #ffffff;
`;

interface Props {
    navigation: any,
    route: any,
}

const ReviewMetaDataScreen = ({navigation, route}: Props) => {
    
    const [hospitalName, setHospitalName] = useState<string>("")
    const [treatDate, setTreatDate] = useState<string>("")
    const [treatPrice, setTreatPrice] = useState<string>("")

    const goBack = () => {
        navigation.goBack();
    }

    const moveToDentistSearch = () => {
        navigation.navigate("DentistSearchScreen");
    }

    return (
        <Container>
            <HeaderBar>
               <TouchableWithoutFeedback onPress={() => goBack()}>
                <HeaderLeftContainer>
                    <HeaderBackIcon
                    source={require('~/Assets/Images/HeaderBar/ic_back.png')}/>
                </HeaderLeftContainer>
                </TouchableWithoutFeedback>
                <HeaderTitleText>정보확인</HeaderTitleText>
                <HeaderRightContainer>
                    <HeaderEmptyContainer>
                    </HeaderEmptyContainer>
                </HeaderRightContainer>
            </HeaderBar>
            <BodyContainer>
                <TouchableWithoutFeedback onPress={() => moveToDentistSearch()}>
                <MetaDataItemContainer>
                <MetaDataText>{hospitalName}</MetaDataText>
                </MetaDataItemContainer>
                </TouchableWithoutFeedback>
                <MetaDataItemContainer style={{marginTop: 16}}>
                <MetaDataText>{treatDate}</MetaDataText>
                </MetaDataItemContainer>
                <MetaDataItemContainer style={{marginTop: 16}}>
                <MetaDataText>{treatPrice}</MetaDataText>
                </MetaDataItemContainer>
            </BodyContainer>
            <FooterContainer>
            <FinishButton>
                <FinishText>확인</FinishText>
            </FinishButton>
            </FooterContainer>
        </Container>
    )
}

export default ReviewMetaDataScreen


