import React, {useState, useEffect, useRef, createRef} from 'react';
import Styled from 'styled-components/native';
import {
  TouchableWithoutFeedback,
  FlatList,
  ScrollView,
  KeyboardAvoidingView,
  Keyboard,
  View,
  ActivityIndicator,
  RefreshControl,
  Alert,
  StyleSheet,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useSelector, useDispatch} from 'react-redux';
import allActions from '~/actions';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import ActionSheet from 'react-native-actionsheet';
import { getStatusBarHeight } from 'react-native-status-bar-height';

// Local Component
import ReviewInformation from '~/Components/Presentational/ReviewDetailScreen/ReviewInformation';
import ReviewContent from '~/Components/Presentational/ReviewDetailScreen/ReviewContent';
import ReviewPreviewCommentList from '~/Components/Presentational/ReviewDetailScreen/ReviewPreviewCommentList';
import ReviewBottomBar from '~/Components/Presentational/ReviewDetailScreen/ReviewBottomBar';
import DentalInfomation from '~/Components/Presentational/ReviewDetailScreen/DentalInfomation';
import DetailMetaInfo from '~/Components/Presentational/ReviewDetailScreen/DetailMetaInfo';
import NavigationHeader from '~/Components/Presentational/NavigationHeader';
import TreatmentList from '~/Components/Presentational/ReviewDetailScreen/TreatmentList';
import ReviewMetaInfo from '~/Components/Presentational/ReviewDetailScreen/ReviewMetaInfo';
import WriterInfo from '~/Components/Presentational/ReviewDetailScreen/WriterInfo';

// Route
import GETReviewDetail from '~/Routes/Review/GETReviewDetail';
import POSTReply from '~/Routes/Comment/POSTReply';
import DELETEReview from '~/Routes/Review/DELETEReview';
import POSTReviewLike from '~/Routes/Review/POSTReviewLike';
import DELETEReviewLike from '~/Routes/Review/DELETEReviewLike';
import POSTReviewScrap from '~/Routes/Review/POSTReviewScrap';
import DELETEReviewScrap from '~/Routes/Review/DELETEReviewScrap';

const Container = Styled.SafeAreaView`
 flex: 1;
 background-color: #FFFFFF;
`;

const BodyContainer = Styled.View`
flex: 1;
background-color: #ffffff;
`;

const ScrollViewContainer = Styled.View`
`;

const BottomBarContainer = Styled.View`
position: absolute;
bottom: 0;
width: ${wp('100%')}px;
`;

const TreatmentListContainer = Styled.View`
`;

const ReviewContentContainer = Styled.View`
`;

const DentalInfoContainer = Styled.View`
`;

const CommentListContainer = Styled.View`
`;

const MetaInfoContainer = Styled.View`
padding-top: 20px;
padding-left: 16px;
padding-right: 16px;
padding-bottom: 20px;
`;

const IndicatorContainer = Styled.View`
width: ${wp('100%')}px;
padding-top: ${hp('30%')}px;
background-color: #ffffff
align-items: center;
justify-content: center;
flex: 1;
`;

const TransIndicatorContainer = Styled.View`
position: absolute;
width: ${wp('100%')}px;
height: ${hp('100%')}px;
background-color: #00000040;
align-items: center;
justify-content: center;
`;

const MoreViewModalContainer = Styled.View`
position: absolute;
top: ${getStatusBarHeight() + hp('6.5%') - hp('1.23%')}px;
right: ${wp('4.26')}px;
background-color: #ffffff;
border-width: 1px;
border-color: #E2E6ED;
border-radius: 12px;
`;

const MoreViewItemContainer = Styled.View`
padding-top: ${hp('1.477%')}px;
padding-bottom: ${hp('1.477%')}px;
padding-left: ${wp('4.26%')}px;
padding-right: ${wp('18.13%')}px;
border-bottom-width: 1px;
border-color: #E2E6ED;
`;

const MoreViewItemLabelText = Styled.Text`
font-family: NanumSquare;
font-size: 16px;
font-weight: 700;
color: #000000;
`;

