import React, {
  useEffect,
  useState,
  useRef,
  createRef,
  useMemo,
  useCallback,
  memo,
} from 'react';
import Styled from 'styled-components/native';
import {
  TouchableWithoutFeedback,
  TouchableHighlight,
  PermissionsAndroid,
  Platform,
  ScrollView,
  FlatList,
  StyleSheet,
  Keyboard,
  PanResponder,
  ActivityIndicator,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Picker} from '@react-native-picker/picker';
import {useSelector, useDispatch} from 'react-redux';
import allActions from '~/actions';

import NaverMapView, {Circle, Marker} from 'react-native-nmap';
import {isIphoneX, getBottomSpace} from 'react-native-iphone-x-helper';
import Geolocation from 'react-native-geolocation-service';
import DeviceInfo from 'react-native-device-info';
import getStateBarHeight, { getStatusBarHeight } from 'react-native-status-bar-height';
import Carousel from 'react-native-snap-carousel';
import ActionSheet from 'react-native-actionsheet';
import Modal from 'react-native-modal';

// Local Component
import DentalCarouselList from '~/Components/Presentational/NearDentalMap/DentalCarouselList';
import TouchBloackIndicatorCover from '~/Components/Presentational/TouchBlockIndicatorCover';
import DentalList from '~/Components/Presentational/DentalList';
import ToastMessage from '~/Components/Presentational/ToastMessage';
import {callPhoneNumber} from '~/method/callPhoneNumber';

// Route
import GETAroundDental from '~/Routes/Dental/GETAroundDental';
import GETDentalTotalSearch from '~/Routes/Search/GETDentalTotalSearch';


const Container = Styled.View`
flex: 1;
`;

const HeaderBar = Styled.View`
 width: ${wp('100%')}px;
 padding-top: 5px;
 padding-bottom: 6px;
 padding-left: 15px;
 padding-right: 15px;
`;

const MapContainer = Styled.View`
align-items: center;
justify-content: center;
`;

const SearchContainer = Styled.View`
flex: 1;
padding-left: 15px;
padding-right: 15px;
padding-bottom: 0px;
`;


const SearchInputContainer = Styled.View`
flex-direction: row;
flex: 1;
background-color: #ffffff;
border-radius: 8px;
border-width: 1px;
border-color: #F5F7F9;
align-items: center;
padding-top: 12px;
padding-bottom: 12px;
padding-left: 16px;
padding-right: 16px;
`;

const SearchPlaceHolderText = Styled.Text`
font-weight: 700;
margin-left: 11px;
font-size: 16px;
line-height: 24px;
color: #9AA2A9;
`;

const SearchText = Styled.Text`
font-weight: 700;
margin-left: 11px;
font-size: 16px;
line-height: 24px;
color: #9AA2A9;
`;

const FilterListContainer = Styled.View`

flex-direction: row;
align-items: center;
`;

const FilterItemContainer = Styled.View`
padding: 8px 12px 8px 12px;
border-radius: 100px;
background-color: #F5F7F9;
flex-direction: row;
border-width: 0.5px;
border-color: #E2E6ED;
`;

const FilterItemText = Styled.Text`
font-weight: 400;
color: #9AA2A9;
font-size: 14px;
line-height: 19px;
`;



const SearchIcon = Styled.Image`
width: ${wp('5.866%')}px;
height: ${wp('5.866%')}px;
`;


const MapHeaderContainer = Styled.View`
width: ${wp('100%')}px;
padding-top: ${getStatusBarHeight() + 5}
position: absolute;
top: 0;
`;

const DetailFilterModalContainer = Styled.View`
width: ${wp('100%')}px;
background-color: #ffffff;
border-top-left-radius: 20px;
border-top-right-radius: 20px;
position: absolute;
bottom: 0;
`;

const DetailFilterListContainer = Styled.View`
background-color: #F5F7F9;
padding-top: 0px;
flex-direction: column;
flex: 1;
`;

const DetailFilterRowContainer = Styled.View`
flex-direction: row;
flex: 1;
align-items: center;
justify-content: flex-start;
padding-left: ${wp('1%')}px;
`;

const DetailFilterItemContainer = Styled.View`
padding: 8px 12px;
border-radius: 100px;
background-color: #ffffff;
`;

const DetailFilterItemText = Styled.Text`
font-weight: 400;
font-size: 14px;
line-height: 19px;
color: #9AA2A9;
`;

const DetailFilterHeaderContainer = Styled.View`
flex-direction: row;
padding-top: 16px;
padding-bottom: 16px;
padding-left: 16px;
align-items: center;
border-bottom-width: 1px;
border-color: #F5F7F9;
`;

const DetailFilterHeaderLeftContainer = Styled.View`
padding-top: ${hp('3.2%')}px;
padding-bottom: ${hp('3.2%')}px;
padding-left: ${wp('6.4%')}px;
padding-right: ${wp('6.4%')}px;
align-items: center;
justify-content: center;
`;

const DetailFilterHeaderRightContainer = Styled.View`
padding-top: ${hp('3.2%')}px;
padding-bottom: ${hp('3.2%')}px;
padding-left: ${wp('6.4%')}px;
padding-right: ${wp('6.4%')}px;
align-items: center;
justify-content: center;
`;

const DetailFilterTitleText = Styled.Text`
font-weight: 700;
font-size: 14px;
line-height: 19px;
color: #000000;
`;

const DetailFilterCancelText = Styled.Text`
font-weight: 400;
font-size: 16px;
color: #000000;
`;

const DetailFilterRegisterText = Styled.Text`
font-weight: 400;
font-size: 16px;
color: #000000;
`;

const DetailFilterFooterContainer = Styled.View`
padding-top: 16px;
padding-left: 0px;
padding-right: 16px;
padding-bottom: 32px;
flex-direction: row;
align-items: center;
justify-content: space-between;
`;

const InitializeFilterContainer = Styled.View`
flex-direction: row;
align-items: center;
padding-top: 8px;
padding-bottom: 8px;
padding-left: 16px;
padding-right: 16px;
`;

const InitializeFilterText = Styled.Text`
font-weight: 400;
font-size: 12px;
line-height: 16px;
color: #9AA2A9;
`;

