import React, {useState, useEffect, useRef, useCallback} from 'react';
import Styled from 'styled-components/native';
import {
  TouchableWithoutFeedback,
  TouchableOpacity,
  TouchableHighlight,
  Animated,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ActionSheet from 'react-native-actionsheet';
import DateTimePicker from '@react-native-community/datetimepicker';
import {SharedElement} from 'react-navigation-shared-element';
// Local Component
import AnimatedModal from '~/Components/Presentational/AnimatedModal';

const ContainerView = Styled.ScrollView`
flex: 1;
background: #F5F7F9;
`;

const ProfileImageContainerView = Styled.View`
width: ${wp('100%')}px;
padding: 16px 0px;
align-items: center;
justify-content: center;
`;

const ProfileImage = Styled.Image`
width: 77px;
height: 77px;
border-width: 0.5px;
border-color: #A6A8AC;
box-shadow: 0px 0px 12px #D8DCDE;
border-radius: 100px;
`;

const ProfileImageMaskView = Styled.View`
position: absolute;
width: 77px;
height: 77px;
border-radius: 100px;
background: #00000040;
align-items: center;
justify-content: center;
z-index: 1;
`;

const ProfileImageMaskImage = Styled.Image``;

const ProfileImageContentView = Styled.View`
`;

const SectionContainerView = Styled.View`
background: #FFFFFF;
margin-bottom: 16px;
border-color: #E2E6ED;
border-top-width: 0.5px;
border-bottom-width: 0.5px;
`;

const SectionVerticalDivider = Styled.View`
background: #E2E6ED;
width: auto
height: 0.5px;
margin: 0px 16px;

`;

const SectionContentView = Styled.View`
flex-direction: row;
padding: 16px;
align-items: center;
background: #FFFFFF;
`;
const SectionContentTitleText = Styled.Text`
width: 94px;
font-style: normal;
font-weight: bold;
font-size: 16px;
line-height: 24px;
color: #131F3C;`;

const SectionContentText = Styled.Text`
font-style: normal;
font-weight: bold;
font-size: 16px;
line-height: 24px;
color: #9AA2A9;
`;

const SectionImage = Styled.Image`
margin-left: auto;
`;

const VerifiedBadgeView = Styled.View`
padding: 3px 8px;
background: #00D1FF;
border-radius: 4px;
margin-left: auto;
`;

const VerifiedBadgeText = Styled.Text`
font-style: normal;
font-weight: bold;
font-size: 10px;
line-height: 16px;
color: #FFFFFF;
`;

const BitrhdateModal = Styled.Modal`
`;

const BirthdateModalContinerView = Styled.View`
background: #000000;
position: absolute;
width: ${wp('100%')}px;
height: ${hp('100%')}px;
`;

const BirthdateContentView = Styled.View`
position: absolute;
width: ${wp('100%')}px;
bottom: 0px;
`;

const BirthdateContentHeaderView = Styled.View`
background: rgb(240,241,243);
padding: 12px;
`;

const BirthdateContentHeaderText = Styled.Text`
margin-left: auto;
font-size: 16px;
font-weight: bold;
color: #2288FF;
`;

interface Props {
  capturePhoto: any;
  moveToEditNickname: any;
  moveToGallery: any;
  moveToHomeTownSetting: any;
  moveToPhoneVerify: any;
  currentUser: any;
  changeProfileNickname: (nickname: string) => void;
  changeProfileGender: (gender: string) => void;
  changeProfileBirthdate: (birthdate: string) => void;
}

const EditProfileScreen = ({
  capturePhoto,
  moveToEditNickname,
  moveToGallery,
  moveToHomeTownSetting,
  moveToPhoneVerify,
  currentUser,
  changeProfileNickname,
  changeProfileGender,
  changeProfileBirthdate,
}: Props) => {
  const [textInput, setTextInput] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [sectionArrow, setSectionArrow] = useState(
    require('~/Assets/Images/MyPage/common/gan/list/profile_edit_section_arrow.png'),
  );
  const genderActionSheetRef: any = useRef();
  const imageActionSheetRef: any = useRef();

  const genderActionSheetItemList = ['취소', '여성', '남성', '선택안함'];
  const imageActionSheetItemList = [
    '취소',
    '카메라',
    '앨범에서 선택',
    '현재 사진 삭제',
  ];

  const modalContentY = useRef(new Animated.Value(hp('40%'))).current;
  const [date, setDate] = useState<Date>(
    new Date(currentUser.profile.birthdate || Date.now()),
  );

  const onChange = (event: Event, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
  };

  const onPressGenderActionSheet = useCallback((index: number) => {
    switch (genderActionSheetItemList[index]) {
      case '남성':
        changeProfileGender('남성');
        break;
      case '여성':
        changeProfileGender('여성');
        break;
      case '선택안함':
        changeProfileGender('선택안함');
        break;
    }
  }, []);

  const onPressImageActionSheet = useCallback((index: number) => {
    switch (imageActionSheetItemList[index]) {
      case '카메라':
        console.log('open camera');
        capturePhoto();
        break;
      case '앨범에서 선택':
        console.log('open gallery');
        moveToGallery();
        break;
    }
  }, []);

  const openModal = useCallback(() => {
    setIsModalVisible(true);
    Animated.spring(modalContentY, {
      toValue: 0,
      friction: 17,
      tension: 68,
      useNativeDriver: true,
    }).start();
  }, [modalContentY]);
  const closeModal = useCallback(() => {
    Animated.timing(modalContentY, {
      toValue: hp('40%'),
      duration: 200,
      useNativeDriver: true,
    }).start(() => setIsModalVisible(false));
  }, [modalContentY]);

  const setUserBirthdate = useCallback(() => {
    const formattedDate = date.toISOString();
    console.log(formattedDate);
    changeProfileBirthdate(formattedDate);
    setIsModalVisible(false);
  }, [date]);

  const onChangeText = useCallback(
    (input: string) => setTextInput(input.replace(/\s/g, '')),
    [],
  );

  const renderResidences = useCallback(() => {
    let result = '';
    currentUser.hometown.map((item: any, index: number) => {
      if (index === 0) {
        result += item.emdName;
      } else {
        result += `, ${item.emdName}`;
      }
    });
    return result;
  }, [currentUser.hometown]);

  const formatProvider = useCallback((provider: string) => {
    switch (provider) {
      case 'google':
        return '구글';
      case 'kakao':
        return '카카오';
      case 'apple':
        return '애플';
      case 'local':
        return '없음';
    }
  }, []);
  return (
    <ContainerView
      keyboardShouldPersistTaps={'always'}
      showsVerticalScrollIndicator={false}>
      <ProfileImageContainerView>
        <TouchableWithoutFeedback
          onPress={() => imageActionSheetRef.current.show()}>
          <ProfileImageContentView>
            <ProfileImageMaskView>
              <ProfileImageMaskImage
                source={require('~/Assets/Images/MyPage/common/gan/ic/write/white.png')}
              />
            </ProfileImageMaskView>
            <ProfileImage source={{uri: currentUser.profile.profileImg}} />
          </ProfileImageContentView>
        </TouchableWithoutFeedback>
      </ProfileImageContainerView>
      <SectionContainerView>
        <TouchableHighlight
          activeOpacity={0.9}
          underlayColor="black"
          onPress={() => moveToEditNickname(currentUser.profile.nickname)}>
          <SharedElement id="nicknameInput">
            <SectionContentView>
              <SectionContentTitleText>{'닉네임'}</SectionContentTitleText>
              <SectionContentText>
                {currentUser.profile.nickname}
              </SectionContentText>
              <SectionImage source={sectionArrow} />
            </SectionContentView>
          </SharedElement>
        </TouchableHighlight>
        <SectionVerticalDivider />
        <TouchableHighlight
          activeOpacity={0.9}
          underlayColor="black"
          onPress={() => moveToHomeTownSetting()}>
          <SectionContentView>
            <SectionContentTitleText>{'우리동네'}</SectionContentTitleText>
            <SectionContentText>{renderResidences()}</SectionContentText>
            <SectionImage source={sectionArrow} />
          </SectionContentView>
        </TouchableHighlight>
      </SectionContainerView>

      <SectionContainerView>
        <TouchableHighlight
          activeOpacity={0.9}
          underlayColor="black"
          onPress={() => genderActionSheetRef.current.show()}>
          <SectionContentView>
            <SectionContentTitleText>{'성별'}</SectionContentTitleText>
            <SectionContentText>
              {currentUser.profile.gender || '미등록'}
            </SectionContentText>
            <SectionImage source={sectionArrow} />
          </SectionContentView>
        </TouchableHighlight>
        <SectionVerticalDivider />
        <TouchableHighlight
          activeOpacity={0.9}
          underlayColor="black"
          onPress={() => openModal()}>
          <SectionContentView>
            <SectionContentTitleText>{'생일'}</SectionContentTitleText>
            <SectionContentText>
              {currentUser.profile.birthdate || '미등록'}
            </SectionContentText>
            <SectionImage source={sectionArrow} />
          </SectionContentView>
        </TouchableHighlight>
      </SectionContainerView>

      <SectionContainerView>
        <TouchableHighlight
          activeOpacity={0.9}
          underlayColor="black"
          onPress={() => console.log('h')}>
          <SectionContentView>
            <SectionContentTitleText>{'연동계정'}</SectionContentTitleText>
            <SectionContentText>
              {formatProvider(currentUser.profile.provider)}
            </SectionContentText>
            <SectionImage source={sectionArrow} />
          </SectionContentView>
        </TouchableHighlight>
        <SectionVerticalDivider />
        <TouchableHighlight
          activeOpacity={0.9}
          underlayColor="black"
          onPress={() => console.log('h')}>
          <SectionContentView>
            <SectionContentTitleText>{'본인인증'}</SectionContentTitleText>
            <SectionContentText>
              {currentUser.profile.phoneNumber || '미인증'}
            </SectionContentText>
            {currentUser.profile.phoneNumber ? (
              <VerifiedBadgeView>
                <VerifiedBadgeText>{'인증완료'}</VerifiedBadgeText>
              </VerifiedBadgeView>
            ) : null}
            <SectionImage
              source={sectionArrow}
              style={{
                marginLeft: currentUser.profile.phoneNumber ? 8 : 'auto',
              }}
            />
          </SectionContentView>
        </TouchableHighlight>
      </SectionContainerView>
      <BitrhdateModal
        visible={isModalVisible}
        transparent={true}
        animationType="none">
        <TouchableWithoutFeedback onPress={() => closeModal()}>
          <BirthdateModalContinerView
            as={Animated.View}
            style={{
              opacity: modalContentY.interpolate({
                inputRange: [0, hp('40%')],
                outputRange: [0.3, 0],
                extrapolate: 'clamp',
              }),
            }}></BirthdateModalContinerView>
        </TouchableWithoutFeedback>
        <BirthdateContentView
          as={Animated.View}
          style={{transform: [{translateY: modalContentY}]}}>
          <BirthdateContentHeaderView>
            <TouchableWithoutFeedback onPress={() => setUserBirthdate()}>
              <BirthdateContentHeaderText>{'완료'}</BirthdateContentHeaderText>
            </TouchableWithoutFeedback>
          </BirthdateContentHeaderView>
          <DateTimePicker
            style={{
              width: '100%',
              height: 217,
              backgroundColor: '#FFFFFF',
            }}
            testID="dateTimePicker"
            value={date}
            mode="date"
            is24Hour={true}
            display="spinner"
            onChange={onChange}
          />
        </BirthdateContentView>
      </BitrhdateModal>
      <ActionSheet
        ref={genderActionSheetRef}
        options={genderActionSheetItemList}
        cancelButtonIndex={0}
        onPress={(index: any) => onPressGenderActionSheet(index)}
      />
      <ActionSheet
        ref={imageActionSheetRef}
        options={imageActionSheetItemList}
        cancelButtonIndex={0}
        onPress={(index: any) => onPressImageActionSheet(index)}
      />
    </ContainerView>
  );
};

export default EditProfileScreen;
