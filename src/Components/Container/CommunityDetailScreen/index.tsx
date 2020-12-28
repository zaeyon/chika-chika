import React, {useCallback, useEffect, useRef, useState} from 'react';
import Styled from 'styled-components/native';
import {
  TouchableWithoutFeedback,
  FlatList,
  KeyboardAvoidingView,
  View,
  Animated,
  Keyboard,
  LayoutAnimation,
  Easing,
  Text,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {isIphoneX, getBottomSpace} from 'react-native-iphone-x-helper';
// Local Components
import PostInformation from '~/Components/Presentational/CommunityPostDetailScreen/PostInformation';
import PostContent from '~/Components/Presentational/CommunityPostDetailScreen/PostContent';
import DentistComment from '~/Components/Presentational/CommunityPostDetailScreen/DentistComment';
import PostCommentList from '~/Components/Presentational/CommunityPostDetailScreen/PostCommentList';
import PostBottomBar from '~/Components/Presentational/CommunityPostDetailScreen/PostBottomBar';
// fetch
import GETCommunityPostDetail from '~/Routes/Community/postDetail/GETCommunityPostDetail';
import GETCommunityPostComments from '~/Routes/Community/postDetail/GETCommunityPostComments';
import POSTCommunityPostComment from '~/Routes/Community/postDetail/POSTCommunityPostComment';
import DELETECommunityPost from '~/Routes/Community/deletePost/DELETECommunityPost';
// redux
import {useSelector, useDispatch} from 'react-redux';
import allActions from '~/actions';

const ContainerView = Styled.SafeAreaView`
 flex: 1;
 background-color: white;
`;

const BodyContainerScrollView = Styled.ScrollView`
flex: 1;
margin-bottom: ${hp('100%') * 0.08}px;

`;

const ActivityIndicatorContianerView = Styled.View`
width: 100%;
height: 50px;

align-items: center;
justify-content: center;
`;

interface Props {
  navigation: any;
  route: any;
  key: any;
}

const CommunityDetailScreen = ({navigation, route, key}: Props) => {
  const scrollView: any = useRef();
  const scrollY: Animated.Value = useRef(new Animated.Value(0)).current;
  const keyboardHeight: Animated.Value = useRef(new Animated.Value(0)).current;
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [formattedDescription, setFormattedDescription] = useState('');
  const currentUser = useSelector((state: any) => state.currentUser);
  const postList = useSelector((state: any) => {
    if (route.params.type === 'Question') {
      console.log('Q');
      return state.communityPostList.QuestionPosts;
    } else if (route.params.type === 'FreeTalk') {
      console.log('F');
      return state.communityPostList.FreeTalkPosts;
    } else {
      console.log('A');
      return state.communityPostList.HomePosts;
    }
  });
  const [postData, setPostData] = useState(
    postList.find((item: any) => item.id === route.params.id),
  );

  const jwtToken = currentUser.user.jwtToken;
  const dispatch = useDispatch();

  useEffect(() => {
    setPostData(postList.find((item: any) => item.id === route.params.id));
  }, [postList]);

  useEffect(() => {
    console.log('fetch commnets', route.params.id);
    fetchPostComments(route.params.id);
  }, []);

  const toggleKeyboardAnimation = useCallback(
    (height: Number) => {
      scrollView &&
        scrollView.current.scrollTo({
          y: (scrollY as any)._value + height,
        });
    },
    [scrollView, scrollY],
  );

  const uploadComment = useCallback(
    (comment: string) => {
      POSTCommunityPostComment(jwtToken, postData.id, comment).then(
        (response: any) => {
          console.log(response);
          if (response.body.statusText === 'Created') {
            console.log('Created!');
            fetchPostComments(postData.id);
          }
        },
      );
    },
    [jwtToken, postData],
  );

  const fetchPostComments = useCallback(
    (postId: string) => {
      GETCommunityPostComments(jwtToken, postId).then((response: any) => {
        setIsLoading(false);
        setComments(response);
      });
    },
    [jwtToken],
  );

  const reloadPostDetail = useCallback(
    (postId: string) => {
      GETCommunityPostDetail(jwtToken, postId).then((response: any) => {
        console.log(response);
        setPostData(response.communityPost);
        setComments(response.communityComments);
      });
    },
    [jwtToken],
  );

  const onPressEditPost = useCallback(() => {
    navigation.navigate('CommunityPostUploadStackScreen', {
      data: {
        id: postData.id,
        description: deorderDescription(postData.description),
        type: deorderType(postData.type),
      },
      reloadPostDetail: reloadPostDetail,
    });
  }, [postData]);

  const onPressDeletePost = useCallback(() => {
    DELETECommunityPost(jwtToken, postData.id).then((response) => {
      console.log(response);
      navigation.goBack();
      dispatch(allActions.communityActions.deletePost(postData.id));
      Alert.alert('게시글 삭제가 완료되었습니다.');
    });
  }, [jwtToken, postData]);

  const deorderDescription = useCallback((oldDescription: string) => {
    const newDescription = oldDescription
      .replace(/{{/gi, '#')
      .replace(/}}/gi, '');
    return newDescription;
  }, []);

  const deorderType = useCallback((oldCategory: string) => {
    if (oldCategory === 'Question') {
      return '질문';
    } else if (oldCategory === 'FreeTalk') {
      return '자유';
    }
  }, []);

  const moveToAnotherProfile = useCallback(() => {
    navigation.navigate('AnotherProfileScreen');
  }, []);

  const moveToFullImages = useCallback((mediaFiles: any, imageUri: string) => {
    let index = mediaFiles.findIndex(
      (image: any) => image.img_url === imageUri,
    );

    let imageUri_arr = mediaFiles.map((image: any) => {
      return image.img_url;
    });
    console.log(mediaFiles);
    console.log('선택한 사진의 mediaFiles index', index);

    navigation.navigate('FullImagesScreen', {
      imagesUrl_arr: imageUri_arr,
      imageIndex: index,
    });
  }, []);

  if (postData) {
    return (
      <ContainerView>
        <KeyboardAvoidingView style={{flex: 1}} behavior="padding">
          <BodyContainerScrollView
            showsVerticalScrollIndicator={false}
            ref={scrollView}
            scrollEventThrottle={16}
            onScroll={Animated.event(
              [
                {
                  nativeEvent: {
                    contentOffset: {
                      y: scrollY,
                    },
                  },
                },
              ],
              {useNativeDriver: false},
            )}>
            <PostInformation
              navigation={navigation}
              onPressEditPost={onPressEditPost}
              onPressDeletePost={onPressDeletePost}
            />
            <PostContent
              moveToAnotherProfile={moveToAnotherProfile}
              moveToFullImages={moveToFullImages}
              data={postData}
            />
            <DentistComment />
            {isLoading ? (
              <ActivityIndicatorContianerView>
                <ActivityIndicator size="small" />
              </ActivityIndicatorContianerView>
            ) : (
              <PostCommentList commentList={comments} />
            )}
          </BodyContainerScrollView>
        </KeyboardAvoidingView>
        <PostBottomBar
          toggleKeyboardAnimation={toggleKeyboardAnimation}
          uploadComment={uploadComment}
          postLikeNum={postData.postLikeNum}
          viewerLikeCommunityPost={postData.viewerLikeCommunityPost}
        />
      </ContainerView>
    );
  } else {
    return <ContainerView></ContainerView>;
  }
};

export default CommunityDetailScreen;
