import React, {useState, useEffect, useRef} from 'react';
import Styled from 'styled-components/native';
import {TouchableWithoutFeedback, FlatList, ScrollView, Keyboard, StyleSheet, Alert} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { NavigationContainer } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';

const Container = Styled.SafeAreaView`
 flex: 1;
 background-color: #FFFFFF;
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
height: ${wp('13.8%')}px;
padding: 0px 16px 0px 15px;
 align-items: center;
 justify-content: center;
 flex-direction: row;
`;

const HeaderBackIcon = Styled.Image`
width: ${wp('6.4%')}px;
height: ${wp('6.4%')}px;
`;

const HeaderTitleText = Styled.Text`
margin-top: 5px;
font-weight: 700;
font-size: 18px;
color: #000000;
`;

const HeaderRightContainer = Styled.View`
height: ${wp('13.8%')}px;
padding: 0px 16px 0px 15px;
 align-items: center;
 justify-content: center;
 flex-direction: row;
`;

const HeaderEmptyContainer = Styled.View`
width: ${wp('6.4%')}px;
height: ${wp('6.4%')}px;
`;

const HeaderUploadText = Styled.Text`
font-weight: 400;
font-size: 18px;
color: #0075FF;
position: absolute;
right: 16px;
`;

const BodyContainer = Styled.View`
flex: 1;
`;

const TakePhotoText = Styled.Text`
`;

const GalleryText = Styled.Text`
margin-top: 30px;
`;

const MetaInfoContainer = Styled.View`
padding-top: 16px;
padding-bottom: 16px;
`;

const FirstMetaDataListContainer = Styled.View`
flex-direction: row;
align-items: center;
`;

const SecondMetaDataListContainer = Styled.View`
flex-direction: row;
align-items: center;
`;

const ContentContainer = Styled.View`
flex: 1;
background-color: #fbfbfb;
padding-top: 0px;
padding-bottom: 0px;
`;

const MetaInfoItemBackground = Styled.View`
padding: 4px 16px 4px 16px;
background-color: #F0F6FC;
border-radius: 100px;
flex-direction: row;
align-items: center;
`;

const MetaInfoItemTextList = Styled.Text`
flex-direction: row;
`;

const MetaInfoItemText = Styled.Text`
font-weight: 300
color: #0075FF;
font-size: 16px;
`;

const RatingStarIcon = Styled.Image`
width: ${wp('3.266%')}px;
height: ${wp('3.266%')}px;
`;


const DateModalContainer = Styled.View`
width: ${wp('100%')}px;
position: absolute;
bottom: 0;
background-color: #D5D8DD;
`;

const ModalHeaderContainer = Styled.View`
 border-width: 0.6px;
 border-color: #ECECEE;
 width: ${wp('100%')}px;
 height: ${wp('12.5%')}px;
 background-color: #FAFAFA;
 flex-direction: row;
 justify-content: flex-end;
 align-items: center;
 padding-left: 16px;
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

const TotalPriceInput = Styled.TextInput`
font-size: 16px;
color: #F0F6FC;
font-weight: 300;
padding-left: 10px;
`;

const TotalPriceContainer = Styled.View`
position: absolute;
align-items: center;
justify-content: center;
padding: 4px 16px 4px 12px;
`;

const ParaUnitContainer = Styled.View`
width: ${wp('91.4666%')}px;
background-color: #ffffff;
border-width: 1px;
border-color: #f1f1f1;
border-radius: 8px;
padding: 16px;
align-items: center;
justify-content: center;
`;

const EntireParaUnitContainer = Styled.View`
width: ${wp('100%')}px;
padding-top: 10px;
padding-bottom: 10px;
background-color: #fbfbfb;;
align-items: center;
justify-content: center;
`;

const AddImageContainer = Styled.View`
flex-direction: row;
align-items: center;
`;

const AddImageButton = Styled.View`
width: ${wp('82.933%')}px;
height: ${wp('17.06%')}px;
border-radius: 8px;
border-width: 1px;
border-color: #F1F1F1;
align-items: center;
justify-content: center;
`;

const AddImageIcon = Styled.Image`
width: ${wp('4.8%')}px;
height: ${wp('4.8%')}px;
`;

const AddImageText = Styled.Text`
margin-left: 6px;
font-weight: 300;
font-size: 14px;
color: #7A7A7A;
`;

const ParaTextInput = Styled.TextInput`
margin-top: 13px;
width: ${wp('82.933%')}px;
font-weight: 300;
font-size: 14px;
color: #2B2B2B;
`;

const AddNewParaUnitContainer = Styled.View`
position: absolute;