const InitializeFilterIcon = Styled.Image`
margin-left: 4px;
width: ${wp('2.66%')}px;
height: ${wp('2.66%')}px;
`;

const RegisterFilterButton = Styled.View`
width: ${wp('55.46%')}px;
align-items: center;
border-radius: 4px;
background-color: #131F3C;
padding-top: 12px;
padding-bottom: 12px;
`;

const RegisterFilterText = Styled.Text`
font-weight: 700;
font-size: 14px;
line-height: 24px;
color: #ffffff;
`;

const TimeFilterModalContainer = Styled.View`
`;

const TimePickerContainer = Styled.View`
align-items: center;
padding-left: 25px;
padding-right: 25px;
justify-content: space-between;
flex-direction: row;
border-bottom-width: 1px;
border-color: #F5F7F9;
`;

const MapInsetBottomShadow = Styled.View`
width: ${wp('100%')}px;
height: ${hp('16.8%')}px;
position: absolute;
bottom: 0;
margin-bottom: -${hp('16.8%')}px;
background-color: #000000;
align-self: center;
`;

const CarouselIndexText = Styled.Text`
font-weight: 700;
font-size: 12px;
color: #ffffff;
`;

const CarouselIndexContainer = Styled.View`
padding-top: 8px;
`;

const TimePickerLabelText = Styled.Text`
font-size: 20px;
color: #000000;
`;

const ViewDentalListContainer = Styled.View`
padding-left: 16px;
padding-right: 16px;
flex-direction: row;
justify-content: space-between;
`;

const ReSearchInCurrentRegionButton = Styled.View`
position: absolute;
left: 16px;
opacity: 0.9;
border-width: 1px;
border-color: #9AA2A9;
flex-direction: row;
padding: 9px 15px 9px 15px;
background-color: #ffffff;
border-radius: 100px;
`;

const ViewDentalListButton = Styled.View`
position: absolute;
right: 16px;
opacity: 0.9;
border-width: 1px;
border-color: #9AA2A9;
flex-direction: row;
padding: 9px 15px 9px 15px;
background-color: #ffffff;
border-radius: 100px;
`;


const EmptyView = Styled.View`
opacity: 0;
border-width: 1px;
border-color: #9AA2A9;
flex-direction: row;
padding: 9px 15px 9px 15px;
background-color: #ffffff;
border-radius: 100px;
`;

const ViewDentalListText = Styled.Text`
margin-left: 4px;
font-size: 16px;
line-height: 20px;
color: #131F3C;
`;

const NaverMapContainer = Styled.View`
`;

const MapActionButtonContainer = Styled.View`
position: absolute;
right: 0px;
top: ${hp('50%') - (DeviceInfo.hasNotch() ? hp('31%') : hp('29%'))}px;
padding-top: 16px;
margin-right: 13px;
margin-left: auto;
`;

const MyLocationTrackingButton = Styled.View`
width: ${wp('10.5%')}px;
height: ${wp('10.5%')}px;
border-radius: 3px;
background-color: #ffffff;
align-items: center;
justify-content: center;
`;

const TargetIcon = Styled.Image`
width: ${wp('4.266%')}px;
height: ${wp('4.266%')}px;
tint-color: #131F3C;
`;

const DentalListContainer = Styled.View`
position: absolute;
bottom: 0;
`;

const ViewDentalListIcon = Styled.Image`
width: ${wp('5.3%')}px;
height: ${wp('5.3%')}px;
`;

const LoadingGetNearDentalContainer = Styled.View`
position: absolute;
`;

interface Props {
  navigation: any;
  route: any;
}

interface Coord {
  latitude: number;
  longitude: number;
}

const TEST_COORDINATE = {
  latitude: 37.566515657875435,
  longitude: 126.9781164904998,
};

let sort = 'distance';

const bottomTabheight = DeviceInfo.hasNotch() ? hp('10.59%') : hp('7.2%');

const mapHeight = hp('100%') - bottomTabheight;
  
