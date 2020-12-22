import React, {useState, useEffect} from 'react';
import Styled from 'styled-components/native';
import {
    TouchableWithoutFeedback,
    FlatList,
    Platform,
    PermissionsAndroid,
    Alert,
    ActivityIndicator,
} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useDispatch} from 'react-redux';
import allActions from '~/actions';
import axios from 'axios';
import Geolocation from 'react-native-geolocation-service';

// Local Component
import NavigationHeader from '~/Components/Presentational/NavigationHeader';

// Async Storage
import {storeUserInfo} from '~/storage/currentUser';

// Route
import POSTRegister from '~/Routes/Auth/POSTRegister';
import POSTSocialRegister from '~/Routes/Auth/POSTSocialRegister';
import POSTReviewUpload from '~/Routes/Review/POSTReviewUpload';

const Container = Styled.SafeAreaView`
flex: 1;
background-color: #ffffff;
`;


const HeaderLeftContainer = Styled.View`
`;

const HeaderBackIcon = Styled.Image`
width: ${wp('6.4%')}px;
height: ${wp('6.4%')}px;
`;

const HeaderEmptyContainer = Styled.View`
width: ${wp('6.4%')}px;
height: ${wp('6.4%')}px;
`;

const BodyContainer = Styled.View`
flex: 1;
background-color: #ffffff;
align-items: center;
`;

const HometownInputContainer = Styled.View`
width: ${wp('100%')}px;
height: ${hp('7%')}px;
border-bottom-width: 1px;
border-color: #eeeeee;
align-items: center;
justify-content: center;
flex-direction: row;
`;

const HometownTextInputContainer = Styled.View`
flex-direction: row;
align-items: center;
`;

const SearchIcon = Styled.Image`
width: ${wp('6.4%')}px;
height: ${wp('6.4%')}px;
`;

const HometownTextInput = Styled.TextInput`
margin-left: 12px;
width: ${wp('81.6%')}px;
font-size: 16px;
`;

const SettingCurrentLocationButton = Styled.View`
width: ${wp('91.46%')}px;
height: ${wp('10.66%')}px;
background-color: #2998FF;
margin-top: 16px;
flex-direction: row;
align-items: center;
justify-content: center;
border-radius: 4px;
`;

const TargetIcon = Styled.Image`
width: ${wp('4.26%')}px;
height: ${wp('4.26%')}px;
`;

const SettingCurrentLocationText = Styled.Text`
margin-left: 4px;
font-weight: 400;
font-size: 14px;
color: #ffffff;
`;

const HometownListContainer = Styled.View`
flex: 1;
`;

const HometownListHeaderContainer = Styled.View`
padding-top: 23px;
padding-left: 16px;
padding-right: 16px;
background-color: #ffffff;
`;

const HometownLabelText = Styled.Text`
font-size: 14px;
color: #7a7a7a;
font-weight: 400;
`;

const HometownItemContainer = Styled.View`
width: ${wp('100%')}px;
height: ${hp('6.9%')}px;
flex-direction: row;
align-items: center;
padding-left: 16px;
border-bottom-width: 1px;
border-color: #eeeeee;
`;

const HometownNameText = Styled.Text`
font-weight: 400;
font-size: 16px;
color: #000000;
`;

const IndicatorContainer = Styled.View`
position: absolute;
width: ${wp('100%')}px;
height: ${hp('100%')}px;
background-color: #00000040;
align-items: center;
justify-content: center;
`;

const TEST_HOMETOWN_DATA = [
    {
        name: "서울특별시 강남구 압구정동"
    },
    {
        name: "서울특별시 강남구 압구정동"
    },
    {
        name: "서울특별시 강남구 압구정동"
    },
    {
        name: "서울특별시 강남구 압구정동"
    },
    {
        name: "서울특별시 강남구 압구정동"
    },
    {
        name: "서울특별시 강남구 압구정동"
    },
]


interface Props {
    navigation: any,
    route: any,
}

const NMAP_CLIENT_ID = "htnc7h3vi5";
const NMAP_CLIENT_SECRET = "6uL7bf7tRgcDr9a3IS70fiufg647gVXxlTVoctIO";