const WriterInfoContainer = Styled.View`
`;

const TEST_REVIEW_DETAIL_DATA = {
  user: {
    profile_image:
      'https://i.pinimg.com/564x/25/cd/bf/25cdbfb4c026ab04e3754ae707a4c7eb.jpg',
    nickname: '전윤정',
  },
  createdAt: '2020-10-22',
  tagOne: '치아교정',
  tagTwo: '부정교합',
  rating: 3.5,
  location: '서울시 강남구',
  treat_date: '2020.09.24',
  mediaFiles: [
    {
      image_uri: 'https://fimg4.pann.com/new/download.jsp?FileID=49691685',
    },
    {
      image_uri: 'https://fimg4.pann.com/new/download.jsp?FileID=49691687',
    },
    {
      image_uri: 'https://fimg4.pann.com/new/download.jsp?FileID=49691693',
    },
  ],

  paragraph: [
    {
      index: 1,
      type: 'description',
      description:
        '교정 전 저는 저 스스로도 심한 콤플렉스 였고, 시작하면서 여쭤보니 교정치과 의사쌤도 중상 수준이라고 하셨어요.',
    },
    {
      index: 2,
      type: 'description',
      description:
        '엄청 편한 사이 아니고서는 무조건 입도 가리고 웃고 치아 드러나게 사진 찍는거 되도록 피하고 그러다보니 입매 항상 이상하고 어색하고...',
    },
    {
      index: 3,
      type: 'description',
      description:
        '그래도 해야지 해야지 마음만, 생각만 하고요... 진짜 딱 세월만 보내고 있었어요. 그 중 제일 큰 이유는 돈이죠. 어마어마 하게 많이 들 줄 알고요. 교정치료 전문 치과 없는 계속 외진 곳에서 산 것도 한 몫 했고요.',
    },
    {
      index: 4,
      type: 'description',
      description:
        '이제부턴 ((((혐짤로)))) 봐도 무방한 제 옥수수들을 자랑하겠습니다.',
    },
    {
      index: 5,
      type: 'image',
      date: '2019년 10월 1일',
      image_uri: 'https://fimg4.pann.com/new/download.jsp?FileID=49691685',
    },
    {
      index: 6,
      type: 'image',
      date: '2019년 12월 3일',
      image_uri: 'https://fimg4.pann.com/new/download.jsp?FileID=49691687',
    },
    {
      index: 7,
      type: 'image',
      date: '2020년 1월 5일',
      image_uri: 'https://fimg4.pann.com/new/download.jsp?FileID=49691693',
    },
    {
      index: 8,
      type: 'description',
      description:
        '나 진짜 너무 신난당 덧니가 너무 컴플렉스여서 시작한 교정인데 아프기도 무지 아팠고 관리도 힘들고 길고도 긴 시간이였다 ㅎㅅㅎ.. ',
    },
    {
      index: 9,
      type: 'description',
      description:
        '나는 클리피쉬 교정으로 380정도 든거같어 근데 유지장치도 2년정도 해야된다더라......괜찮아.. 겉에는 안보이니까 웃을때 이제 활짝 웃을 수 있어서 너뮤 조앙 ㅎㅎㅎ ',
    },
  ],
  comments: [
    {
      commentId: 1,
      user: {
        profile_image:
          'http://imgmmw.mbn.co.kr/storage/news/2019/08/13/3274f4fbbaa2020ff9d1fb706be99787.jpg',
        nickname: '메렁메렁',
      },
      comment: '잘 되셨네요ㅜㅜㅜㅜ 얼마에 하셨나요? 쪽지 부탁드려요.',
      createdAt: '2020-10-21',
      replys: [],
    },
    {
      commentId: 2,
      user: {
        profile_image:
          'http://imgmmw.mbn.co.kr/storage/news/2019/08/13/3274f4fbbaa2020ff9d1fb706be99787.jpg',
        nickname: '메렁메렁',
      },
      comment: '잘 되셨네요ㅜㅜㅜㅜ 얼마에 하셨나요? 쪽지 부탁드려요.',
      createdAt: '2020-10-21',
      replys: [],
    },
  ],
};