flex: 1;
`;

const AddNewParaUnitButton = Styled.Image`
width: ${wp('10.13%')};
height: ${wp('10.13%')};
`;

const ParaImage = Styled.Image`
width: ${wp('82.9%')}px;
height: ${wp('71.7%')}px;
border-radius: 8px;
`;


interface Props {
    navigation: any,
    route: any,
}

const ReviewContentScreen = ({navigation, route}: Props) => {
    const [metaInfoList1, setMetaInfoList1] = useState<Array<object>>([]);
    const [metaInfoList2, setMetaInfoList2] = useState<Array<object>>([]);
    const [dentalClinic, setDentalClinic] = useState<object>({});
    const [treatDate, setTreatDate] = useState<object>({});
    const [treatPrice, setTreatPrice] = useState<object>({});
    const [selectedTreatList, setSelectedTreatList] = useState<Array<object>>([]);
    const [rating, setRating] = useState<object>({});

    const [displayTotalPrice, setDisplayTotalPrice] = useState<string>(route.params.treatPrice.displayTreatPrice);
    const [totalPrice, setTotalPrice] = useState<any>(route.params.treatPrice.treatPrice);

    const [changeMetaInfo, setChangeMetaInfo] = useState<boolean>(false);
    const [visibleDatePicker, setVisibleDatePicker] = useState<boolean>(false);
    const [changeParagraphList, setChangeParagraphList] = useState<boolean>(false);

    const totalPriceInputRef = useRef()

    const [paragraphList, setParagraphList] = useState<Array<object>>([
        {
            index: 1,
            image: null,
            description: null,
        }
    ]);

    useEffect(() => {
        if(route.params?.selectedTreatList) {
            console.log("route.params.selectedTreatList", route.params.selectedTreatList);
            console.log("route.params?.dentalClinic", route.params.dentalClinic);
            console.log("route.params?.treatDate", route.params?.treatDate);
            console.log("route.params.treatPrice", route.params.treatPrice);
            console.log("route.params.rating", route.params?.rating);

            setMetaInfoList1([{data: route.params.dentalClinic, type: "dentalClinic"}, {data: route.params.treatDate,
            type: "treatDate"}, {data: route.params.treatPrice, type: "treatPrice"}])
            setMetaInfoList2([{data: route.params.selectedTreatList, type: "treatName"}, {data: route.params.rating, type: "rating"}, {data: route.params.selectedTreatList, type: "detailPrice"}])
        }
    }, [route.params?.selectedTreatList])

    useEffect(() => {
        if(route.params?.dentalClinic) {
            setDentalClinic(route.params?.dentalClinic)
        }
    }, [route.params?.dentalClinic])

    useEffect(() => {
        if(route.params?.treatDate) {
            setTreatDate(route.params?.treatDate)
        }
    }, [route.params?.treatDate])

    useEffect(() => {
        if(route.params?.treatPrice) {
            setTreatPrice(route.params?.treatPrice)
        }
    }, [route.params?.treatPrice])

    useEffect(() => {
        if(route.params?.selectedTreatList) {
            setSelectedTreatList(route.params?.selectedTreatList)
        }
    }, [route.params?.selectedTreatList])

    useEffect(() => {
        if(route.params?.rating) {
            setRating(route.params?.rating)
        }
    }, [route.params.rating])

    useEffect(() => {
        if(route.params?.selectedImages) {
            console.log("리뷰 업로드 route.params.selectedImages", route.params.selectedImages)

            route.params.selectedImages.forEach((item: any, index: number) => {
                console.log("선택된 사진 item", item)
                
                var tmpParagraphList = paragraphList
                var paraObj

                if(index == 0) {
                    paraObj = tmpParagraphList[route.params?.startIndex]
                    paraObj.image = item 

                    tmpParagraphList[route.params?.startIndex] = paraObj
                    setChangeParagraphList(!changeParagraphList)


                } else {
                    paraObj = {
                     index: paragraphList.length + index,
                     image: item,
                     description: "" 
                    }
                    
                    tmpParagraphList.push(paraObj)  
                }


                if(index == route.params.selectedImages.length-1) {
                    setParagraphList(tmpParagraphList)
                }
            })
        }
    }, [route.params?.selectedImages])

    const openCamera = () => {
        navigation.navigate("Camera");
    }

    const moveToGallery = () => {
        navigation.navigate("Gallery");
    }

    const goBack = () => {
        Alert.alert(
            '게시글 작성을 취소하시겠어요?',
            '',
            [
                {
                    text: '확인',
                    onPress: () => {
                        navigation.navigate("HomeScreen")
                    }
                },
                {
                    text: '취소',
                    onPress: () => 0,
                    style: 'cancel'
                }
            ]
        )
    }

    const moveToDentalClinicSearch = () => {
        navigation.push("DentalClinicSearchScreen", {
            requestPage: "content"
        })
    }

    const onPressTreatDate = () => {
        setVisibleDatePicker(true)
    }

    const onChangeDatePicker = (event: any, date: any) => {
        var tmpTreatDate = treatDate
        tmpTreatDate.treatDate = date
        setTreatDate(tmpTreatDate)
    }

    const applyTreatDate = () => {
        console.log("date", treatDate);
        var tmpTreatDate = treatDate;
        tmpTreatDate.displayTreatDate = convertDisplayDate(treatDate.treatDate);

        setTreatDate(tmpTreatDate);
        setVisibleDatePicker(false);
    }

    const convertDisplayDate = (date: any) => {
        var tmpDate = new Date(date),
        month = '' + (tmpDate.getMonth() + 1),
        day = '' + tmpDate.getDate(),
        year = '' + tmpDate.getFullYear()

        if(month.length < 2) month = "0" + month;
        if(day.length < 2) day = "0" + day;

        return year + "년" + " " + month + "월" + " " + day + "일"
    }

    const onPressTreatPrice = () => {
        totalPriceInputRef.current.focus()   
    }

    const onChangePriceInput = (text: string) => {
        console.log("text", text);
        console.log("treatPrice", treatPrice);
        setTotalPrice(text);
        setDisplayTotalPrice(Number(text).toLocaleString() + "원")
    }

    const moveToTreatSearch = () => {
        navigation.push("TreatSearchScreen", {
            requestPage: "content",
            selectedTreatList: selectedTreatList
        })
    }

    const moveToDetailPrice = () => {
        navigation.push("DetailPriceScreen", {
            requestPage: "content",
            selectedTreatList: selectedTreatList
        })
    }

    const moveToRating = () => {
        navigation.push("RatingScreen", {
            requestPage: "content",
            inputedRating: rating,
        })
    }

    const onPressBackground = () => {
        Keyboard.dismiss();
    }

    const onPressAddImage = (index: number) => {
        navigation.navigate("Gallery", {
            requestType: "review",
            startIndex: index
        })
    }

    const onPressAddPara = () => {
        var tmpParagraphList = paragraphList;
        var paraObj = {
            index: tmpParagraphList.length,
            image: null,
            description: null,
        }

        tmpParagraphList.push(paraObj)
        setParagraphList(tmpParagraphList);
        setChangeParagraphList(!changeParagraphList)
    }

    const renderParaUnitItem = ({item, index}: any) => {
        return (
        <EntireParaUnitContainer>
            <ParaUnitContainer style={styles.paragraphShadow}>
                {item.image && (
                    <ParaImage
                    source={{uri: item.image.uri}}/>
                )}
                {!item.image && (
                <TouchableWithoutFeedback onPress={() => onPressAddImage(index)}>
                <AddImageButton>
                  <AddImageContainer>
                    <AddImageIcon
                    source={require('~/Assets/Images/Upload/ic_addImage.png')}/>
                    <AddImageText>
                        사진 추가하기(선택)
                    </AddImageText>
                    </AddImageContainer>
                </AddImageButton>
                </TouchableWithoutFeedback>
                )}
                <ParaTextInput
                multiline={true}
                placeholder={"내용을 입력해 주세요 !"}
                placeholderTextColor={"#BFBFBF"}
                autoCapitalize={"none"}/>
            </ParaUnitContainer>
            </EntireParaUnitContainer>
        )
    }

    const renderAddParaUnitItem = () => {
        return (
        <TouchableWithoutFeedback onPress={() => onPressAddPara()}>
        <EntireParaUnitContainer>
        <ParaUnitContainer style={[styles.paragraphShadow, {opacity:0.15, shadowOpacity: 0.6}]}>
            <AddImageButton>
              <AddImageContainer>
                <AddImageIcon
                source={require('~/Assets/Images/Upload/ic_addImage.png')}/>
                <AddImageText>
                    사진 추가하기(선택)
                </AddImageText>
                </AddImageContainer>
            </AddImageButton>
            <ParaTextInput
            editable={false}
            multiline={true}
            placeholder={"내용을 입력해 주세요 !"}
            placeholderTextColor={"#BFBFBF"}
            autoCapitalize={"none"}/>
        </ParaUnitContainer>
        <AddNewParaUnitContainer>
            <AddNewParaUnitButton
            source={require('~/Assets/Images/Upload/ic_addPara.png')}/>
        </AddNewParaUnitContainer>
        </EntireParaUnitContainer>
        </TouchableWithoutFeedback>

        )
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
                <HeaderTitleText>작성</HeaderTitleText>
                <HeaderRightContainer>
                    <HeaderEmptyContainer/>
                    <HeaderUploadText>
                    올리기
                    </HeaderUploadText>
                </HeaderRightContainer>
            </HeaderBar>
            <BodyContainer>
                <MetaInfoContainer>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                    <FirstMetaDataListContainer>
                    <TouchableWithoutFeedback onPress={() => moveToDentalClinicSearch()}>
                    <MetaInfoItemBackground style={{marginLeft: 16}}>
                        <MetaInfoItemText>
                        {dentalClinic.name}
                        </MetaInfoItemText>
                    </MetaInfoItemBackground>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => onPressTreatDate()}>
                    <MetaInfoItemBackground style={{marginLeft: 8}}>
                        <MetaInfoItemText>
                        {treatDate.displayTreatDate}
                        </MetaInfoItemText>
                    </MetaInfoItemBackground>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => onPressTreatPrice()}>
                    <MetaInfoItemBackground style={{marginLeft: 8, marginRight: 16}}>
                        <TotalPriceInput
                        ref={totalPriceInputRef}
                        value={totalPrice}
                        keyboardType={"number-pad"}
                        caretHidden={true}
                        onChangeText={(text:string) => onChangePriceInput(text)}
                        />
                    <TotalPriceContainer>
                    <MetaInfoItemText>
                    {displayTotalPrice}
                    </MetaInfoItemText>
                    </TotalPriceContainer>
                    </MetaInfoItemBackground>
                    </TouchableWithoutFeedback>
                    </FirstMetaDataListContainer>
                </ScrollView>
                <ScrollView 
                horizontal={true} 
                showsHorizontalScrollIndicator={false}>
                    <SecondMetaDataListContainer style={{marginTop: 8}}>
                        <TouchableWithoutFeedback onPress={() => moveToTreatSearch()}>
                        <MetaInfoItemBackground style={{marginLeft: 16}}>
                            <MetaInfoItemTextList>
                            {selectedTreatList.map((treat: any, index: number) => {
                            if(index === selectedTreatList.length - 1) {
                            return (
                                <MetaInfoItemText>
                                {treat.name}
                                </MetaInfoItemText>
                            )   
                            } else {
                            return (
                            <MetaInfoItemText>
                            {treat.name + ","}
                            </MetaInfoItemText>
                        )
                    }
                })
                }
                </MetaInfoItemTextList>
                </MetaInfoItemBackground>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => moveToRating()}>
                <MetaInfoItemBackground style={{marginLeft: 8}}>
                <RatingStarIcon
                source={require('~/Assets/Images/Upload/ic_ratingStar.png')}/>
                <MetaInfoItemText style={{marginLeft: 2}}>
                {rating.aveRating}
                </MetaInfoItemText>
                </MetaInfoItemBackground>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => moveToDetailPrice()}>
                <MetaInfoItemBackground style={{marginLeft: 8, marginRight: 16}}>
                <MetaInfoItemText>
                {"상세비용"}
                </MetaInfoItemText>
                </MetaInfoItemBackground>
                </TouchableWithoutFeedback>
                </SecondMetaDataListContainer>
                </ScrollView>
                </MetaInfoContainer>
                <ContentContainer>
                    <FlatList
                    scrollEnabled={true}
                    showsVerticalScrollIndicator={false}
                    data={paragraphList}
                    renderItem={renderParaUnitItem}
                    ListFooterComponent={renderAddParaUnitItem}/>
                </ContentContainer>
            </BodyContainer>
            {visibleDatePicker && (
            <DateModalContainer>
                <ModalHeaderContainer>
                    <TouchableWithoutFeedback onPress={() => applyTreatDate()}>
                    <ModalFinishContainer>
                        <ModalFinishText>완료</ModalFinishText>
                    </ModalFinishContainer>
                    </TouchableWithoutFeedback>
                </ModalHeaderContainer>
                    <DateTimePicker
                    locale={'ko_KR.UTF-8'}
                    style={{flex:1}}
                    testID="datePicker"
                    value={treatDate.treatDate}
                    onChange={(event,date) => onChangeDatePicker(event,date)}
                    mode={'date'}
                    display='spinner'
                    is24Hour={true}
                    maximumDate={new Date()}
                    />
            </DateModalContainer>
            )}
        </Container>
    )
}

export default ReviewContentScreen

const styles = StyleSheet.create({
    paragraphShadow: {
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowRadius: 8,
        shadowOpacity: 0.09
    }
})


/*
<FlatList
showsHorizontalScrollIndicator={false}
horizontal={true}
data={metaInfoList1}
renderItem={renderFirstMetaInfoItem}/>
<FlatList
style={{marginTop: 8}}
showsHorizontalScrollIndicator={false}
horizontal={true}
data={metaInfoList2}
renderItem={renderSecondMetaInfoItem}/>
*/