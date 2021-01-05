import React from 'react';
import Styled from 'styled-components/native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const Container = Styled.View`
padding-top: 24px;
padding-left: ${wp('5%')}px;
padding-right: ${wp('14%')}px;
padding-bottom: 24px;
background-color: #ffffff;
flex-direction: row;
justify-content: space-between;
align-items: center;
`;

const CircleContainer = Styled.View`
width: ${wp('25.6%')}px;
height: ${wp('25.6%')}px;
border-width: ${wp("1.5%")}px;
border-radius: ${wp('12.8%')}px;
border-color: #CCD1DD;
justify-content: center;
align-items: center;
`;

const FirstCircleProgressLayer = Styled.View`
width: ${wp('25.6%')}px;
height: ${wp('25.6%')}px;
position: absolute;
border-width: ${wp('1.5%')}px;
border-left-color: transparent;
border-bottom-color: transparent;
border-right-color: #3ECB99;
border-top-color: #3ECB99;
border-radius: ${wp('12.8%')}px;
`;

const SecondCircleProgressLayer = Styled.View`
width: ${wp('25.6%')}px;
height: ${wp('25.6%')}px;
position: absolute;
border-width: ${wp('1.5%')}px;
border-radius: ${wp('12.8%')}px;
border-left-color: transparent;
border-bottom-color: transparent;
border-right-color: #3ECB99;
border-top-color: #3ECB99;
`;

const CircleOffsetLayer = Styled.View`
width: ${wp('25.6%')}px;
height: ${wp('25.6%')}px;
border-width: ${wp('1.5%')}px;
border-radius: ${wp('12.8%')}px;
border-left-color: transparent;
border-bottom-color: transparent;
border-right-color: #CCD1DD;
border-top-color: #CCD1DD;
`;

const AvgRatingContainer = Styled.View`
flex-direction: row;
align-items: center;
`;

const RatingStarImage = Styled.Image`
width: ${wp('4.53%')}px;
height: ${wp('4.53%')}px;
`;

const AvgRatingText = Styled.Text`
margin-left: 2px;
font-weight: 700;
font-size: 20px;
color: #000000;
font-family: NanumSquare;
`

const RatingListContainer = Styled.View`
width: ${wp('49.3%')}px;
flex-direction: column;

`;

const RatingItemContainer = Styled.View`
flex-direction: row;
align-items: center;
justify-content: space-between;
`;

const RatingTypeText = Styled.Text`
margin-top: 2px;
font-weight: 800;
font-size: 14px;
color: #2F2F2F;
font-family: NanumSquare;
`;

const RatingValueText = Styled.Text`
font-weight: 800;
font-size: 14px;
color: #2F2F2F;
font-family: NanumSquare;
`;

const RatingImage = Styled.Image`
`;

const StarListContainer = Styled.View`
flex-direction: row;
align-items: center;
`;


const RatingCircleProgress = ({rating}: any) => {

    const FirstBaseDegrees = -135;
    const SecondBaseDegrees = 45;
  
    const percent = (rating / 5) * 100;
    let firstRotateBy = 0;
    let secondRotateBy = 45;
  
    if(percent > 50) {
      firstRotateBy = 45
      secondRotateBy = SecondBaseDegrees + (percent - 50) * 3.6 
    } else if(percent <= 50) {
      firstRotateBy = FirstBaseDegrees + (percent * 3.6)    
    }
  
    return (
      <CircleContainer>
          <FirstCircleProgressLayer
          style={{
            transform: [{rotateZ: `${firstRotateBy}deg`}]
          }}/>
          {percent > 50 && (
          <SecondCircleProgressLayer
          style={{
            transform: [{rotateZ: `${secondRotateBy}deg`}]
          }}/>
          )}
          {percent <= 50 && (
          <CircleOffsetLayer
          style={{
            transform: [{rotateZ: '-135deg'}]
          }}/>
          )}
          <AvgRatingContainer>
            <RatingStarImage
            source={require('~/Assets/Images/Indicator/ic_starRating.png')}/>
            <AvgRatingText>{rating.toFixed(1)}</AvgRatingText>
          </AvgRatingContainer>
      </CircleContainer>
    )
}

interface Props {
    ratingValue: number,
    ratingImage: any,
    interval: number
}

const RatingStarList = ({ratingValue, ratingImage, interval}: Props) => {

    let isInteger = false;
    let tmpArray = [0, 0, 0, 0, 0]

    if(ratingValue % 1 !== 0) {
        
        for(var i = 0; i < Math.round(ratingValue); i++) {
            if(i === Math.round(ratingValue) - 1) {
                tmpArray[i] = 0.5
            } else {
                tmpArray[i] = 1
            }
        }
        
    } else if(ratingValue % 1 === 0) {
        
        for(var i = 0; i < ratingValue; i++) {
            tmpArray[i] = 1
        }
    }


    return (
        <StarListContainer>
            {tmpArray.map((item, index) => {
                if(item === 0) {
                    return (
                        <RatingImage
                        style={[{tintColor: "#CCD1DD"}, index !== 0 && {marginLeft: 4}]}
                        source={require('~/Assets/Images/Indicator/ic_starRating.png')}/>
                    )
                } else if(item === 1) {
                    return (
                        <RatingImage
                        style={index !== 0 && {marginLeft: 4}}
                        source={require('~/Assets/Images/Indicator/ic_starRating.png')}/>
                    )
                } else if(item === 0.5) {
                    return (
                        <RatingImage
                        style={index !== 0 && {marginLeft: 4}}
                        source={require('~/Assets/Images/Indicator/ic_starRating.png')}/>
                    )
                } 
            })}
            <RatingValueText style={{marginTop: 2, marginLeft: 8}}>{ratingValue.toFixed(1)}</RatingValueText>
        </StarListContainer>
    )
}

interface Props {
    avgRating: number,
}

const RatingReport = ({avgRating}: Props) => {

    return (
        <Container>
            <RatingCircleProgress
            rating={avgRating}/>
            <RatingListContainer>
              <RatingItemContainer>
                <RatingTypeText>{"진료"}</RatingTypeText>
                <RatingStarList
                ratingValue={3}
                interval={4}
                />
              </RatingItemContainer>
              <RatingItemContainer style={{marginTop: hp('1.8%')}}>
                <RatingTypeText>{"서비스"}</RatingTypeText>
                <RatingStarList
                ratingValue={3}
                interval={4}
                />
              </RatingItemContainer>
              <RatingItemContainer style={{marginTop: hp('1.8%')}}>
                <RatingTypeText>{"가격"}</RatingTypeText>
                <RatingStarList
                ratingValue={3}
                interval={4}
                />
              </RatingItemContainer>
            </RatingListContainer>
        </Container>
    )
}

export default RatingReport