const NearDentalMap = ({navigation, route}: Props) => {
  console.log('NearDentalMap route', route.params?.isOpenDentalList);
  const [currentLocation, setCurrentLocation] = useState<Coord>(
    TEST_COORDINATE,
  );
  const [cameraLocation, setCameraLocation] = useState<Coord>(TEST_COORDINATE);

  //const [loadingGetDental, setLoadingGetDental] = useState<boolean>(true);

  const [visibleTimeFilterModal, setVisibleTimeFilterModal] = useState<boolean>(
    false,
  );
  const [visibleDayFilterModal, setVisibleDayFilterModal] = useState<boolean>(
    false,
  );

  const [isOpenDentalList, setIsOpenDentalList] = useState<boolean>(false);
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState<number>(0);

  const [hourPickerValue, setHourPickerValue] = useState<number>(1);
  const [minutePickerValue, setMinutePickerValue] = useState<string>('00');
  const [timeSlotPickerValue, setTimeSlotPickerValue] = useState<string>(
    '오전',
  );

  const [changeDentalList, setChangeDentalList] = useState<boolean>(false);
  const [changeDayFilter, setChangeDayFilter] = useState<boolean>(false);

  const [selectedDentalIndex, setSelectedDentalIndex] = useState<number>(0);

  const [isVisibleReSearch, setIsVisibleReSearch] = useState<boolean>(false);

  const mapRef = useRef<any>(null);
  const dentalCarouselRef = useRef<any>(null);
  const timeTextInputRef = useRef<any>(null);
  const curCameraLocation = useRef<any>(TEST_COORDINATE);
  const timeFilterActionSheet = createRef<any>();
  const dispatch = useDispatch();

  const currentUser = useSelector((state: any) => state.currentUser);

  // 방문일 설정 redux state
  const dayList = useSelector((state: any) => state.dentalFilter).dayList;
  const selectedDayList = useSelector((state: any) => state.dentalFilter)
    .selectedDayList;
  const dayFilter = useSelector((state: any) => state.dentalFilter).dayFilter;

  // 방문시간 설정 redux state
  const timeFilter = useSelector((state: any) => state.dentalFilter).timeFilter;

  // 공휴일진료 설정 redux state
  const holidayFilter = useSelector((state: any) => state.dentalFilter)
    .holidayFilter;

  // 주차가능 설정 redux state
  const parkingFilter = useSelector((state: any) => state.dentalFilter)
    .parkingFilter;

  // 병원 지도 관련 redux state
  const dentalMapRedux = useSelector((state: any) => state.dentalMap);
  const mapLocation = dentalMapRedux.mapLocation;
  const mapZoom = dentalMapRedux.mapZoom;

  const nearDentalArray = dentalMapRedux.nearDentalArray;
  const searchedKeyword = dentalMapRedux.searchedKeyword;
  const loadingGetDental = dentalMapRedux.loadingGetDental;

  const jwtToken = currentUser.jwtToken;
  const todayIndex = new Date().getDay();

  const currentMapLocation = useRef<any>({
     longitude: mapLocation.longitude,
     latitude: mapLocation.latitude,
     zoom: mapZoom,
   });

  const isNearDentalList = useRef<boolean>(true);

  const limitRef = useRef<number>(20);
  const offsetRef = useRef<number>(0);

  useEffect(() => {
    if(isNearDentalList.current) {
      console.log("사용자 위치 추적")
      mapRef.current.setLocationTrackingMode(2)
    }

    const getInitialNearDental = async () => {
      if (Platform.OS == 'android') {
        getAndroidInitialNearDental();
      } else if (Platform.OS == 'ios') {
        getIosInitialNearDental();
      }
    };

    getInitialNearDental();
  }, []);

  useEffect(() => {

    if (route.params?.searchedDentalLocation) {
      console.log("mapLocation", mapLocation);
      isNearDentalList.current = route.params?.isNearDentalList;
      mapRef.current.setLocationTrackingMode(0);
    }

    if (route.params?.offset || route.params?.limit) {
      console.log(
        'offset, limit 존재',
        route.params?.offset,
        route.params?.limit,
      );
      if (route.params.offset === 0) {
        offsetRef.current = 0;
        limitRef.current = 20;
      } else if (route.params.offset > 0) {
        offsetRef.current = 0;
        limitRef.current = route.params?.offset;
      }
    }

    if (searchedKeyword.length > 0) {
      isNearDentalList.current = false;
    }

    sort = 'accuracy';

  }, [route.params?.offset, route.params?.limit, searchedKeyword, route.params?.isNearDentalList, route.params?.searchedDentalLocation]);

  useEffect(() => {
    getNearDental();
  }, []);

  async function getAndroidInitialNearDental() {
    const permission = PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION;
    const hasLocationPermission = await PermissionsAndroid.check(permission);
    if (hasLocationPermission) {
      Geolocation.getCurrentPosition(
        (position) => {
          console.log('사용자 현재 위치 position', position);

          /*
                  setCurrentLocation({
                      latitude: position.coords.latitude,
                      longitude: position.coords.longitude,
                  })
                  */

          const lat = position.coords.latitude;
          const long = position.coords.longitude;

          const offset = offsetRef.current;
          const limit = limitRef.current;

          const location = {
            coordinate: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
            zoom: 16,
          };

          dispatch(allActions.dentalMapActions.setMapLocation(location));

          GETAroundDental({
            jwtToken,
            offset,
            limit,
            lat,
            long,
            sort,
            timeFilter,
            dayFilter,
            holidayFilter,
            parkingFilter,
          })
            .then((response: any) => {
              //setLoadingGetDental(false);
              dispatch(allActions.dentalMapActions.setLoadingGetDental(false));
              dispatch(allActions.dentalMapActions.setNearDentalArray(response));
              setIsVisibleReSearch(false);
            })
            .catch((error) => {
              console.log('GETAroundDental error', error);
              dispatch(allActions.dentalMapActions.setLoadingGetDental(false));
            });

          return position;
        },
        (error) => {
          console.log(
            '사용자 현재 위치 불러오기 실패',
            error.code,
            error.message,
          );

          ToastMessage.show("현재 위치를 불러오는데 실패했습니다ㅠㅠ");

          const offset = offsetRef.current;
          const limit = limitRef.current;

          // 서울 시청 좌표
          const lat = 37.566515657875435
          const long = 126.9781164904998

          GETAroundDental({
            jwtToken,
            offset,
            limit,
            lat,
            long,
            sort,
            timeFilter,
            dayFilter,
            holidayFilter,
            parkingFilter,
          })
            .then((response: any) => {
              console.log('GETAroundDental response.length', response.length);
              dispatch(allActions.dentalMapActions.setLoadingGetDental(false));
              dispatch(allActions.dentalMapActions.setNearDentalArray(response));
            })
            .catch((error) => {
              console.log('GETAroundDental error', error);
              dispatch(allActions.dentalMapActions.setLoadingGetDental(false));
            });

          return false;
        },
        {enableHighAccuracy: false, timeout: 10000, maximumAge: 10000},
      );
    } else {
      const status = await PermissionsAndroid.request(permission);
      return status === 'granted';
    }
  }

  async function getIosInitialNearDental() {
    const hasLocationPermission = true;
    if (hasLocationPermission) {
      Geolocation.getCurrentPosition(
        (position) => {
          console.log('사용자 현재 위치 position', position);

          /*
                    setCurrentLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    })

                    */

          const lat = position.coords.latitude;
          const long = position.coords.longitude;

          const offset = offsetRef.current;
          const limit = limitRef.current;

          const location = {
            coordinate: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
            zoom: 16,
          };

          dispatch(allActions.dentalMapActions.setMapLocation(location));

          GETAroundDental({
            jwtToken,
            offset,
            limit,
            lat,
            long,
            sort,
            timeFilter,
            dayFilter,
            holidayFilter,
            parkingFilter,
          })
            .then((response: any) => {
              console.log('GETAroundDental response.length', response.length);
              dispatch(allActions.dentalMapActions.setLoadingGetDental(false));
              dispatch(allActions.dentalMapActions.setNearDentalArray(response));
              setIsVisibleReSearch(false);
            })
            .catch((error) => {
              console.log('GETAroundDental error', error);
              dispatch(allActions.dentalMapActions.setLoadingGetDental(false));
            });

          return position;
        },
        (error) => {
          console.log('사용자 현재 위치 불러오기 실패', error);
          ToastMessage.show("현재 위치를 불러오는데 실패했습니다ㅠㅠ");

          // 서울 시청 좌표
          const lat = 37.566515657875435
          const long = 126.9781164904998

          const offset = offsetRef.current;
          const limit = limitRef.current;

          GETAroundDental({
            jwtToken,
            offset,
            limit,
            lat,
            long,
            sort,
            timeFilter,
            dayFilter,
            holidayFilter,
            parkingFilter,
          })
            .then((response: any) => {
              console.log('GETAroundDental response.length', response.length);
              dispatch(allActions.dentalMapActions.setLoadingGetDental(false));
              dispatch(allActions.dentalMapActions.setNearDentalArray(response));
            })
            .catch((error) => {
              console.log('GETAroundDental error', error);
              dispatch(allActions.dentalMapActions.setLoadingGetDental(false));
            });



          return false;
        },
        {enableHighAccuracy: false, timeout: 10000, maximumAge: 10000},
      );
    }
  }

  const getNearDental = () => {
    const offset = offsetRef.current;
    const limit = limitRef.current;

    const lat = currentMapLocation.current.latitude;
    const long = currentMapLocation.current.longitude;
    const sort = 'd';
    dispatch(allActions.dentalMapActions.setLoadingGetDental(true));
    setSelectedDentalIndex(0);
    dentalCarouselRef.current?.snapToItem(0);

    GETAroundDental({
      jwtToken,
      offset,
      limit,
      lat,
      long,
      sort,
      timeFilter,
      dayFilter,
      holidayFilter,
      parkingFilter,
    })
      .then((response: any) => {
        setIsVisibleReSearch(false)
        console.log('GETAroundDental response in NearDentalMap', response);
        dispatch(allActions.dentalMapActions.setLoadingGetDental(false));
        dispatch(allActions.dentalMapActions.setNearDentalArray(response));

      })
      .catch((error) => {
        setIsVisibleReSearch(false)
        console.log('GETAroundDental error', error);
        dispatch(allActions.dentalMapActions.setLoadingGetDental(false));
      });
  };

  const filterNearDental = (
    tmpDayFilter: any,
    tmpTimeFilter: string,
    tmpParkingFilter: string,
    tmpHolidayFilter: boolean,
  ) => {

    const offset = offsetRef.current;
    const limit = limitRef.current;

    const lat = currentMapLocation.current.latitude;
    const long = currentMapLocation.current.longitude;
    const sort = 'd';
    const timeFilter = tmpTimeFilter;
    const dayFilter = tmpDayFilter;
    const parkingFilter = tmpParkingFilter;
    const holidayFilter = tmpHolidayFilter;

    dispatch(allActions.dentalMapActions.setLoadingGetDental(true));
    setSelectedDentalIndex(0);
    dentalCarouselRef.current?.snapToItem(0);

    GETAroundDental({
      jwtToken,
      offset,
      limit,
      lat,
      long,
      sort,
      timeFilter,
      dayFilter,
      holidayFilter,
      parkingFilter,
    })
      .then((response) => {
        console.log('GETAroundDental response in NearDentalMap', response);
        dispatch(allActions.dentalMapActions.setLoadingGetDental(false));
        dispatch(allActions.dentalMapActions.setNearDentalArray(response));
      })
      .catch((error) => {
        console.log('GETAroundDental error', error);
        dispatch(allActions.dentalMapActions.setLoadingGetDental(false));
      });
  };

  const filterSearchedDental = (
    query: string,
    tmpDayFilter: any,
    tmpTimeFilter: string,
    tmpParkingFilter: string,
    tmpHolidayFilter: boolean,
  ) => {
    dispatch(allActions.dentalMapActions.setLoadingGetDental(true));
    const lat = currentMapLocation.current.latitude;
    const long = currentMapLocation.current.longitude;

    const offset = offsetRef.current;
    const limit = limitRef.current;

    const dayFilter = tmpDayFilter;
    const timeFilter = tmpTimeFilter;
    const parkingFilter = tmpParkingFilter;
    const holidayFilter = tmpHolidayFilter;

    GETDentalTotalSearch({
      jwtToken,
      offset,
      limit,
      lat,
      long,
      query,
      sort,
      dayFilter,
      timeFilter,
      holidayFilter,
      parkingFilter,
    })
      .then((response: any) => {
        dispatch(allActions.dentalMapActions.setLoadingGetDental(false));
        console.log('GETDentalTotalSearch response', response);

        if (response.length > 0) {
          dispatch(allActions.dentalMapActions.setNearDentalArray(response));
        } else {
          dispatch(allActions.dentalMapActions.setNearDentalArray([]));
        }
      })
      .catch((error: any) => {
        dispatch(allActions.dentalMapActions.setLoadingGetDental(false));
        console.log('GETDentalTotalSearch error', error);
      });
  };

  const goBack = () => {
    navigation.goBack();
  };

  const moveToDentalSearch = () => {
    navigation.navigate('DentalTotalSearchScreen', {
      currentLocation: currentLocation,
      requestType: 'search',
      isNearDentalList: isNearDentalList.current,
      currentMapLongitude: currentMapLocation.current.longitude,
      currentMapLatitude: currentMapLocation.current.latitude, 
    });
  };

  const clickDentalMarker = (selectedIndex: number) => {
    
    setSelectedDentalIndex(selectedIndex);

    dentalCarouselRef.current?.snapToItem(selectedIndex, false);
  };

  const clickDayFilter = () => {
    setVisibleDayFilterModal(true);
  };

  const clickTimeFilter = () => {
      setVisibleTimeFilterModal(true);
  };

  const moveToDentalDetail = (dentalId: number) => {
    navigation.navigate('DentalDetailScreen', {
      dentalId: dentalId,
    });
  };

  const moveToDentalList = () => {
    dispatch(allActions.dentalMapActions.setSearchedDentalArray(nearDentalArray));
    navigation.navigate('DentalTotalSearchScreen', {
      currentLocation: currentLocation,
      requestType: 'dentalList',
      isNearDentalList: isNearDentalList.current,
      currentMapLongitude: currentMapLocation.current.longitude,
      currentMapLatitude: currentMapLocation.current.latitude,
    });
  };

  const clickMyLocationTrackingButton = () => {
    isNearDentalList.current = true;
    mapRef.current.setLocationTrackingMode(2);

    setTimeout(() => {
      getNearDental();
    }, 100)
  };

  const onSnapToDentalCarouselItem = useCallback((selectedIndex: number) => {
    console.log('onSnapToDentalCarouselItem index', selectedIndex);
    setSelectedDentalIndex(selectedIndex);
  }, []);

  const onMapCameraChange = (event: any) => {
    console.log('onMapCameraChange event', event);
    const prevMapLocation = {...currentMapLocation.current}
    currentMapLocation.current = event;

    // const distance = getDistanceFromLatLonInKm(prevMapLocation.latitude, prevMapLocation.longitude, currentMapLocation.current.latitude, currentMapLocation.current.longitude);

    setIsVisibleReSearch(true);
  };

  const clickDentalCallReservation = (phoneNumber: number) => {
    callPhoneNumber(phoneNumber);
  }

  // 두 좌표 사이의 거리를 구하는 함수
  function getDistanceFromLatLonInKm(lat1: number, lng1: number, lat2: number, lng2: number) {
    function deg2rad(deg) {
        return deg * (Math.PI/180)
    }

    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lng2-lng1);
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c; // Distance in km
    return d;
}

  const changeHolidayFilter = () => {
    console.log('changeHolidayFilter holidayFilter', holidayFilter);
    if (isNearDentalList.current) {
      filterNearDental(dayFilter, timeFilter, parkingFilter, !holidayFilter);
    } else {
      filterSearchedDental(
        searchedKeyword,
        dayFilter,
        timeFilter,
        parkingFilter,
        !holidayFilter,
      );
    }

    dispatch(allActions.dentalFilterActions.setHolidayFilter(!holidayFilter));
  };

  const changeParkingFilter = () => {
    if (parkingFilter === 'y') {
      if (isNearDentalList.current) {
        filterNearDental(dayFilter, timeFilter, 'n', holidayFilter);
      } else {
        filterSearchedDental(
          searchedKeyword,
          dayFilter,
          timeFilter,
          'n',
          holidayFilter,
        );
      }

      dispatch(allActions.dentalFilterActions.setParkingFilter('n'));
    } else if (parkingFilter === 'n') {
      if (isNearDentalList.current) {
        filterNearDental(dayFilter, timeFilter, 'y', holidayFilter);
      } else {
        filterSearchedDental(
          searchedKeyword,
          dayFilter,
          timeFilter,
          'y',
          holidayFilter,
        );
      }

      dispatch(allActions.dentalFilterActions.setParkingFilter('y'));
    }
  };

  const initializeDayFilter = () => {

    if (selectedDayList.length > 0) {

      const tmpDayFilter = new Array([]);

      dispatch(allActions.dentalFilterActions.initializeDayList());
      dispatch(allActions.dentalFilterActions.setSelectedDayList([]));

      if (isNearDentalList.current) {
        filterNearDental(
          tmpDayFilter,
          timeFilter,
          parkingFilter,
          holidayFilter,
        );
      } else {
        filterSearchedDental(
          searchedKeyword,
          tmpDayFilter,
          timeFilter,
          parkingFilter,
          holidayFilter,
        );
      }
    }

    setVisibleDayFilterModal(false);
  }

  const initializeTimeFilter = () => {

    if(timeFilter !== '') {
      dispatch(allActions.dentalFilterActions.setTimeFilter(''));

      const tmpTimeFilter = "";

      if(isNearDentalList.current) {
        filterNearDental(
          dayFilter,
          tmpTimeFilter,
          parkingFilter,
          holidayFilter,
        );
      } else {
        filterSearchedDental(
          searchedKeyword,
          dayFilter,
          tmpTimeFilter,
          parkingFilter,
          holidayFilter,
        );
      }

    }
    setVisibleTimeFilterModal(false);
  }

  const cancelDayFilter = () => {
    console.log('cancelDayFilter selectedDayFilter', selectDayFilterItem);
    console.log('cancelDayFilter dayList', dayList);
    var tmpDayList = dayList;
    var tmpSelectedDayList = selectedDayList;

    var preDayList = tmpDayList.map(function (item: any, index: number) {
      if (tmpSelectedDayList.includes(item)) {
        console.log('item', item);
        item.selected = true;
        return item;
      } else {
        item.selected = false;
        return item;
      }
    });

    //setDayFilterList(preDayList);
    dispatch(allActions.dentalFilterActions.setDayList(preDayList));
    //setSelectedDayFilter(preDayFilterList);
    setVisibleDayFilterModal(false);
  };

  const registerDayFilter = () => {
    console.log("dayFilter", dayFilter);
    console.log("selectedDayFilter", selectedDayList);

    var tmpDayList = dayList;

    var tmpSelectedDayList = new Array();
    var tmpDayFilter = new Array();

    tmpDayList.forEach((item: any, index: number) => {
      if (item.selected) {
        tmpDayFilter.push(item.value);
        tmpSelectedDayList.push(item);
      }
    });

    console.log('tmpSelectedDayList', tmpSelectedDayList);

    if (JSON.stringify(tmpDayFilter) !== JSON.stringify(dayFilter)) {
      dispatch(allActions.dentalFilterActions.setDayFilter(tmpDayFilter));
      dispatch(
        allActions.dentalFilterActions.setSelectedDayList(tmpSelectedDayList),
      );

      if (isNearDentalList.current) {
        filterNearDental(
          tmpDayFilter,
          timeFilter,
          parkingFilter,
          holidayFilter,
        );
      } else {
        filterSearchedDental(
          searchedKeyword,
          tmpDayFilter,
          timeFilter,
          parkingFilter,
          holidayFilter,
        );
      }
    }
    setVisibleDayFilterModal(false);
  };

  const selectDayFilterItem = (day: object, index: number) => {
    dispatch(allActions.dentalFilterActions.selectDayItem(index));
  };

  const onValueChangeHourPicker = (itemValue: any, itemIndex: number) => {
    console.log(
      'onValueChangeHourPicker itemValue, itemIndex',
      itemValue,
      itemIndex,
    );
    setHourPickerValue(itemValue);
  };

  const onValueChangeMinutePicker = (itemValue: any, itemIndex: number) => {
    console.log(
      'onValueChangeMinutePicker itemValue, itemIndex',
      itemValue,
      itemIndex,
    );
    setMinutePickerValue(itemValue);
  };

  const onValueChangeTimeSlotPicker = (itemValue: any, itemIndex: number) => {
    console.log(
      'onValueChangeTimeSlorPicker itemValue, itemIndex',
      itemValue,
      itemIndex,
    );
    setTimeSlotPickerValue(itemValue);
  };

  const cancelTimeFilter = () => {
    setVisibleTimeFilterModal(false);
  };

  const registerTimeFilter = () => {
    setVisibleTimeFilterModal(false);
    if (timeSlotPickerValue === '오전') {
      const formattedHourPickerValue =
        hourPickerValue < 10 ? '0' + hourPickerValue : hourPickerValue;
      const formattedTime =
        formattedHourPickerValue + ':' + minutePickerValue + ':00';

      if (timeFilter !== formattedTime) {
        dispatch(allActions.dentalFilterActions.setTimeFilter(formattedTime));

        if (isNearDentalList.current) {
          filterNearDental(
            dayFilter,
            formattedTime,
            parkingFilter,
            holidayFilter,
          );
        } else {
          filterSearchedDental(
            searchedKeyword,
            dayFilter,
            formattedTime,
            parkingFilter,
            holidayFilter,
          );
        }
      }
    } else if (timeSlotPickerValue == '오후') {
      const formattedTime =
        Number(hourPickerValue) + 12 + ':' + minutePickerValue + ':00';

      if (timeFilter !== formattedTime) {
        dispatch(allActions.dentalFilterActions.setTimeFilter(formattedTime));

        if (isNearDentalList.current) {
          filterNearDental(
            dayFilter,
            formattedTime,
            parkingFilter,
            holidayFilter,
          );
        } else {
          filterSearchedDental(
            searchedKeyword,
            dayFilter,
            formattedTime,
            parkingFilter,
            holidayFilter,
          );
        }
      }
    }
  };

  const reSearchNearDentalInCurrentLocation = () => {
    getNearDental();
  }

  const onPressTimeFilterActionSheet = (index: number) => {
    if (index === 1) {
      setVisibleTimeFilterModal(true);
    } else if (index === 2) {
      dispatch(allActions.dentalFilterActions.setTimeFilter(''));
    }
  };

  const renderDayFilterItem = ({item, index}: any) => {
    if (index < 7) {
      return (
        <TouchableWithoutFeedback
          onPress={() => selectDayFilterItem(item, index)}>
          <DetailFilterItemContainer
            style={
              [item.selected
                ? {backgroundColor: '#00D1FF'}
                : {backgroundColor: '#ffffff'},
              styles.detailFilterItemShadow]
            }>
            <DetailFilterItemText
            style={
              item.selected
              ? {color: "#FFFFFF"}
              : {color: "#9AA2A9"}
            }>{item.day + '요일'}</DetailFilterItemText>
          </DetailFilterItemContainer>
        </TouchableWithoutFeedback>
      );
    } else if (index >= 7) {
      return (
        <DetailFilterItemContainer style={{opacity: 0}}>
          <DetailFilterItemText>{item.day}</DetailFilterItemText>
        </DetailFilterItemContainer>
      );
    } else {
      return <DetailFilterItemContainer />;
    }
  };

  return (
      <Container>
        <MapContainer>
          <NaverMapContainer>
            <NaverMapView
              ref={mapRef}
              compass={false}
              style={{
                width: wp('100%'),
                height: hp('100%') - bottomTabheight,
              }}
              showsMyLocationButton={false}
              center={{...mapLocation, zoom: mapZoom}}
              onCameraChange={(event: any) => onMapCameraChange(event)}
              zoomControl={true}>
              {nearDentalArray.map((item: any, index: number) => {
                return (
                  <Marker
                    key={index}
                    coordinate={{
                      latitude: Number(item.geographLat),
                      longitude: Number(item.geographLong),
                    }}
                    onClick={() => clickDentalMarker(index)}
                    image={
                      index == selectedDentalIndex
                        ? require('~/Assets/Images/Map/ic_dentalMarker_selected.png')
                        : require('~/Assets/Images/Map/ic_dentalMarker_unselected.png')
                    }
                  />
                );
              })}
            </NaverMapView>
            <MapActionButtonContainer>
              <TouchableHighlight
                style={{borderRadius: 3}}
                activeOpacity={0.85}
                onPress={() => clickMyLocationTrackingButton()}>
                <MyLocationTrackingButton style={styles.mapActionButtonShadow}>
                  <TargetIcon
                    source={require('~/Assets/Images/Map/ic_target.png')}
                  />
                </MyLocationTrackingButton>
              </TouchableHighlight>
            </MapActionButtonContainer>
          </NaverMapContainer>
          <MapHeaderContainer>
          <SearchContainer>
          <TouchableWithoutFeedback onPress={() => moveToDentalSearch()}>
            <SearchInputContainer
            style={styles.searchInputShadow}>
              <SearchIcon
                source={require('~/Assets/Images/Search/ic_search.png')}
              />
              {searchedKeyword === '' && (
                <SearchPlaceHolderText>
                  {'지역, 병원을 검색해 보세요.'}
                </SearchPlaceHolderText>
              )}
              {searchedKeyword.length > 0 && (
                <SearchText>{searchedKeyword}</SearchText>
              )}
            </SearchInputContainer>
          </TouchableWithoutFeedback>
          </SearchContainer>
            <FilterListContainer>
              <ScrollView
                contentContainerStyle={{paddingTop: 12, paddingBottom: 12}}
                horizontal={true}
                showsHorizontalScrollIndicator={false}>
                {selectedDayList.length === 0 && (
                  <TouchableWithoutFeedback onPress={() => clickDayFilter()}>
                    <FilterItemContainer style={[{marginLeft: 16}, styles.filterItemShadow]}>
                      <FilterItemText>{'방문일'}</FilterItemText>
                    </FilterItemContainer>
                  </TouchableWithoutFeedback>
                )}
                {selectedDayList.length === 1 && (
                    <TouchableWithoutFeedback onPress={() => clickDayFilter()}>
                      <FilterItemContainer
                        style={[{marginLeft: 16, backgroundColor: '#ffffff', borderColor: "#9AA2A9"}, styles.filterItemShadow]}>
                        <FilterItemText style={{color: '#4E525D'}}>
                          {selectedDayList[0].day + '요일'}
                        </FilterItemText>
                      </FilterItemContainer>
                    </TouchableWithoutFeedback>
                  )}
                {selectedDayList.length > 1 &&
                  selectedDayList.indexOf('전체') === -1 && (
                    <TouchableWithoutFeedback onPress={() => clickDayFilter()}>
                      <FilterItemContainer
                        style={[{marginLeft: 16, backgroundColor: '#ffffff', borderColor: "#9AA2A9"}, styles.filterItemShadow]}>
                        {selectedDayList.map((item: any, index: number) => {
                          if (index === 0) {
                            return (
                              <FilterItemText 
                              key={index}
                              style={{color: '#4E525D'}}>
                                {item.day + '요일'}
                              </FilterItemText>
                            );
                          } else {
                            return (
                              <FilterItemText
                              key={index}
                              style={{color: '#4E525D'}}>
                                {', ' + item.day + '요일'}
                              </FilterItemText>
                            );
                          }
                        })}
                      </FilterItemContainer>
                    </TouchableWithoutFeedback>
                  )}
                <TouchableWithoutFeedback onPress={() => clickTimeFilter()}>
                  <FilterItemContainer
                    style={[
                      {marginLeft: 8},
                      timeFilter !== '' && {backgroundColor: '#ffffff', borderColor: "#9AA2A9"},
                      styles.filterItemShadow
                    ]}>
                    <FilterItemText
                      style={timeFilter !== '' && {color: '#4E525D'}}>
                      {timeFilter ? timeFilter.slice(0, 5) : '방문시간'}
                    </FilterItemText>
                  </FilterItemContainer>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => changeHolidayFilter()}>
                  <FilterItemContainer
                    style={[
                      {marginLeft: 8},
                      holidayFilter && {backgroundColor: '#ffffff', borderColor: "#9AA2A9"},
                      styles.filterItemShadow,
                    ]}>
                    <FilterItemText style={holidayFilter && {color: '#4E525D'}}>
                      {'일요일･공휴일 진료'}
                    </FilterItemText>
                  </FilterItemContainer>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => changeParkingFilter()}>
                  <FilterItemContainer
                    style={[
                      {marginLeft: 8, marginRight: 16},
                      parkingFilter === 'y' && {backgroundColor: '#ffffff', borderColor: '#9AA2A9'},
                      styles.filterItemShadow,
                    ]}>
                    <FilterItemText
                      style={parkingFilter === 'y' && {color: '#4E525D'}}>
                      {'주차가능'}
                    </FilterItemText>
                  </FilterItemContainer>
                </TouchableWithoutFeedback>
              </ScrollView>
            </FilterListContainer>
          </MapHeaderContainer>
          {nearDentalArray.length > 0 && (
          <DentalListContainer>
          <MapInsetBottomShadow style={styles.insetShadow} />
          <ViewDentalListContainer>
            {isVisibleReSearch && (
            <TouchableWithoutFeedback onPress={() => reSearchNearDentalInCurrentLocation()}>
            <ReSearchInCurrentRegionButton>
              <ViewDentalListText>{'현재위치에서 검색'}</ViewDentalListText>
            </ReSearchInCurrentRegionButton>
            </TouchableWithoutFeedback>
            )}
          <TouchableWithoutFeedback onPress={() => moveToDentalList()}>
            <ViewDentalListButton>
              <ViewDentalListIcon
              source={require('~/Assets/Images/Map/ic_viewDentalList.png')}/>
              <ViewDentalListText>{'목록보기'}</ViewDentalListText>
            </ViewDentalListButton>
          </TouchableWithoutFeedback>
          <EmptyView>
            <ViewDentalListText>{""}</ViewDentalListText>
          </EmptyView>
          </ViewDentalListContainer>
          {/* <ViewDentalListContainer
          style={{justifyContent: 'flex-end'}}>
          <TouchableWithoutFeedback onPress={() => moveToDentalList()}>
            <ViewDentalListButton>
              <ViewDentalListIcon
              source={require('~/Assets/Images/Map/ic_viewDentalList.png')}/>
              <ViewDentalListText>{'목록보기'}</ViewDentalListText>
            </ViewDentalListButton>
          </TouchableWithoutFeedback>
          </ViewDentalListContainer> */}
          <DentalCarouselList
            searchedDentalArr={nearDentalArray}
            moveToDentalDetail={moveToDentalDetail}
            onSnapToDentalCarouselItem={onSnapToDentalCarouselItem}
            todayIndex={todayIndex}
            selectedDentalIndex={selectedDentalIndex}
            dentalCarouselRef={dentalCarouselRef}
            clickDentalCallReservation={clickDentalCallReservation}
          />
          </DentalListContainer>
          )}
          {isVisibleReSearch && nearDentalArray.length === 0 && (
          <TouchableWithoutFeedback onPress={() => reSearchNearDentalInCurrentLocation()}>
          <ReSearchInCurrentRegionButton
          style={{position: "absolute", bottom: 20}}>
            <ViewDentalListText>{'현재위치에서 검색'}</ViewDentalListText>
          </ReSearchInCurrentRegionButton>
          </TouchableWithoutFeedback>
          )}
        {loadingGetDental && (
          <LoadingGetNearDentalContainer>
          <ActivityIndicator
          color={"#000000"}
          style={{zIndex: 10}}/>
          </LoadingGetNearDentalContainer>
        )}
        </MapContainer>
        <Modal
          isVisible={visibleDayFilterModal}
          style={styles.dayFilterModalView}
          onBackdropPress={() => cancelDayFilter()}
          swipeDirection={['down']}
          onSwipeComplete={() => setVisibleDayFilterModal(false)}
          backdropOpacity={0.25}>
          <DetailFilterModalContainer>
            <DetailFilterHeaderContainer>
              <DetailFilterTitleText>{'방문일 설정'}</DetailFilterTitleText>
            </DetailFilterHeaderContainer>
            <DetailFilterListContainer>
              <FlatList
              contentContainerStyle={{
                paddingBottom: 16,
                paddingLeft: 16,
                paddingRight: 16,
              }}
                columnWrapperStyle={{
                  justifyContent: 'space-between',
                  paddingTop: 16,
                }}
                data={dayList}
                keyExtractor={(item, index) => `${index}`}
                numColumns={5}
                renderItem={renderDayFilterItem}
              />
            </DetailFilterListContainer>
            <DetailFilterFooterContainer>
              <TouchableWithoutFeedback onPress={() => initializeDayFilter()}>
              <InitializeFilterContainer>
                <InitializeFilterText>{"방문일 초기화"}</InitializeFilterText>
                <InitializeFilterIcon
                source={require('~/Assets/Images/Map/ic_initialize.png')}/>
              </InitializeFilterContainer>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={() => registerDayFilter()}>
              <RegisterFilterButton>
                <RegisterFilterText>{"적용하기"}</RegisterFilterText>
              </RegisterFilterButton>
              </TouchableWithoutFeedback>
            </DetailFilterFooterContainer>
          </DetailFilterModalContainer>
        </Modal>
        <Modal
          isVisible={visibleTimeFilterModal}
          style={styles.timeFilterModalView}
          onBackdropPress={() => cancelTimeFilter()}
          backdropOpacity={0.25}>
          <DetailFilterModalContainer>
            <DetailFilterHeaderContainer>
              <DetailFilterTitleText>{'방문시간 설정'}</DetailFilterTitleText>
            </DetailFilterHeaderContainer>
            <TimeFilterModalContainer>
              <TimePickerContainer>
                <Picker
                  itemStyle={{fontSize: 20, fontWeight: "700", lineHeight: 24, color: "#131F3C"}}
                  style={{width: wp('20%'), height: hp('26%')}}
                  onValueChange={(itemValue, itemIndex) =>
                    onValueChangeTimeSlotPicker(itemValue, itemIndex)
                  }
                  selectedValue={timeSlotPickerValue}>
                  <Picker.Item label={'오전'} value="오전" />
                  <Picker.Item label={'오후'} value="오후" />
                </Picker>
                <Picker
                  itemStyle={{fontSize: 20, fontWeight: "700", lineHeight: 24, color: "#131F3C"}}
                  selectedValue={hourPickerValue}
                  onValueChange={(itemValue, itemIndex) =>
                    onValueChangeHourPicker(itemValue, itemIndex)
                  }
                  style={{width: wp('20%'), height: hp('26%')}}>
                  <Picker.Item label={'1'} value="1" />
                  <Picker.Item label={'2'} value="2" />
                  <Picker.Item label={'3'} value="3" />
                  <Picker.Item label={'4'} value="4" />
                  <Picker.Item label={'5'} value="5" />
                  <Picker.Item label={'6'} value="6" />
                  <Picker.Item label={'7'} value="7" />
                  <Picker.Item label={'8'} value="8" />
                  <Picker.Item label={'9'} value="9" />
                  <Picker.Item label={'10'} value="10" />
                  <Picker.Item label={'11'} value="11" />
                  <Picker.Item label={'12'} value="12" />
                </Picker>
                <TimePickerLabelText>{':'}</TimePickerLabelText>
                <Picker
                  itemStyle={{fontSize: 20, fontWeight: "700", lineHeight: 24, color: "#131F3C"}}
                  style={{width: wp('20%'), height: hp('26%')}}
                  onValueChange={(itemValue, itemIndex) =>
                    onValueChangeMinutePicker(itemValue, itemIndex)
                  }
                  selectedValue={minutePickerValue}>
                  <Picker.Item label={'00'} value="00" />
                  <Picker.Item label={'15'} value="15" />
                  <Picker.Item label={'30'} value="30" />
                  <Picker.Item label={'45'} value="45" />
                </Picker>
              </TimePickerContainer>
              <DetailFilterFooterContainer>
                <TouchableWithoutFeedback onPress={() => initializeTimeFilter()}>
                <InitializeFilterContainer>
                  <InitializeFilterText>{"방문시간 초기화"}</InitializeFilterText>
                  <InitializeFilterIcon
                  source={require('~/Assets/Images/Map/ic_initialize.png')}/>
                </InitializeFilterContainer>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => registerTimeFilter()}>
                <RegisterFilterButton>
                  <RegisterFilterText>{"적용하기"}</RegisterFilterText>
                </RegisterFilterButton>
                </TouchableWithoutFeedback>
              </DetailFilterFooterContainer>
              </TimeFilterModalContainer>
          </DetailFilterModalContainer>
        </Modal>
        <ActionSheet
          ref={timeFilterActionSheet}
          options={['취소', '수정하기', '삭제하기']}
          cancelButtonIndex={0}
          destructiveButtonIndex={2}
          onPress={(index: any) => onPressTimeFilterActionSheet(index)}
        />
      </Container>
  );
};

const styles = StyleSheet.create({
  searchInputShadow: {
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 10,
    shadowOpacity: 0.2,
  },
  filterItemShadow: {
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 6,
    shadowOpacity: 0.2,
  },
  detailFilterItemShadow: {
    shadowOffset: {
      width: 0.5,
      height: 1.5,
    },
    shadowRadius: 1,
    shadowOpacity: 0.2,
  },
  mapActionButtonShadow: {
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowRadius: 1,
    shadowOpacity: 0.3,
  },
  dayFilterModalView: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  timeFilterModalView: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  insetShadow: {
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 100,
    shadowOpacity: 0.4,
  },
  carouselIndexShadow: {
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 6,
    shadowOpacity: 0.5,
  },
  safeAreaStyle: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});

export default NearDentalMap;