const HometownSettingScreen = ({navigation, route}: Props) => {
    const [loadingGetHometown, setLoadingGetHometown] = useState<boolean>(false);
    const [loadingSignUp, setLoadingSignUp] = useState<boolean>(false);
    const provider = route.params.provider;
    var curLocationHometown = "";

    useEffect(() => {
        if(route.params?.userPhoneNumber) {
            console.log("route.params.userPhoneNumber", route.params.userPhoneNumber);
            console.log("route.params.certifiedPhoneNumber", route.params.certifiedPhoneNumber);
            console.log("route.params.provider", route.params.provider);
            console.log("route.params.fcmToken", route.params.fcmToken);
            console.log("route.params.nickname", route.params.nickname);
        }

    }, [route.params?.userPhoneNumber])

    const dispatch = useDispatch();

    const selectHometownItem = (item: any) => {
        if(provider === "local") {
            signUp(item);
        } else {
            signUpSocial(item);
        }
    }

    async function setCurrentLocationHometown() {
        setLoadingGetHometown(true);
        var hasLocationPermission;

        if(Platform.OS == 'android') {
            const permission = PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION;
            hasLocationPermission = await PermissionsAndroid.check(permission);
        } else if(Platform.OS == 'ios') {
            hasLocationPermission = true;
        }

        if(hasLocationPermission) {
            Geolocation.getCurrentPosition(
                (position) => {
                    console.log("사용자 현재 위치 position", position)

                    axios
                    .get(`https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2/gc?coords=${position.coords.longitude + "," + position.coords.latitude}&orders=admcode&output=json`, 
                    {
                        headers: {
                            "X-NCP-APIGW-API-KEY-ID": NMAP_CLIENT_ID,
                            "X-NCP-APIGW-API-KEY": NMAP_CLIENT_SECRET,
                        }
                    })
                    .then((response) => {
                        setLoadingGetHometown(false);
                        console.log("getReverseGeocode response.data.result", response.data.results[0].region)

                        const region = response.data.results[0].region

                        curLocationHometown = region.area1.name + " " + region.area2.name + " " + region.area3.name

                        console.log("curLocationHometown", curLocationHometown)

                        Alert.alert(
                            `${curLocationHometown}으로 동네를 등록하시겠습니까?`,
                            '',
                            [
                                {
                                text: "확인",
                                onPress: () => {
                                    if(provider === "local") {
                                        signUp(curLocationHometown)
                                    } else {
                                        signUpSocial(curLocationHometown)
                                    }
                                },  
                                },
                                {
                                text: "취소",
                                onPress: () => 0,
                                style: 'cancel'
                                }
                            ]
                        )
                    })
                    .catch((error) => {
                        console.log("getReverseGeocode error", error);
                    })
                },
                (error) => {
                    console.log("사용자 현재 위치 불러오기 실패 error", error);
                },
                {enableHighAccuracy: false, timeout: 10000, maximumAge: 10000}
            )
        }
    }

    const signUp = (hometown: string) => {
        setLoadingSignUp(true);

        const certifiedPhoneNumber = route.params.certifiedPhoneNumber;
        const provider = route.params.provider;
        const fcmToken = route.params.fcmToken;
        const phoneNumber = route.params.userPhoneNumber;
        const nickname = route.params.nickname;

        POSTRegister({certifiedPhoneNumber, provider, fcmToken, phoneNumber, nickname})
        .then((response: any) => {
            setLoadingSignUp(false);
            console.log("POSTRegister response", response)
            
            const userInfo = {
                jwtToken: response.token,
                phoneNumber: phoneNumber,
            }

            storeUserInfo(userInfo)
            dispatch(allActions.userActions.setUser(userInfo))
        })
        .catch((error) => {
            setLoadingSignUp(false);
            console.log("POSTRegister error", error);
        })
    }

    const signUpSocial = (hometown: string) => {
        setLoadingSignUp(true);

        const birthdate = route.params.birthdate;
        const profileImg = route.params.profileImg;
        const nickname = route.params.nickname;
        const phoneNumber = route.params.phoneNumber;
        const fcmToken = route.params.fcmToken;
        const email = route.params.email;
        const provider = route.parmas.provider;
        const socialId = route.params.socialId;

        POSTSocialRegister({birthdate, profileImg, nickname, phoneNumber, fcmToken, email, provider, socialId})
        .then((response: any) => {
            console.log("POSTSocialRegister response", response);

            const userInfo = {
                jwtToken: response.token,
            }

            storeUserInfo(userInfo);
            dispatch(allActions.userActions.setUser(userInfo));
        })
        .catch((error: any) => {
            console.log("POSTSocialRegister error", error);
        })
    }

    const renderHometownItem = ({item, index}: any) => {
        return (
            <TouchableWithoutFeedback onPress={(item) => selectHometownItem(item)}>
            <HometownItemContainer>
                <HometownNameText>{item.name}</HometownNameText>
            </HometownItemContainer>
            </TouchableWithoutFeedback>
        )
    }

    return (
        <Container>
            <NavigationHeader
            renderHeaderLeftContainer={() => {
                return (
                    <HeaderBackIcon
                    source={require('~/Assets/Images/HeaderBar/ic_back.png')}/>
                )
            }}
            renderHeaderRightContanier={() => {
                return (
                    <HeaderEmptyContainer/>
                )
            }}
            headerTitle={"마을 설정"}
            />
            <BodyContainer>
                <HometownInputContainer>
                    <HometownTextInputContainer>
                        <SearchIcon
                        style={{tintColor:"#979797"}}
                        source={require('~/Assets/Images/Search/ic_search.png')}/>
                        <HometownTextInput
                        autoFocus={false}
                        placeholder={"동명(읍, 면)으로 검색 (ex 서초동)"}
                        placeholderTextColor={"#979797"}
                        />
                    </HometownTextInputContainer>
                </HometownInputContainer>
                <TouchableWithoutFeedback onPress={() => setCurrentLocationHometown()}>
                <SettingCurrentLocationButton>
                    <SettingCurrentLocationText>현재 위치로 설정</SettingCurrentLocationText>
                </SettingCurrentLocationButton>
                </TouchableWithoutFeedback>
                <HometownListContainer>
                    <HometownListHeaderContainer>
                        <HometownLabelText>{"주변마을"}</HometownLabelText>
                    </HometownListHeaderContainer>
                    <FlatList
                    data={TEST_HOMETOWN_DATA}
                    renderItem={renderHometownItem}
                    />
                </HometownListContainer>
            </BodyContainer>
            {(loadingGetHometown || loadingSignUp) && (
                <IndicatorContainer>
                    <ActivityIndicator
                    color={"#ffffff"}/>
                </IndicatorContainer>
            )}
        </Container>

    )

}

export default HometownSettingScreen;
