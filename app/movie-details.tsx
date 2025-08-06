import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  withDelay,
  interpolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useMovieStore, Cast } from '../store/movieStore';
import { getImageUrl, getBackdropUrl, getProfileUrl } from '../config/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { lightTheme, darkTheme } from '../constants/Theme';

// Animated components
const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedText = Animated.createAnimatedComponent(Text);
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const { width, height } = Dimensions.get('window');
const POSTER_HEIGHT = height * 0.6;

export default function MovieDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { 
    isDarkMode, 
    movieDetails, 
    isLoading, 
    error, 
    fetchMovieDetails,
    isFavorite,
    addToFavorites,
    removeFromFavorites
  } = useMovieStore();

  // console.log(JSON.stringify(movieDetails.videos, null, 2));
  
  const theme = isDarkMode ? darkTheme : lightTheme;
  const [activeTab, setActiveTab] = useState<'cast' | 'crew'>('cast');

  // Reanimated shared values for staggered entry animations
  const titleAnim = useSharedValue(0);
  const infoAnim = useSharedValue(0);
  const buttonsAnim = useSharedValue(0);
  const synopsisAnim = useSharedValue(0);
  const castAnim = useSharedValue(0);

  // Animated styles for each individual element
  const animatedTitleStyle = useAnimatedStyle(() => ({
    opacity: withTiming(titleAnim.value, { duration: 500 }),
    transform: [{ translateY: withTiming(titleAnim.value === 1 ? 0 : 30, { duration: 500 }) }],
  }));

  const animatedInfoStyle = useAnimatedStyle(() => ({
    opacity: withTiming(infoAnim.value, { duration: 500 }),
    transform: [{ translateY: withTiming(infoAnim.value === 1 ? 0 : 30, { duration: 500 }) }],
  }));
  
  const animatedButtonsStyle = useAnimatedStyle(() => ({
    opacity: withTiming(buttonsAnim.value, { duration: 500 }),
    transform: [{ translateY: withTiming(buttonsAnim.value === 1 ? 0 : 30, { duration: 500 }) }],
  }));
  
  const animatedSynopsisStyle = useAnimatedStyle(() => ({
    opacity: withTiming(synopsisAnim.value, { duration: 500 }),
    transform: [{ translateY: withTiming(synopsisAnim.value === 1 ? 0 : 30, { duration: 500 }) }],
  }));

  const animatedCastStyle = useAnimatedStyle(() => ({
    opacity: withTiming(castAnim.value, { duration: 500 }),
    transform: [{ translateY: withTiming(castAnim.value === 1 ? 0 : 30, { duration: 500 }) }],
  }));
  
  useEffect(() => {
    if (id) {
      fetchMovieDetails(parseInt(id));
    }
  }, [id]);

  useEffect(() => {
    if (!isLoading && movieDetails) {
      // Trigger the staggered entry animations
      titleAnim.value = withTiming(1, { duration: 500 });
      infoAnim.value = withDelay(100, withTiming(1, { duration: 500 }));
      buttonsAnim.value = withDelay(200, withTiming(1, { duration: 500 }));
      synopsisAnim.value = withDelay(300, withTiming(1, { duration: 500 }));
      castAnim.value = withDelay(400, withTiming(1, { duration: 500 }));
    }
  }, [isLoading, movieDetails]);

  const handleFavoritePress = () => {
    if (movieDetails) {
      if (isFavorite(movieDetails.id)) {
        removeFromFavorites(movieDetails.id);
      } else {
        addToFavorites(movieDetails);
      }
    }
  };

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.getFullYear().toString();
  };

  const renderCastItem = ({ item }: { item: Cast }) => (
    <View style={{
      alignItems: 'center',
      marginRight: 20,
      width: 80,
    }}>
      <Image
        source={{ 
          uri: item.profile_path ? getProfileUrl(item.profile_path, 'medium') : `https://placehold.jp/20/0085FE/ffffff/90x90.png?text=${item.name?.split(' ')[0][0] + item.name?.split(' ')[1][0]}&css=%7B%22display%22%3A%22%20flex%22%2C%22justify-content%22%3A%22%20center%22%2C%22align-items%22%3A%22%20center%22%7D`
        }}
        style={{
          width: 60,
          height: 60,
          borderRadius: 30,
          marginBottom: 8,
        }}
        resizeMode="cover"
      />
      <Text style={{
        color: theme.text,
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 2,
      }} numberOfLines={1}>
        {item.name}
      </Text>
      <Text style={{
        color: theme.textSecondary,
        fontSize: 10,
        textAlign: 'center',
      }} numberOfLines={1}>
        {item.character}
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.background }}>
        <SkeletonLoader type="movie-details" count={1} />
      </View>
    );
  }

  if (error || !movieDetails) {
    return <ErrorMessage message={error || 'Movie not found'} onRetry={() => id && fetchMovieDetails(parseInt(id))} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Backdrop Image and its elements */}
        <View style={{ height: POSTER_HEIGHT, position: 'relative' }}>
          <Image
            source={{ 
              uri: getBackdropUrl(movieDetails.backdrop_path, 'medium') || 'https://via.placeholder.com/400x600'
            }}
            style={{
              width: '100%',
              height: '100%',
            }}
            resizeMode="cover"
          />
          
          {/* Gradient Overlay */}
          <LinearGradient
            colors={['transparent', theme.background]}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 100,
            }}
          />
          
          {/* Play Trailer Button */}
          <View style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: [{ translateX: -30 }, { translateY: -30 }],
          }}>
            <TouchableOpacity style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <Text style={{ fontSize: 24, color: theme.primary }}>▶</Text>
            </TouchableOpacity>
            <Text style={{
              color: '#FFFFFF',
              fontSize: 14,
              textAlign: 'center',
              marginTop: 8,
              textShadowColor: 'rgba(0, 0, 0, 0.8)',
              textShadowOffset: { width: 0, height: 1 },
              textShadowRadius: 3,
            }}>
              Play trailer
            </Text>
          </View>
        </View>

        {/* Movie Info (Animated) */}
        <View style={{
          // paddingHorizontal: 20,
          marginTop: -80, // Negative margin to pull content over the poster gradient
        }}>
          {/* Title */}
          <AnimatedText style={[{
            color: theme.text,
            fontSize: 28,
            fontWeight: 'bold',
            marginBottom: 12,
            lineHeight: 36,
            paddingHorizontal: 20,
          }, animatedTitleStyle]}>
            {movieDetails.title}
          </AnimatedText>

          {/* Basic Info */}
          <AnimatedView style={[{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 20,
            paddingHorizontal: 20,
          }, animatedInfoStyle]}>
            <View style={{
              backgroundColor: theme.primary,
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 4,
              marginRight: 12,
            }}>
              <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: 'bold' }}>
                {movieDetails.adult ? '18+' : 'PG'}
              </Text>
            </View>
            
            <Text style={{ color: theme.textSecondary, fontSize: 14, marginRight: 8 }}>
              {formatRuntime(movieDetails.runtime)}
            </Text>
            <Text style={{ color: theme.textSecondary, fontSize: 14, marginRight: 8 }}>•</Text>
            <Text style={{ color: theme.textSecondary, fontSize: 14, marginRight: 8 }}>
              {movieDetails.genres?.[0]?.name || 'Unknown'}
            </Text>
            <Text style={{ color: theme.textSecondary, fontSize: 14, marginRight: 8 }}>•</Text>
            <Text style={{ color: theme.textSecondary, fontSize: 14 }}>
              {formatDate(movieDetails.release_date)}
            </Text>
          </AnimatedView>

          {/* Action Buttons */}
          <AnimatedView style={[{
            flexDirection: 'row',
            marginBottom: 24,
            paddingHorizontal: 20,
          }, animatedButtonsStyle]}>
            <TouchableOpacity style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: theme.surface,
              paddingHorizontal: 20,
              paddingVertical: 12,
              borderRadius: 8,
              marginRight: 12,
            }}>
              <Text style={{ fontSize: 18, marginRight: 8, color: theme.text }}>⬇</Text>
              <Text style={{ color: theme.text, fontSize: 14, fontWeight: '600' }}>
                Download
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={{
              flex: 1,
              backgroundColor: theme.primary,
              paddingVertical: 12,
              borderRadius: 8,
              alignItems: 'center',
            }}>
              <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }}>
                Play now
              </Text>
            </TouchableOpacity>
          </AnimatedView>

          {/* Synopsis */}
          <AnimatedText style={[{
            color: theme.text,
            fontSize: 16,
            lineHeight: 24,
            marginBottom: 24,
            paddingHorizontal: 20,
          }, animatedSynopsisStyle]}>
            {movieDetails.overview}
          </AnimatedText>

          {/* Cast & Crew */}
          <AnimatedView style={[{ marginBottom: 20 }, animatedCastStyle]}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16,
              paddingHorizontal: 20,
            }}>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                  onPress={() => setActiveTab('cast')}
                  style={{
                    marginRight: 24,
                    paddingBottom: 8,
                    borderBottomWidth: 2,
                    borderBottomColor: activeTab === 'cast' ? theme.primary : 'transparent',
                  }}
                >
                  <Text style={{
                    color: activeTab === 'cast' ? theme.primary : theme.text,
                    fontSize: 16,
                    fontWeight: activeTab === 'cast' ? 'bold' : 'normal',
                  }}>
                    Cast
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  onPress={() => setActiveTab('crew')}
                  style={{
                    paddingBottom: 8,
                    borderBottomWidth: 2,
                    borderBottomColor: activeTab === 'crew' ? theme.primary : 'transparent',
                  }}
                >
                  <Text style={{
                    color: activeTab === 'crew' ? theme.primary : theme.text,
                    fontSize: 16,
                    fontWeight: activeTab === 'crew' ? 'bold' : 'normal',
                  }}>
                    Director & crew
                  </Text>
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity>
                <Text style={{
                  color: theme.primary,
                  fontSize: 14,
                  fontWeight: '600',
                }}>
                  See all
                </Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={activeTab === 'cast' ? movieDetails.credits?.cast?.slice(0, 10) : movieDetails.credits?.crew?.slice(0, 10)}
              renderItem={renderCastItem}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={{ paddingHorizontal: 20 }}
            />
          </AnimatedView>
        </View>
      </ScrollView>

      {/* Header Actions (Fixed) */}
      <View style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: insets.top + 16, // Using safe area inset with a little extra padding
      }}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            borderRadius: 20,
            width: 40,
            height: 40,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#FFFFFF', fontSize: 18 }}>←</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}