import React, {useState, useEffect, useRef, useCallback} from 'react';
import Styled from 'styled-components/native';
import SafeAreaView from 'react-native-safe-area-view';
import {TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform, StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import DateTimePicker from '@react-native-community/datetimepicker';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import AboveKeyboard from 'react-native-above-keyboard';
import DeviceInfo from 'react-native-device-info';
import ActionSheet from 'react-native-actionsheet';
import {Picker} from '@react-native-picker/picker';
import Modal from 'react-native-modal';

import {launchCamera} from 'react-native-image-picker';

// Local Components
import NavigationHeader from '~/Components/Presentational/NavigationHeader';

const Container = Styled.View`
 flex: 1;
 padding-top: ${getStatusBarHeight()}px;
 background-color: #FFFFFF;
`;


const BodyContainer = Styled.ScrollView`
background-color: #F5F7F9;
padding-bottom: 100px;
`;

const ScrollViewInnerContainer = Styled.View`
background-color: #F5F7F9;
`;

const MetaDataItemContainer = Styled.View`
background-color: #ffffff;
padding-top: 16px;
padding-bottom: 16px;
padding-left: 16px;
padding-right: 0px;
`;

const MetaDataHeaderContainer = Styled.View`
flex-direction: row;
align-items: center;
`;

const MetaDataLabelContainer = Styled.View`
flex-direction: row;
flex: 1;
`;

const MetaDataLabelText = Styled.Text`
font-weight: 700;
font-size: 14px;
line-height: 24px;
color: #131F3C;
`;


const AsteriskText = Styled.Text`
margin-top: 3px;
margin-left: 2px;
font-weight: 400;
font-size: 15px;
line-height: 24px;
color: #FF001F;
`;

const MetaDataValueContainer = Styled.View`
flex-direction: row;
padding-top: 8px;
padding-bottom: 8px;
background-color: #ffffff;
border-bottom-width: 1px;
border-color: #F5F7F9;
`;

const MetaDataPlaceholderText = Styled.Text`
font-weight: 400;
font-size: 16px;
line-height: 24px;
color: #9AA2A9;
`;

const MetaDataText = Styled.Text`
font-weight: 400
font-size: 16px;
line-height: 24px;
color: #131F3C;
`;

const FooterContainer = Styled.View`
width: ${wp('100%')}px;
position: absolute;
bottom: 53px;
`;

const FinishButtonContainer = Styled.View`
width: ${wp('100%')}px;
align-items: center;
`;

const FinishButton = Styled.View`
width: ${wp('91.46%')}px;
height: ${wp('12.799%')}px;
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

const DateModalContainer = Styled.View`
width: ${wp('100%')}px;
position: absolute;
bottom: 0;
background-color: #D5D8DD;
`;

const ModalHeaderContainer = Styled.View`
 width: ${wp('100%')}px;
 padding-left: 16px;
 background-color: #FAFAFA;
 flex-direction: row;
 justify-content: flex-end;
`;

const ModalFinishContainer = Styled.View`
padding-top: 12px;
padding-bottom: 12px;
padding-right: 16px
`;

const ModalFinishText = Styled.Text`
 font-size: 16px;
 color: #267DFF;
`;

const PriceTextInput = Styled.TextInput`
flex: 1;
font-weight: 400;
font-size: 16px;
color: #ffffff;
`;

const DisplayPriceText = Styled.Text`
font-weight: 400;
font-size: 16px;
color: #131F3C;
`;

const DisplayPriceContainer = Styled.View`
top: 8px;
position: absolute;
justify-content: center;
`;

const HighlightLabelBackground = Styled.View`
background-color: #DAECFE90;
`;

const HighlightLabelBackgroundContainer = Styled.View`
position:absolute;
bottom: 4px;
width: ${wp('100%')}px;
height: 10.5px;
background-color: #DAECFE;
`;

const CoverHighlight = Styled.View`
flex: 1;
background-color: #ffffff;
`;

const MetaDataGuideText = Styled.Text`
margin-top: 2px;
font-weight: 400;
font-size: 10px;
line-height: 16px;
color: #9AA2A9;
`;

const SelectImagesContainer = Styled.View`
padding-top: 16px;
background-color: #ffffff;
`;


const GalleryContainerView = Styled.View`
width: ${wp('100%')}px;
margin-bottom: ${DeviceInfo.hasNotch() ? 0 : 16}px;
`;

const GalleryFlatList = Styled.FlatList`
width: ${wp('100%')}px;
`;


const ItemContainerView = Styled.View`
width: ${wp('19.2%')}px;
height: ${wp('19.2%')}px;
margin-right: 8px;
justify-content: flex-end;
overflow: visible;
`;

const ItemImage = Styled.Image`
width: ${wp('17.86%')}px;
height: ${wp('17.86%')}px;
border-width: 0.5px;
border-color: #E2E6ED;
border-radius: 2px;
`;

const DeleteButtonView = Styled.View`
width: ${wp('5.479%')}px;
height: ${wp('5.479%')}px;
align-items: center;
justify-content: center;
position: absolute;
top: 0px;
right: 0px;
z-index: 1;
background: #131F3C80;
border-radius: 100px;
`;
const DeleteButtonImage = Styled.Image`
width: ${wp('4.26%')}px;
height: ${wp('4.26%')}px;
`;

const UploadImageButtonImage = Styled.Image`
width: ${wp('19.2%')}px;
height: ${wp('19.2%')}px;
margin: 0px 16px 0px 0px;
`;

const SelectedDentalItemContainer = Styled.View`
padding: 4px 12px 4px 12px;
border-radius: 100px;
background-color: #F5F7F9;
`;

const SelectedDentalNameText = Styled.Text`
font-weight: 400;
font-size: 14px;
line-height: 24px;
color: #131F3C;
`;


const SelectedTreatContainer = Styled.View`
width: ${wp('100%')}px;
background-color: #ffffff;
padding-top: 8px;
padding-right: 16px;
flex-direction: row;
flex-wrap: wrap;
`;

const SelectedTreatItemBackground = Styled.View`
margin-bottom: 8px;
padding-left: 12px;
padding-top: 4px;
padding-bottom: 4px;
background-color: #ffffff;
border-width: 1px;
border-color: #E2E6ED;
border-radius: 100px;
flex-direction: row;
align-items: center;
`;

const SelectedTreatItemText = Styled.Text`
color: #131F3C;
font-weight: 400;
font-size: 14px;
line-height: 24px;
`;

const DeleteTreatItemContainer = Styled.View`
padding-right: 12px;
padding-left: 4px;
padding-top: 4px;
padding-bottom: 4px;
`;

const TreatItemDeleteIcon = Styled.Image`
padding-left: 4px;
padding-right: 12px;
width: ${wp('4.8%')}px;
height: ${wp('4.8%')}px;
`;

const RatingContainer = Styled.View`
flex-direction: row;
align-items: center;
`;

const RatingItemContainer = Styled.View`
flex-direction: row;
align-items: center;
padding-top: 4px;
padding-left: 12px;
padding-bottom: 4px;
padding-right: 12px;
background-color: #F5F7F9;
border-radius: 100px;
`;

const RatingLabelText = Styled.Text`
font-weight: 400;
font-size: 11px;
line-height: 24px;
color: #9AA2A9;
`;

const RatingHorizontalDivider = Styled.View`
margin-left: 4px;
margin-right: 4px;
width: 1px;
height: ${hp('0.98%')}px;
background-color: #E2E6ED;
`;

const RatingValueText = Styled.Text`
font-weight: 700;
font-size: 14px;
line-height: 24px;
color: #131F3C;
`;

const TotalPriceKeyboardHeader = Styled.View`
flex-direction: row;
justify-content: flex-end;
width: ${wp('100%')}px;
padding-top: 12px;
padding-bottom: 12px;
padding-left: 16px;
padding-right: 16px;
background-color: #FAFAFA;
`;

const TreatmentDateModal = Styled.Modal`
`;

const TreatmentDateModalContainer = Styled.View`
width: ${wp('100%')}px;
background-color: #ffffff;
border-top-left-radius: 20px;
border-top-right-radius: 20px;
position: absolute;
bottom: 0;
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

const DetailFilterTitleText = Styled.Text`
font-weight: 700;
font-size: 14px;
line-height: 19px;
color: #000000;
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

const FilterDividingText = Styled.Text`
font-weight: normal;
font-size: 18px;
line-height: 24px;
color: #131F3C;
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


interface Props {
  navigation: any;
  route: any;
}

type dentalData = {
  name: string;
  address: string;
  id: number;
};

type RatingObj = {
  serviceRating: any;
  priceRating: any;
  treatmentRating: any;
}

const ReviewMetaDataScreen = ({navigation, route}: Props) => {
  const [treatmentDateObj, setTreatmentDateObj] = useState<any>({
    displayTreatmentDate: '',
    treatmentDate: ''
  });

  const [totalPrice, setTotalPrice] = useState<string>('');

  const [dentalObj, setDentalObj] = useState<object>({});
  const [treatmentArray, setTreatmentArray] = useState<Array<any>>([]);
  const [ratingObj, setRatingObj] = useState<RatingObj>({
    serviceRating: null,
    treatmentRating: null,
    priceRating: null,
  });

  const [displayPrice, setDisplayPrice] = useState<any>();

  const [isActivatedNext, setIsActivatedNext] = useState<boolean>(false);
  const [isVisibleDatePicker, setIsVisibleDatePicker] = useState<boolean>(false);
  const [isFocusedTotalPriceInput, setIsFocusedTotalPriceInput] = useState<boolean>(false);

  const [selectedTreatmentYear, setSelectedTreatmentYear] = useState<any>(`${new Date().getFullYear()}`);
  const [selectedTreatmentMonth, setSelectedTreatmentMonth] = useState<any>(`${new Date().getMonth() + 1}`);
  const [selectedTreatmentDay, setSelectedTreatmentDay] = useState<any>(`${new Date().getDate()}`);

  const [selectedProofImages, setSelectedProofImages] = useState<Array<any>>([]);
  const [selectedDentalImages, setSelectedDentalImages] = useState<Array<any>>([]);

  const actionSheetItemList = ['취소', '촬영', '앨범'];

  const scrollY = useRef<number>(0);
  const scrollViewRef = useRef<any>();
  const totalPriceViewRef = useRef<any>();

  const actionSheetRefByProof = useRef() as any;
  const actionSheetRefByDental = useRef() as any;

  useEffect(() => {
    console.log("ReviewMetaDataScreen route", route)
  }, [route]);
  
  useEffect(() => {
    if(route.params?.selectedProofImages) {
      setSelectedProofImages(route.params.selectedProofImages)
    }
  }, [route.params?.selectedProofImages]);

  useEffect(() => {
    if(route.params?.selectedDentalImages) {
      setSelectedDentalImages(route.params.selectedDentalImages)
    }
  }, [route.params?.selectedDentalImages])

  const priceInputRef = useRef<any>();

  useEffect(() => {
    if(route.params?.selectedTreatmentArray) {
      setTreatmentArray(route.params?.selectedTreatmentArray);
    }      
  }, [route.params?.selectedTreatmentArray])

  useEffect(() => {
    if (route.params?.dentalObj) {
      console.log("route.params.dentalObj", route.params.dentalObj);
      setDentalObj(route.params?.dentalObj);
    }
  }, [route.params?.dentalObj]);

  useEffect(() => {
    if(route.params?.ratingObj) {
      console.log("route.params?.ratingObj", route.params.ratingObj);
      setRatingObj(route.params?.ratingObj);
    }
  }, [route.params?.ratingObj]);

  useEffect(() => {
    if(route.params?.treatmentDateObj) {
      console.log("route.params?.treatmentDateObj", route.params.treatmentDateObj);
      setTreatmentDateObj(route.params?.treatmentDateObj)
    }
  }, [route.params?.treatmentDateObj])

  useEffect(() => {
    Keyboard.addListener('keyboardWillShow', _keyboardWillShow);
    Keyboard.addListener("keyboardWillHide", _keyboardWillHide);

    // cleanup function
    return () => {
      Keyboard.removeListener("keyboardWillHide", _keyboardWillHide);
    };
  }, []);

  useEffect(() => {
    if(dentalObj.originalName && treatmentArray.length > 0 && ratingObj.serviceRating &&  treatmentDateObj.treatmentDate !== '') {
      setIsActivatedNext(true)
    } else {
      setIsActivatedNext(false);
    }
  }, [dentalObj, treatmentArray, ratingObj, treatmentDateObj])

  useEffect(() => {
    if(route.params?.totalPriceObj) {
      console.log("route.params?.totalPriceObj", route.params?.totalPriceObj);
      setDisplayPrice(route.params?.totalPriceObj.displayTreatPrice);
      setTotalPrice(route.params?.totalPriceObj.treatPrice);
    }
  }, [route.params?.totalPriceObj])

  const _keyboardWillShow = () => {
};

  const _keyboardWillHide = () => {
      setIsFocusedTotalPriceInput(false);
  };

  const unSelectProofImage = useCallback((image) => {
    setSelectedProofImages((prev) => {
      const targetIndex = prev.findIndex(
        (item) => item.filename === image.filename,
      );
      const newSelectedProofImages = prev.concat();
      if (targetIndex >= 0) {
        newSelectedProofImages.splice(targetIndex, 1);
        return newSelectedProofImages;
      } else {
        return prev;
      }
    });
  }, []);

  const unSelectDentalImage = useCallback((image) => {
    setSelectedDentalImages((prev) => {
      const targetIndex = prev.findIndex(
        (item) => item.filename === image.filename,
      );
      const newSelectedDentalImages = prev.concat();
      if (targetIndex >= 0) {
        newSelectedDentalImages.splice(targetIndex, 1);
        return newSelectedDentalImages;
      } else {
        return prev;
      }
    });
  }, []);

  const goBack = () => {
    navigation.goBack();
  };

  const moveToDentalSearch = () => {
    navigation.navigate('DentalNameSearchScreen', {
      requestPage: 'metadata',
    });
    
    priceInputRef.current.blur();
  };

  const moveToTreatmentSearch = () => {
    navigation.navigate('TreatSearchScreen');
  }

  const moveToRatingScreen = () => {
    navigation.navigate("RatingScreen", {
      ratingObj: ratingObj
    });
  }

  const onPressTreatmentDate = () => {
    setIsVisibleDatePicker(true);
    priceInputRef.current.blur();
  };

  const onPressTotalPrice = () => {

    if (priceInputRef.current.isFocused()) priceInputRef.current.blur();
    else priceInputRef.current.focus();

    if(treatmentArray.length === 0 && !ratingObj.serviceRating) {
      if(scrollY.current < hp('6%')) {
        scrollViewRef.current.scrollTo({y: hp('8%')})
      }
    } else if(treatmentArray.length > 0 && !ratingObj.serviceRating) {
      if(scrollY.current < hp('8.5%')) {
        scrollViewRef.current.scrollTo({y: hp('12%')})
      }
    } else if(treatmentArray.length === 0 && ratingObj.serviceRating) {
      if(scrollY.current < hp('6.5%')) {
        scrollViewRef.current.scrollTo({y: hp('10%')})
      }
    } else if(treatmentArray.length > 0 && ratingObj.serviceRating) {
      if(scrollY.current < hp('10%')) {
        scrollViewRef.current.scrollTo({y: hp('13.5%')})
      }
    }
  };


  const convertDisplayDate = (date: any) => {
    console.log('convertDisplayDate date', date);

    var tmpDate = new Date(date),
      month = '' + (tmpDate.getMonth() + 1),
      day = '' + tmpDate.getDate(),
      year = '' + tmpDate.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    console.log('convertDisplayDate day', day);

    return year + '.' + ' ' + month + '.' + ' ' + day + '.';
  };

  const convertSubmitDate = (date: any) => {
    console.log('convertDisplayDate date', date);

    var tmpDate = new Date(date),
      month = '' + (tmpDate.getMonth() + 1),
      day = '' + tmpDate.getDate(),
      year = '' + tmpDate.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return year + '-' + month + '-' + day;
  };

  const onChangeDatePicker = (event: any, date: any) => {
    setDate(date);
  };

  const onPressBackground = () => {
    console.log("onPressBackground")
    if(isVisibleDatePicker) {
      setIsVisibleDatePicker(false);
    }

    // if(isFocusedTotalPriceInput) {
    //   setIsFocusedTotalPriceInput(false); 
    // }

    Keyboard.dismiss();
  };

  const onChangeTotalPriceInput = (text: string) => {
    if(text.trim() !== "") {
      setTotalPrice(text);
      setDisplayPrice(Number(text).toLocaleString() + '원');
    } else {
      setTotalPrice("");
      setDisplayPrice("");
    }
  };

  const finishTotalPriceInput = () => {
    Keyboard.dismiss();
  }

  const onFocusTotalPriceInput = () => {
      if(treatmentArray.length === 0 && !ratingObj.serviceRating) {
        if(scrollY.current < hp('6%')) {
          scrollViewRef.current.scrollTo({y: hp('8%')})
        }
      } else if(treatmentArray.length > 0 && !ratingObj.serviceRating) {
        if(scrollY.current < hp('8.5%')) {
          scrollViewRef.current.scrollTo({y: hp('12%')})
        }
      } else if(treatmentArray.length === 0 && ratingObj.serviceRating) {
        if(scrollY.current < hp('6.5%')) {
          scrollViewRef.current.scrollTo({y: hp('10%')})
        }
      } else if(treatmentArray.length > 0 && ratingObj.serviceRating) {
        if(scrollY.current < hp('10%')) {
          scrollViewRef.current.scrollTo({y: hp('13.5%')})
        }
      }
  }

  const moveToContentPost = () => {
    console.log("route.params?.paragraphArray", route.params?.paragraphArray);
    navigation.navigate('ContentPostScreen', {
      dentalObj,
      treatmentArray,
      ratingObj,
      treatmentDate: treatmentDateObj.treatmentDate,
      totalPrice,
      selectedProofImages,
      selectedDentalImages,
      requestType: route.params?.requestType,
      paragraphArray: route.params?.paragraphArray ? route.params?.paragraphArray : [{
        index: 1,
        image: null,
        description: "",
      },],
      reviewId: route.params?.reviewId,
    })
  }

  const onPressActionSheetByProof = useCallback(
    (index: number) => {
      switch (actionSheetItemList[index]) {
        case '촬영':
          navigateToCameraByProof();
          break;
        case '앨범':
          navigateToGalleryByProof();
          break;
      }
    },
    [actionSheetItemList],
  );

  const onPressActionSheetByDental = useCallback(
    (index: number) => {
      switch (actionSheetItemList[index]) {
        case '촬영':
          navigateToCameraByDental();
          break;
        case '앨범':
          navigateToGalleryByDental();
          break;
      }
    },
    [actionSheetItemList],
  );

  const navigateToCameraByProof = useCallback(() => {
    launchCamera({includeBase64: true, mediaType: 'photo'}, (response: CameraResponse) => {
      if (!response.didCancel) {
        const capturedImage = {
          filename: response.fileName,
          fileSize: response.fileSize,
          width: response.width,
          height: response.height,
          uri: response.uri,
          base64: response.base64,
          camera: true,
        };
        setSelectedProofImages((prev) => [...prev, capturedImage]);
      }
    });
  }, []);


  const navigateToCameraByDental = useCallback(() => {
    launchCamera({includeBase64: true, mediaType: 'photo'}, (response: CameraResponse) => {
      if (!response.didCancel) {
        const capturedImage = {
          filename: response.fileName,
          fileSize: response.fileSize,
          width: response.width,
          height: response.height,
          uri: response.uri,
          base64: response.base64,
          camera: true,
        };
        setSelectedProofImages((prev) => [...prev, capturedImage]);
      }
    });
  }, []);

  const navigateToGalleryByProof = useCallback(() => {
    navigation.navigate('ImageSelectScreen', {
      requestType: 'proofImage',
      selectedImages: selectedProofImages,
    });
  }, [])

  const navigateToGalleryByDental = useCallback(() => {
    navigation.navigate('ImageSelectScreen', {
      requestType: 'dentalImage',
      selectedImages: selectedDentalImages,
    });
  }, [])

  const cancelTreatmentDateModal = useCallback(() => {
    setIsVisibleDatePicker(false);
  }, []);


  const deleteTreatItem = (treat: object) => {
    var tmpTreatmentArray = treatmentArray.slice();
    var deleteIndex = tmpTreatmentArray.indexOf(treat);

    tmpTreatmentArray.splice(deleteIndex, 1);
    setTreatmentArray(tmpTreatmentArray);
  };

  const initializeTreatmentDate = () => {
    setIsVisibleDatePicker(false);
    setTreatmentDateObj({});
  }

  const registerTreatmentDate = () => {
    setIsVisibleDatePicker(false);

    const tmpTreatmentDate = {
      displayTreatmentDate: selectedTreatmentYear + '.' + selectedTreatmentMonth + '.' + selectedTreatmentDay,
      treatmentDate: selectedTreatmentYear + '-' + selectedTreatmentMonth + '-' + selectedTreatmentDay
    }

    setTreatmentDateObj(tmpTreatmentDate);
  };

  const renderProofImageListHeader = useCallback(
    () => (
      <TouchableWithoutFeedback
        onPress={() => {
          actionSheetRefByProof.current.show();
        }}>
        <UploadImageButtonImage
          source={require('~Assets/Images/Camera/Master/community/btn/uploadImage.png')}
        />
      </TouchableWithoutFeedback>
    ),
    [],
  );


  const renderDentalImageListHeader = useCallback(
    () => (
      <TouchableWithoutFeedback
        onPress={() => {
          actionSheetRefByDental.current.show();
        }}>
        <UploadImageButtonImage
          source={require('~Assets/Images/Camera/Master/community/btn/uploadImage.png')}
        />
      </TouchableWithoutFeedback>
    ),
    [],
  );


  const renderProofImageItem = useCallback(
    ({item, index}) => (
      <TouchableWithoutFeedback onPress={() => unSelectProofImage(item)}>
        <ItemContainerView>
          <DeleteButtonView>
            <DeleteButtonImage
              source={require('~/Assets/Images/Picture/ic_delete.png')}
            />
          </DeleteButtonView>
          <ItemImage
            source={
              item.img_url
                ? {uri: item.img_url} // edit mode s3 image
                : {
                    uri: item.base64
                    ? 'data:image/jpeg;base64,' + item.base64
                    : item.uri,
                  }
            }
          />
        </ItemContainerView>
      </TouchableWithoutFeedback>
    ),
    [],
  );

  const renderDentalImageItem = useCallback(
    ({item, index}) => (
      <TouchableWithoutFeedback onPress={() => unSelectDentalImage(item)}>
        <ItemContainerView>
          <DeleteButtonView>
            <DeleteButtonImage
              source={require('~/Assets/Images/Picture/ic_delete.png')}
            />
          </DeleteButtonView>
          <ItemImage
            source={
              item.img_url
                ? {uri: item.img_url} // edit mode s3 image
                : {
                    uri: item.base64
                      ? 'data:image/jpeg;base64,' + item.base64
                      : item.uri,
              }
            }
          />
        </ItemContainerView>
      </TouchableWithoutFeedback>
    ),
    [],
  );

  const renderYearPickerItem = useCallback(() => {
    const startYear = 1900;
    const currentYear = new Date(Date.now()).getFullYear();
    const result = [];
    for (let i = 0; i < (currentYear - startYear) + 1; i++) {
      result.push(
        <Picker.Item
          label={String(startYear + i)}
          value={String(startYear + i)}
        />,
      );
    }
    return result;
  }, []);

  const renderMonthPickerItem = useCallback(() => {
    const result = [];
    for (let i = 1; i <= 12; i++) {
      result.push(<Picker.Item label={String(i)} value={String(i)} />);
    }
    return result;
  }, []);

  const renderDayPickerItem = useCallback(() => {
    const result = [];
    for (let i = 1; i <= 31; i++) {
      result.push(<Picker.Item label={String(i)} value={String(i)} />);
    }
    return result;
  }, []);

  return (
      <Container>
        <NavigationHeader
        headerLeftProps={{type: 'arrow', onPress: goBack}}
        headerTitle={"관련정보"}
        headerRightProps={{type: 'text', text: "다음", onPress: moveToContentPost}}
        headerRightDisabled={!isActivatedNext}
        headerRightActiveColor={"#00D1FF"}/>
        <BodyContainer
        ref={scrollViewRef}
        keyboardDismissMode={'none'}
        bounces={true}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 100}}
        onScroll={(event: any) => {
          console.log("event.nativeEvent.contentOffset.y", event.nativeEvent.contentOffset.y)
          scrollY.current = event.nativeEvent.contentOffset.y
        }}
        scrollEventThrottle={16}
        >
          <TouchableWithoutFeedback onPress={() => onPressBackground()}>
          <ScrollViewInnerContainer>
          <MetaDataItemContainer>
          <MetaDataHeaderContainer>
          <MetaDataLabelText>{"병원명"}</MetaDataLabelText>
          <AsteriskText>{"*"}</AsteriskText>
          </MetaDataHeaderContainer>
          <TouchableWithoutFeedback onPress={() => moveToDentalSearch()}>
            <MetaDataValueContainer>
            {!dentalObj.originalName && (
              <MetaDataPlaceholderText>{"방문한 병원의 이름을 선택하세요."}</MetaDataPlaceholderText>
            )}
            {dentalObj.originalName && (
              <SelectedDentalItemContainer>
                <SelectedDentalNameText>{dentalObj.originalName}</SelectedDentalNameText>
              </SelectedDentalItemContainer>
            )}
            </MetaDataValueContainer>
          </TouchableWithoutFeedback>
          </MetaDataItemContainer>
          <MetaDataItemContainer>
          <MetaDataHeaderContainer>
          <MetaDataLabelText>{"질병 및 치료 항목"}</MetaDataLabelText>
          <AsteriskText>{"*"}</AsteriskText>
          </MetaDataHeaderContainer>
          <TouchableWithoutFeedback onPress={() => moveToTreatmentSearch()}>
            <MetaDataValueContainer>
            {treatmentArray.length === 0 && (
              <MetaDataPlaceholderText>{"질병 및 치료 항목을 선택하세요."}</MetaDataPlaceholderText>
            )}
            {treatmentArray.length > 0 && (
            <SelectedTreatContainer>
            {treatmentArray.map((item: any, index: number) => {
              return (
                <SelectedTreatItemBackground 
                key={index}
                style={{marginRight: 8}}>
                  <SelectedTreatItemText>
                    {'# ' + item.name}
                  </SelectedTreatItemText>
                  <TouchableWithoutFeedback onPress={() => deleteTreatItem(item)}>
                    <DeleteTreatItemContainer>
                      <TreatItemDeleteIcon
                        source={require('~/Assets/Images/Upload/ic_delete.png')}
                      />
                    </DeleteTreatItemContainer>
                  </TouchableWithoutFeedback>
                </SelectedTreatItemBackground>
              );
          })}
        </SelectedTreatContainer>
            )}
            </MetaDataValueContainer>
          </TouchableWithoutFeedback>
          </MetaDataItemContainer>
          <MetaDataItemContainer>
          <MetaDataHeaderContainer>
          <MetaDataLabelText>{"병원 만족도"}</MetaDataLabelText>
          <AsteriskText>{"*"}</AsteriskText>
          </MetaDataHeaderContainer>
          <TouchableWithoutFeedback onPress={() => moveToRatingScreen()}>
            <MetaDataValueContainer>
            {!ratingObj.serviceRating && (
              <MetaDataPlaceholderText>{"병원 만족도를 알려주세요."}</MetaDataPlaceholderText>
            )}
            {ratingObj.serviceRating && (
              <RatingContainer>
                <RatingItemContainer
                style={{marginLeft: 0}}>
                  <RatingLabelText>{"진료"}</RatingLabelText>
                  <RatingHorizontalDivider/>
                  <RatingValueText>{ratingObj.treatmentRating.toFixed(1)}</RatingValueText>
                </RatingItemContainer>
                <RatingItemContainer
                style={{marginLeft: 8}}>
                  <RatingLabelText>{"비용"}</RatingLabelText>
                  <RatingHorizontalDivider/>
                  <RatingValueText>{ratingObj.priceRating.toFixed(1)}</RatingValueText>
                </RatingItemContainer>
                <RatingItemContainer
                style={{marginLeft: 8}}>
                  <RatingLabelText>{"서비스"}</RatingLabelText>
                  <RatingHorizontalDivider/>
                  <RatingValueText>{ratingObj.serviceRating.toFixed(1)}</RatingValueText>
                </RatingItemContainer>
              </RatingContainer>
            )}
            </MetaDataValueContainer>
          </TouchableWithoutFeedback>
          </MetaDataItemContainer>
          <MetaDataItemContainer>
          <MetaDataHeaderContainer>
          <MetaDataLabelText>{"방문 일자"}</MetaDataLabelText>
          <AsteriskText>{"*"}</AsteriskText>
          </MetaDataHeaderContainer>
          <TouchableWithoutFeedback onPress={() => onPressTreatmentDate()}>
            <MetaDataValueContainer>
            {treatmentDateObj?.displayTreatmentDate === "" && (
            <MetaDataPlaceholderText>{"방문일을 알려주세요."}</MetaDataPlaceholderText>
            )}
            {treatmentDateObj?.displayTreatmentDate !== "" && (
            <MetaDataText>{treatmentDateObj?.displayTreatmentDate}</MetaDataText>
            )}
            </MetaDataValueContainer>
          </TouchableWithoutFeedback>
          </MetaDataItemContainer>
          <MetaDataItemContainer
          onLayout={(event) => {
            console.log("전체치료비용 onLayout event.nativeEvent", event.nativeEvent);

          }}>
          <MetaDataHeaderContainer>
          <MetaDataLabelText>{"전체 치료 비용(선택)"}</MetaDataLabelText>
          </MetaDataHeaderContainer>
          <TouchableWithoutFeedback onPress={() => onPressTotalPrice()}>
            <MetaDataValueContainer>
              <PriceTextInput
                ref={priceInputRef}
                value={totalPrice}
                placeholder={totalPrice === "" ? "전체 비용을 알려주세요." : ""}
                placeholderTextColor={"#9AA2A9"}
                autoCapitalize={'none'}
                keyboardType={'numeric'}
                onChangeText={(text: string) => onChangeTotalPriceInput(text)}
                onFocus={() => onFocusTotalPriceInput()}
                caretHidden={true}
              />
              <DisplayPriceContainer>
                <DisplayPriceText>{displayPrice}</DisplayPriceText>
              </DisplayPriceContainer>
            </MetaDataValueContainer>
          </TouchableWithoutFeedback>
          </MetaDataItemContainer>
          <MetaDataItemContainer
          style={{marginTop: 8}}>
          <MetaDataHeaderContainer>
              <MetaDataLabelContainer>
              <HighlightLabelBackgroundContainer>
              <HighlightLabelBackground/>
              </HighlightLabelBackgroundContainer>
              <MetaDataLabelText>{"증빙자료 첨부하기(선택)"}</MetaDataLabelText>
              <CoverHighlight/>
              </MetaDataLabelContainer>
          </MetaDataHeaderContainer>
          <MetaDataGuideText>{"진료 영수증, 카드 결제내역 등 내원 및 진료를 확증할만한 이미지를 첨부해주세요."}</MetaDataGuideText>
          <SelectImagesContainer>  
            <GalleryContainerView>
              <GalleryFlatList
              data={selectedProofImages}
              horizontal
              alwaysBounceHorizontal={false}
              scrollIndicatorInsets={{bottom: -1, left: 13, right: 8}}
              keyExtractor={(item: any) =>
                'preview' + (item.filename || item.img_filename)
              }
              renderItem={renderProofImageItem}
              ListHeaderComponent={renderProofImageListHeader}
              showsHorizontalScrollIndicator={false}
              />
            </GalleryContainerView>
          </SelectImagesContainer>
          </MetaDataItemContainer>
          <MetaDataItemContainer>
          <MetaDataHeaderContainer>
            <MetaDataLabelContainer>
              <MetaDataLabelText>{"병원 이미지 첨부하기(선택)"}</MetaDataLabelText>
            </MetaDataLabelContainer>
          </MetaDataHeaderContainer>
          <MetaDataGuideText>{"병원 외부 혹은 내부 이미지를 첨부해주세요."}</MetaDataGuideText>
          <SelectImagesContainer>  
            <GalleryContainerView>
              <GalleryFlatList
              data={selectedDentalImages}
              horizontal
              alwaysBounceHorizontal={false}
              scrollIndicatorInsets={{bottom: -1, left: 13, right: 8}}
              
              keyExtractor={(item: any) =>
                'preview' + (item.filename || item.img_filename)
              }
              renderItem={renderDentalImageItem}
              ListHeaderComponent={renderDentalImageListHeader}
              showsHorizontalScrollIndicator={false}
              />
              </GalleryContainerView>
          </SelectImagesContainer>
          </MetaDataItemContainer>
          </ScrollViewInnerContainer>
          </TouchableWithoutFeedback>
        </BodyContainer>
        <Modal
        isVisible={isVisibleDatePicker}
        style={styles.treatmentDateModalView}
        onBackdropPress={() => cancelTreatmentDateModal()}
        backdropOpacity={0.25}
        >
        <TreatmentDateModalContainer>
            <DetailFilterHeaderContainer>
              <DetailFilterTitleText>{'방문일 설정'}</DetailFilterTitleText>
            </DetailFilterHeaderContainer>
            <TimeFilterModalContainer>
            <TimePickerContainer>
              <Picker
                itemStyle={{
                  fontSize: 20,
                  fontWeight: '700',
                  lineHeight: 24,
                  color: '#131F3C',
                }}
                style={{width: wp('20%'), height: '100%'}}
                onValueChange={(itemValue: any) => setSelectedTreatmentYear(itemValue)}
                selectedValue={selectedTreatmentYear}>
                {renderYearPickerItem()}
              </Picker>
              <FilterDividingText>{'년'}</FilterDividingText>
              <Picker
                itemStyle={{
                  fontSize: 20,
                  fontWeight: '700',
                  lineHeight: 24,
                  color: '#131F3C',
                }}
                selectedValue={selectedTreatmentMonth}
                onValueChange={(itemValue: any) => setSelectedTreatmentMonth(itemValue)}
                style={{width: wp('20%'), height: '100%'}}>
                {renderMonthPickerItem()}
              </Picker>
              <FilterDividingText>{'월'}</FilterDividingText>
              <Picker
                itemStyle={{
                  fontSize: 20,
                  fontWeight: '700',
                  lineHeight: 24,
                  color: '#131F3C',
                }}
                style={{width: wp('20%'), height: '100%'}}
                onValueChange={(itemValue: any) => setSelectedTreatmentDay(itemValue)}
                selectedValue={selectedTreatmentDay}>
                {renderDayPickerItem()}
              </Picker>
              <FilterDividingText>{'일'}</FilterDividingText>
            </TimePickerContainer>
              <DetailFilterFooterContainer>
                <TouchableWithoutFeedback onPress={() => initializeTreatmentDate()}>
                <InitializeFilterContainer>
                  <InitializeFilterText>{"방문일 초기화"}</InitializeFilterText>
                  <InitializeFilterIcon
                  source={require('~/Assets/Images/Map/ic_initialize.png')}/>
                </InitializeFilterContainer>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => registerTreatmentDate()}>
                <RegisterFilterButton>
                  <RegisterFilterText>{"적용하기"}</RegisterFilterText>
                </RegisterFilterButton>
                </TouchableWithoutFeedback>
              </DetailFilterFooterContainer>
              </TimeFilterModalContainer>
          </TreatmentDateModalContainer>
        </Modal>
        {/* {isFocusedTotalPriceInput && (
          <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ModalHeaderContainer>
              <TouchableWithoutFeedback onPress={() => finishTotalPriceInput()}>
                <ModalFinishContainer>
                  <ModalFinishText>완료</ModalFinishText>
                </ModalFinishContainer>
              </TouchableWithoutFeedback>
            </ModalHeaderContainer>
          </KeyboardAvoidingView>
        )} */}
        <ActionSheet
          ref={actionSheetRefByProof}
          options={actionSheetItemList}
          cancelButtonIndex={0}
          onPress={(index: any) => onPressActionSheetByProof(index)}
        />
        <ActionSheet
          ref={actionSheetRefByDental}
          options={actionSheetItemList}
          cancelButtonIndex={0}
          onPress={(index: any) => onPressActionSheetByDental(index)}
        />
      </Container>
  );
};

const styles = StyleSheet.create({
  treatmentDateModalView: {
    justifyContent: 'flex-end',
    margin: 0,
  },
})

export default ReviewMetaDataScreen;


/*
  <FooterContainer>
          <AboveKeyboard>
            <FinishButtonContainer>
              <TouchableWithoutFeedback onPress={() => onPressFinishButton()}>
                <FinishButton>
                  <FinishText>확인</FinishText>
                </FinishButton>
              </TouchableWithoutFeedback>
            </FinishButtonContainer>
          </AboveKeyboard>
        </FooterContainer>
*/
