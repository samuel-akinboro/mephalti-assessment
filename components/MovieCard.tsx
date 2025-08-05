import React from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  interpolate,
  Extrapolate 
} from 'react-native-reanimated';
import { useMovieStore, Movie } from '../store/movieStore';
import { getImageUrl } from '../config/api';
import { lightTheme, darkTheme } from '../constants/Theme';

const { width } = Dimensions.get('window');
const cardWidth = width * 0.4;

interface MovieCardProps {
  movie: Movie;
  onPress: () => void;
  index?: number;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, onPress, index = 0 }) => {
  const { isDarkMode, isFavorite, addToFavorites, removeFromFavorites } = useMovieStore();
  const theme = isDarkMode ? darkTheme : lightTheme;
  
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    opacity.value = withSpring(1, { damping: 15 });
    translateY.value = withSpring(0, { damping: 15 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: translateY.value }
    ],
    opacity: opacity.value,
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const handleFavoritePress = () => {
    if (isFavorite(movie.id)) {
      removeFromFavorites(movie.id);
    } else {
      addToFavorites(movie);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.getFullYear().toString();
  };

  const formatRating = (rating: number) => {
    return rating.toFixed(1);
  };

  return (
    <Animated.View style={[animatedStyle]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
        style={{
          width: cardWidth,
          marginRight: 12,
          marginBottom: 16,
        }}
      >
        <View style={{
          backgroundColor: theme.card,
          borderRadius: 12,
          shadowColor: theme.cardShadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4,
        }}>
          {/* Poster */}
          <View style={{ position: 'relative' }}>
            <Image
              source={{ 
                uri: getImageUrl(movie.poster_path) || 'https://via.placeholder.com/300x450'
              }}
              style={{
                width: '100%',
                height: cardWidth * 1.5,
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12,
              }}
              resizeMode="cover"
            />
            
            {/* Favorite Button */}
            <TouchableOpacity
              onPress={handleFavoritePress}
              style={{
                position: 'absolute',
                top: 8,
                right: 8,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                borderRadius: 20,
                width: 32,
                height: 32,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={{ color: isFavorite(movie.id) ? '#FFD700' : '#FFFFFF', fontSize: 16 }}>
                {isFavorite(movie.id) ? '★' : '☆'}
              </Text>
            </TouchableOpacity>

            {/* Rating Badge */}
            <View style={{
              position: 'absolute',
              bottom: 8,
              left: 8,
              backgroundColor: theme.primary,
              paddingHorizontal: 6,
              paddingVertical: 2,
              borderRadius: 4,
            }}>
              <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: 'bold' }}>
                {formatRating(movie.vote_average)}
              </Text>
            </View>
          </View>

          {/* Movie Info */}
          <View style={{ padding: 12 }}>
            <Text 
              style={{
                color: theme.text,
                fontSize: 14,
                fontWeight: 'bold',
                marginBottom: 4,
              }}
              numberOfLines={2}
            >
              {movie.title}
            </Text>
            
            <Text 
              style={{
                color: theme.textSecondary,
                fontSize: 12,
              }}
            >
              {formatDate(movie.release_date)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}; 