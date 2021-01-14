import React, {useState, useEffect, useRef} from 'react';
import {
  TouchableWithoutFeedback,
  TouchableOpacity,
  FlatList,
  Text,
  View,
  Image,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native';
import Styled from 'styled-components/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {getStatusBarHeight} from 'react-native-status-bar-height';

const HeaderBar = Styled.View`
 width: ${wp('100%')}px;
 height: ${hp('6.5%')}px;
 flex-direction: row;
 align-items: center;
 justify-content: space-between;
 border-bottom-width: 1px;
 border-color: #E2E6ED;
 background-color: #ffffff;
`;

const HeaderText = Styled.Text`
font-size: 18px;
`;

const HeaderLeftContainer = Styled.View`
height: ${hp('6.5%')}px;
padding: 16px;
align-items: center;
flex-direction: row;
`;

const HeaderLeftText = Styled.Text`
font-family: NanumSquare;
color: #131F3C;
font-size: 18px;
font-weight: 700;
`;

const HeaderTitleContainer = Styled.View`
height: auto;
justify-content: center;
`;

const HeaderTitleText = Styled.Text`
font-family: NanumSquare;
font-weight: 700;
font-size: 16px; 
`;

const HeaderRightContainer = Styled.View`
height: ${hp('6.5%')}px;
padding: 16px;
 align-items: center;
 flex-direction: row;
`;

const HeaderEmptyContainer = Styled.View`
width: ${wp('6.4%')}px;
height: ${wp('6.4%')}px;
`;

const HeaderIconView = Styled.View`
flex-direction: row;
align-items: center;
`;

const HeaderIcon = Styled.Image`
width: ${wp('6.4%')}px;
height: ${wp('6.4%')}px;
`;

interface HeaderProps {
  onPress?: any;
  text?: string;
  type?: string;
}

interface Props {
  headerLeftProps?: HeaderProps;
  headerRightProps?: HeaderProps;
  headerTitle?: string;
}
const NavigationHeader = ({
  headerLeftProps,
  headerRightProps,
  headerTitle,
}: Props) => {

  console.log("NavigationHeader statusbarHeight", getStatusBarHeight())
  return (
    <HeaderBar>
      <TouchableWithoutFeedback
      onPress={() => {
      headerLeftProps?.onPress();
      }}>
        <HeaderLeftContainer>
        
          {headerLeftProps?.type === 'arrow' ? (
            <HeaderIconView>
              <HeaderIcon
                style={{resizeMode: 'contain'}}
                source={require('~/Assets/Images/HeaderBar/ic_back.png')}
              />
              {headerLeftProps?.text?.length > 0 && (
              <HeaderLeftText>{headerLeftProps.text}</HeaderLeftText>
              )}
            </HeaderIconView>
          ) : (
            <HeaderText>{headerLeftProps?.text}</HeaderText>
          )}
        </HeaderLeftContainer>
      </TouchableWithoutFeedback>
      <HeaderTitleContainer>
        <HeaderTitleText>{headerTitle}</HeaderTitleText>
      </HeaderTitleContainer>
      <HeaderRightContainer>
        <TouchableWithoutFeedback
          onPress={() => {
            headerRightProps?.onPress();
          }}>
          {headerRightProps?.type === 'arrow' ? (
            <HeaderIconView>
              <HeaderIcon
                source={require('~/Assets/Images/Arrow/ic_rightArrow.png')}
              />
            </HeaderIconView>
          ) :
          (headerRightProps?.type === 'viewMore' ? (
            <HeaderIconView>
              <HeaderIcon
              source={require('~/Assets/Images/HeaderBar/ic_viewMore.png')}/>
            </HeaderIconView>
          ) :
          (headerRightProps?.type === 'empty' ? (
            <HeaderEmptyContainer/>
          ) : 
          (
            <HeaderText>{headerRightProps?.text}</HeaderText>
          )))}
        </TouchableWithoutFeedback>
      </HeaderRightContainer>
    </HeaderBar>
  );
};

export default NavigationHeader;