interface Props {
  navigation: any;
  route: any;
}

interface WriterObj {
  nickname: string;
  profileImage: string;
  userId: string;
}

interface DentalObj {
  name: string;
  address: string;
  id: any;
}

interface RatingObj {
  avgRating: number;
  serviceRating: number;
  treatRating: number;
  priceRating: number;
}

let selectedCommentId: number;

const ReviewDetailScreen = ({navigation, route}: Props) => {
  const [paragraphArray, setParagraphArray] = useState<Array<any>>([]);
  const [dentalInfo, setDentalInfo] = useState<DentalObj>(
    route.params?.dentalObj,
  );

  const [isCurUserLike, setIsCurUserLike] = useState<boolean>(
    route.params?.isCurUserLike,
  );
  const [isCurUserScrap, setIsCurUserScrap] = useState<boolean>(
    route.params?.isCurUserScrap,
  );
  const [likeCount, setLikeCount] = useState<number>(route.params?.likeCount);
  const [commentCount, setCommentCount] = useState<number>(
    route.params?.commentCount,
  );
  const [viewCount, setViewCount] = useState<number>(0);

  const [commentArray, setCommentArray] = useState<Array<any>>([]);
  const [isCommentInputFocused, setIsCommentInputFocused] = useState<boolean>(
    false,
  );
  const [paddingBottom, setPaddingBottom] = useState<number>(hp('8%'));

  const [loadingReviewDetail, setLoadingReviewDetail] = useState<boolean>(
    false,
  );
  const [loadingCommentPost, setLoadingCommentPost] = useState<boolean>(false);
  const [refreshingReviewDetail, setRefreshingReviewDetail] = useState<boolean>(
    false,
  );

  const [treatmentDate, setTreatmentDate] = useState<any>({});
  const [treatmentList, setTreatmentList] = useState<Array<object>>([]);
  const [rating, setRating] = useState<RatingObj>(route.params?.ratingObj);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [detailPriceList, setDetailPriceList] = useState<Array<object>>([]);

  // 화면에 표시되는 정보
  const [paragraphArrayDisplay, setParagraphArrayDisplay] = useState<
    Array<any>
  >([]);
  const [treatmentArrayDisplay, setTreatmentArrayDisplay] = useState<
    Array<any>
  >(route.params?.treatmentArray);
  const [treatmentDateDisplay, setTreatmentDateDisplay] = useState<String>(
    route.params?.treatmentDate,
  );
  const [elapsedTime, setElapsedTime] = useState<string>(route.params?.elapsedTime);
  const [isVisibleOwnMoreViewModal, setIsVisibleOwnMoreViewModal] = useState<boolean>(false);
  const [isVisibleOtherMoreViewModal, setIsVisibleOtherMoreViewModal] = useState<boolean>(false);

  const [isCertifiedReceipt, setIsCertifiedReceipt] = useState<boolean>(false);

  const scrollViewRef = useRef<any>();
  const reviewScrollViewRef = useRef<any>(null);
  const commentActionSheetRef = createRef<any>();

  const dispatch = useDispatch();
  const currentUser = useSelector((state: any) => state.currentUser);
  const reviewList = useSelector((state: any) => state.reviewList);
  const jwtToken = currentUser.jwtToken;
  const userProfile = currentUser.profile;

  const reviewId = route.params?.reviewId;
  const writerObj = route.params?.writer;

  const createdDate = route.params?.createdAt;
  const isVisibleElapsedTime = route.params?.visibleElapsedTime;
  const imageArray = route.params?.imageArray;
  const isOwnReview = route.params?.writer.userId == userProfile.id;

  console.log('route.params?.reviewId', route.params?.reviewId);
  console.log('route.params?.imageArray', route.params?.imageArray);
  console.log('route.params?.writer', route.params?.writer);
  console.log('route.params?.writer.userId', route.params?.writer.userId);
  console.log('userProfile.id', userProfile.id);
  console.log('route.params?.ratingObj', route.params?.ratingObj);
  console.log('route.params?.dentalObj', route.params?.dentalObj);
  console.log('route.params?.treatmentDate', route.params.treatmentDate);
  console.log("route.params?.elapsedTime", route.params?.elapsedTime);

  useEffect(() => {
    setLoadingReviewDetail(true);
    getReviewDetail();
  }, []);

  useEffect(() => {
    console.log('리뷰수정 취소', route.params?.isCancelRevise);
    if (route.params?.isCancelRevise) {
      reviewScrollViewRef.current.scrollTo({x: 0, y: 0, animated: false});
      route.params.isCancelRevise = !route.params.isCancelRevise;
    }
  }, [route.params?.isCancelRevise]);

  useEffect(() => {
    if (route.params?.isRevised) {
      route.params.isRevised = !route.params.isRevised;
      reviewScrollViewRef.current.scrollTo({x: 0, y: 0, animated: false});
      console.log(
        'route.params?.revisedParagraphArray',
        route.params.paragraphArray,
      );
      setParagraphArrayDisplay(route.params.paragraphArray);
      setTreatmentArrayDisplay(route.params.treatmentArray);
      setTreatmentDateDisplay(route.params.treatmentDate);
      setRating(route.params.ratingObj);
      setDentalInfo(route.params.dentalObj);
    }
  }, [
    route.params?.isrRevised,
    route.params?.paragraphArray,
    route.params?.treatmentArray,
    route.params?.ratingObj,
    route.params?.dentalObj,
  ]);

  /*
  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
    Keyboard.addListener('keyboardWillShow', _keyboardWillShow);
    Keyboard.addListener('keyboardWillHide', _keyboardWillHide);

    // cleanup function
    return () => {
      Keyboard.removeListener('keyboardDidShow', _keyboardDidShow);
      Keyboard.removeListener('keyboardWillHide', _keyboardWillHide);
    };
  }, []);
  */

  const _keyboardWillShow = (e: any) => {
    setPaddingBottom(e.endCoordinates.height + hp('5%'));
  };

  const _keyboardDidShow = (e: any) => {
    //setPaddingBottom(e.endCoordinates.height);
    if (route.params?.isCancelRevise == true) {
      reviewScrollViewRef.current.scrollTo({x: 0, y: 0, animated: false});
    } else {
      reviewScrollViewRef.current.scrollToEnd({animated: true});
    }
  };

  const _keyboardWillHide = () => {
    setPaddingBottom(hp('8%'));
    setIsCommentInputFocused(false);
    setTimeout(() => {
      if (route.params?.isCancelRevise == true) {
        reviewScrollViewRef.current.scrollTo({x: 0, y: 0, animated: false});
      } else {
        reviewScrollViewRef.current.scrollToEnd({animated: true});
      }
    }, 0);
  };



  const getReviewDetail = () => {
    GETReviewDetail(jwtToken, reviewId)
      .then((response: any) => {
        console.log('GETReviewDetail response', response);
        console.log(
          'GETReviewDetail response.reviewBody.TreatmentItems',
          response.reviewBody.TreatmentItems,
        );
        console.log(
          'GETReviewDetail response.reviewBody.review_contents',
          response.reviewBody.review_contents,
        );
        setTotalPrice(response.reviewBody.totalCost);
        setLoadingReviewDetail(false);
        setIsCertifiedReceipt(response.reviewBody.certifiedBill);
        setRefreshingReviewDetail(false);

        const tmpTreatmentDate = new Date(response.reviewBody.treatmentDate);
          const splitedTreatmentDate = response.reviewBody.treatmentDate.split(
            '-',
          );
          const tmpDisplayTreatDate =
            splitedTreatmentDate[0] +
            '년 ' +
            splitedTreatmentDate[1] +
            '월 ' +
            splitedTreatmentDate[2] +
            '일';

          const treatmentObj = {
            displayTreatDate: tmpDisplayTreatDate,
            treatDate: tmpTreatmentDate,
          };

        // 현재 사용자의 리뷰일때 리뷰 수정용 데이터 변환 작업
        if (isOwnReview) {
          const tmpTreatmentList = response.reviewBody.TreatmentItems.map(
            (item: any, index: number) => {
              let tmpTreatmentObj;
              if (item.review_treatment_item.cost !== null) {
                tmpTreatmentObj = {
                  name: item.name,
                  price: item.review_treatment_item.cost,
                  displayPrice:
                    Number(item.review_treatment_item.cost).toLocaleString() +
                    '원',
                  id: item.id,
                };
              } else {
                tmpTreatmentObj = {
                  name: item.name,
                  id: item.id,
                };
              }

              return tmpTreatmentObj;
            },
          );

          const tmpDetailPriceList = new Array();

          response.reviewBody.TreatmentItems.forEach(
            (item: any, index: number) => {
              if (item.review_treatment_item.cost !== null) {
                tmpDetailPriceList.push(item);
              }
            },
          );

          setTimeout(() => {
            setDetailPriceList(tmpDetailPriceList);
            setTreatmentList(tmpTreatmentList);
            //setRating(tmpRating);
          }, 10);
        }

        const tmpParagraphArray = response.reviewBody.review_contents.map(
          (item: any, index: number) => {
            let paraObj = new Object();

            if (item.img_url) {
              paraObj = {
                id: item.id,
                index: item.index,
                image: {
                  uri: item.img_url,
                  name: item.img_name,
                  size: item.img_size,
                  mimeType: item.mime_type,
                },
                description: item.description,
                order: item.img_before_after,
                isPreExis: true,
              };

              return paraObj;
            } else {
              paraObj = {
                id: item.id,
                index: item.index,
                description: item.description,
              };
            }

            return paraObj;
          },
        );

        // 글 작성자 정보
        const userObj = {
          nickname: response.reviewBody.user.nickname,
          profileImage: response.reviewBody.user.profileImg,
          userId: response.reviewBody.userId,
        };

        const dentalObj = {
          name: response.reviewBody.dental_clinic.name,
          originalName: response.reviewBody.dental_clinic.originalName,
          address: response.reviewBody.dental_clinic.address,
          id: response.reviewBody.dentalClinicId,
        };

        if (response.viewerLikeReview) {
          setIsCurUserLike(true);
        } else {
          setIsCurUserLike(false);
        }

        //setWriterInfo(userObj)
        setTreatmentDate(treatmentObj);
        setLikeCount(response.reviewLikeNum);
        setViewCount(response.reviewViewerNum);
        setParagraphArray(tmpParagraphArray);
        setParagraphArrayDisplay(response.reviewBody.review_contents);
        setDentalInfo(dentalObj);
        setCommentArray(response.reviewComments);
      })
      .catch((error) => {
        console.log('GETReviewDetail error', error);
        setLoadingReviewDetail(false);
      });
  };

  const moveToFullImages = (imageUri: string) => {
    console.log('moveToFullImages imageArray', imageArray);

    var index = imageArray.findIndex(
      (image: any) => image.img_url === imageUri,
    );

    var tmpImageArray = imageArray.map((image: any) => {
      return image.img_url;
    });

    console.log('선택한 사진의 mediaFiles index', index);

    navigation.navigate('FullImagesScreen', {
      imageArray: tmpImageArray,
      imageIndex: index,
    });
  };

  const moveToDentalDetail = (dentalId: number) => {
    navigation.navigate('DentalClinicStack', {
      screen: 'DentalDetailScreen',
      params: {
        dentalId: dentalId,
      }
    })
  }

  const moveToCommentList = (request: string) => {
    navigation.navigate("ReviewCommentListScreen", {
      reviewId: reviewId,
      commentArray: commentArray,
      request: request
    });
  }

  const goBack = () => {
    navigation.goBack();
  };

  const clickMoreView = () => {
    if(isOwnReview) {
      setIsVisibleOwnMoreViewModal(!isVisibleOwnMoreViewModal);
    } else {
      setIsVisibleOtherMoreViewModal(!isVisibleOtherMoreViewModal);
    }
  }

  const clickCommentIcon = (request: string) => {
    //setIsCommentInputFocused(true);
    moveToCommentList(request);
  };

  const onRefreshReviewDetail = () => {
    setRefreshingReviewDetail(true);
    getReviewDetail();
  };

  const clickReviseReview = () => {
    setIsVisibleOwnMoreViewModal(false);
    console.log('dentalInfo', dentalInfo);
    const submitParagraphArray = paragraphArray;

    navigation.navigate('ReviewUploadStack', {
      screen: 'ContentPostScreen',
      params: {
        requestType: 'revise',
        paragraphArray: submitParagraphArray,
        dentalClinic: {
          name: dentalInfo.name,
          address: dentalInfo.address,
          id: dentalInfo.id,
        },
        treatDate: {
          displayTreatDate: treatmentDate.displayTreatDate,
          treatDate: treatmentDate.treatDate,
        },
        selectedTreatList: treatmentList,
        rating: {
          avgRating: rating.avgRating,
          priceRating: rating.priceRating,
          serviceRating: rating.serviceRating,
          treatRating: rating.treatRating,
        },
        detailPriceList: detailPriceList,
        reviewId: reviewId,
        totalPrice: totalPrice,
      },
    });
  };

  const clickDeleteReview = () => {
    setIsVisibleOwnMoreViewModal(false);
    Alert.alert('정말 리뷰를 삭제하실건가요?', '', [
      {
        text: '확인',
        onPress: () => deleteReview(),
      },
      {
        text: '취소',
        onPress: () => 0,
        style: 'cancel',
      },
    ]);
  };

  const deleteReview = () => {
    DELETEReview({jwtToken, reviewId})
      .then((response) => {
        console.log('DELTEReview response', response);
        const tmpReviewList = reviewList.mainReviewList;
        const deleteIndex = tmpReviewList.findIndex(
          (item: any, index: number) => {
            if (item.id === reviewId) {
              return true;
            }
          },
        );

        console.log('deleteIndex', deleteIndex);
        tmpReviewList.splice(deleteIndex, 1);

        dispatch(allActions.reviewListActions.setMainReviewList(tmpReviewList));
        navigation.goBack();
      })
      .catch((error) => {
        console.log('DELETEReview error', error);
      });
  };

  const clickReviewLike = () => {
    dispatch(allActions.reviewListActions.toggleReviewLike(reviewId));
    if (isCurUserLike) {
      deleteReviewLike();
    } else {
      postReviewLike();
    }
  };

  const postReviewLike = () => {
    setIsCurUserLike(true);
    setLikeCount((prevState) => prevState + 1);
    POSTReviewLike({jwtToken, reviewId})
      .then((response) => {
        console.log('POSTReviewLike response', response);
      })
      .catch((error) => {
        console.log('POSTReviewLike error', error);
      });
  };

  const deleteReviewLike = () => {
    setIsCurUserLike(false);
    setLikeCount((prevState) => prevState - 1);
    DELETEReviewLike({jwtToken, reviewId})
      .then((response) => {
        console.log('DELETEReviewLike response', response);
      })
      .catch((error) => {
        console.log('DELETEReviewLike error', error);
      });
  };

  const clickReviewScrap = () => {
    dispatch(allActions.reviewListActions.toggleReviewScrap(reviewId));
    if (isCurUserScrap) {
      deleteReviewScrap();
    } else {
      postReviewScrap();
    }
  };

  const postReviewScrap = () => {
    setIsCurUserScrap(true);
    POSTReviewScrap({jwtToken, reviewId})
      .then((response) => {
        console.log('POSTReviewScrap response', response);
      })
      .catch((error) => {
        console.log('POSTReviewScrap error', error);
      });
  };

  const deleteReviewScrap = () => {
    setIsCurUserScrap(false);
    DELETEReviewScrap({jwtToken, reviewId})
      .then((response) => {
        console.log('DELETEReviewScrap response', response);
      })
      .catch((error) => {
        console.log('DELETEReviewScrap error', error);
      });
  };

  const deleteReviewComment = () => {
    setLoadingCommentPost(true);
    const commentId = selectedCommentId;
    const type = 'review';

    DELETEComment({jwtToken, commentId, type})
      .then((response) => {
        console.log('DELETEComment response', response);
        GETReviewDetail(jwtToken, reviewId)
          .then((response: any) => {
            console.log('GETReviewDetail response', response);
            console.log(
              'GETReviewDetail response.reviewComments',
              response.reviewComments,
            );
            setLoadingCommentPost(false);
            setCommentArray(response.reviewComments);

            setTimeout(() => {
              reviewScrollViewRef.current.scrollToEnd({animated: true});
            }, 10);
          })
          .catch((error) => {
            console.log('GETReviewDetail error', error);
            setLoadingCommentPost(false);
          });
      })
      .catch((error) => {
        console.log('DELETEComment error', error);
        setLoadingCommentPost(false);
      });
  };

  const openCommentActionSheet = (
    userId: string,
    nickname: string,
    commentId: number,
  ) => {
    selectedCommentId = commentId;

    if (userId === userProfile.id) {
      commentActionSheetRef.current.show();
    }
  };

  const onPressCommentActionSheet = (index: number) => {
    if (index === 1) {
      deleteReviewComment();
    }
  };

  const clickReply = () => {
    setIsCommentInputFocused(true);
  };

  const pressBackground = () => {
    if(isOwnReview) {
      if(isVisibleOwnMoreViewModal) {
        setIsVisibleOwnMoreViewModal(false)
      }
    } else {
      if(isVisibleOtherMoreViewModal) {
        setIsVisibleOtherMoreViewModal(false);
      }
    }
  }



  return (
    <TouchableWithoutFeedback onPress={() => pressBackground()}>
    <Container>
      {/*
      <HeaderBar>
        <TouchableWithoutFeedback onPress={() => goBack()}>
          <HeaderLeftContainer>
            <HeaderBackIcon
              source={require('~/Assets/Images/HeaderBar/ic_back.png')}
            />
          </HeaderLeftContainer>
        </TouchableWithoutFeedback>
        <HeaderTitleContainer>
          <NicknameText>{writerInfo.nickname}</NicknameText>
        </HeaderTitleContainer>
        <HeaderRightContainer>
          <HeaderEmptyView />
          {isOwnReview && (
            <View
              style={{position: 'absolute', flexDirection: 'row', right: 10}}>
              <TouchableWithoutFeedback onPress={() => clickReviseReview()}>
                <HeaderTitleText>{'수정'}</HeaderTitleText>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={() => clickDeleteReview()}>
                <HeaderTitleText style={{marginLeft: 5}}>
                  {'삭제'}
                </HeaderTitleText>
              </TouchableWithoutFeedback>
            </View>
          )}
        </HeaderRightContainer>
      </HeaderBar>
      */}
      <NavigationHeader
      headerLeftProps={{type: "arrow", onPress: goBack, text: "리얼리뷰"}}
      headerRightProps={{type: "viewMore", onPress: clickMoreView}}
      />
      <ScrollView
        ref={reviewScrollViewRef}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshingReviewDetail}
            onRefresh={onRefreshReviewDetail}
          />
        }>
        <TouchableWithoutFeedback onPress={() => 0}>
        <ScrollViewContainer>
        {/*
        <ReviewInformation
        writer={writerInfo}
        createdDate={createdDate}
        treatmentArray={treatmentArrayDisplay}
        avgRating={rating.avgRating}
        dental={dentalInfo}
        treatmentDate={treatmentDateDisplay}
        />
        */}
        <WriterInfoContainer>
        <WriterInfo
        writerObj={writerObj}
        elapsedTime={elapsedTime}
        isVisibleElapsedTime={isVisibleElapsedTime}
        createdDate={createdDate}/>
        </WriterInfoContainer>
        <TreatmentListContainer>
        <TreatmentList
        treatmentArray={treatmentArrayDisplay}
        />
        </TreatmentListContainer>
        {!loadingReviewDetail && (
          <BodyContainer style={{paddingBottom: paddingBottom}}>
            <ReviewContentContainer>
            <ReviewContent
              moveToFullImages={moveToFullImages}
              paragraphArray={paragraphArrayDisplay}
            />
            </ReviewContentContainer>
            <MetaInfoContainer>
              <ReviewMetaInfo
              dentalObj={dentalInfo}
              moveToDentalDetail={moveToDentalDetail}
              certifiedReceipt={isCertifiedReceipt}
              totalPrice={totalPrice}
              ratingObj={rating}
              treatmentDate={treatmentDate.displayTreatDate}/>
            </MetaInfoContainer>
            <CommentListContainer>
              <ReviewPreviewCommentList
                moveToCommentList={moveToCommentList}
                clickReply={clickReply}
                openCommentActionSheet={openCommentActionSheet}
                commentList={commentArray}
              />
            </CommentListContainer>
          </BodyContainer>
        )}
        {loadingReviewDetail && (
          <IndicatorContainer>
            <ActivityIndicator/>
          </IndicatorContainer>
        )}
        </ScrollViewContainer>
        </TouchableWithoutFeedback>
      </ScrollView>
      <KeyboardAvoidingView behavior={'position'}>
        <BottomBarContainer>
          <ReviewBottomBar
            isCurUserLike={isCurUserLike}
            isCurUserScrap={isCurUserScrap}
            clickReviewLike={clickReviewLike}
            clickReviewScrap={clickReviewScrap}
            clickCommentIcon={clickCommentIcon}
            likeCount={likeCount}
          />
        </BottomBarContainer>
      </KeyboardAvoidingView>
      <ActionSheet
        ref={commentActionSheetRef}
        options={['취소', '댓글 삭제']}
        cancelButtonIndex={0}
        detructiveButtonIndex={1}
        onPress={(index: any) => onPressCommentActionSheet(index)}
      />
      {loadingCommentPost && (
        <TransIndicatorContainer>
          <ActivityIndicator color={'#ffffff'} />
        </TransIndicatorContainer>
      )}
      {isVisibleOwnMoreViewModal && (
        <MoreViewModalContainer
        style={styles.moreViewModalShadow}>
          <TouchableWithoutFeedback onPress={() => clickReviseReview()}>
          <MoreViewItemContainer>
            <MoreViewItemLabelText>{"수정"}</MoreViewItemLabelText>
          </MoreViewItemContainer>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => clickDeleteReview()}>
          <MoreViewItemContainer>
            <MoreViewItemLabelText>{"삭제"}</MoreViewItemLabelText>
          </MoreViewItemContainer>
          </TouchableWithoutFeedback>
          <MoreViewItemContainer>
            <MoreViewItemLabelText>{"신고"}</MoreViewItemLabelText>
          </MoreViewItemContainer>
          <MoreViewItemContainer style={{borderBottomWidth: 0}}>
            <MoreViewItemLabelText>{"공유"}</MoreViewItemLabelText>
          </MoreViewItemContainer>
        </MoreViewModalContainer>
      )}
      {isVisibleOtherMoreViewModal && (
        <MoreViewModalContainer
        style={styles.moreViewModalShadow}>
          <TouchableWithoutFeedback onPress={() => clickReviseReview()}>
          <MoreViewItemContainer>
            <MoreViewItemLabelText>{"수정"}</MoreViewItemLabelText>
          </MoreViewItemContainer>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => clickDeleteReview()}>
          <MoreViewItemContainer>
            <MoreViewItemLabelText>{"삭제"}</MoreViewItemLabelText>
          </MoreViewItemContainer>
          </TouchableWithoutFeedback>
          <MoreViewItemContainer>
            <MoreViewItemLabelText>{"신고"}</MoreViewItemLabelText>
          </MoreViewItemContainer>
          <MoreViewItemContainer style={{borderBottomWidth: 0}}>
            <MoreViewItemLabelText>{"공유"}</MoreViewItemLabelText>
          </MoreViewItemContainer>
        </MoreViewModalContainer>
      )}
    </Container>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  moreViewModalShadow: {
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 5,
    shadowOpacity: 0.1,
  }
})

export default ReviewDetailScreen;


