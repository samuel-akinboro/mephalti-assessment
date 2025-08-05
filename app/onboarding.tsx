import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Image } from 'react-native';
import { router } from 'expo-router';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
  interpolate,
  Extrapolate 
} from 'react-native-reanimated';
import { useMovieStore } from '../store/movieStore';
import { lightTheme, darkTheme } from '../constants/Theme';

const { width, height } = Dimensions.get('window');

const onboardingData = [
  {
    title: 'Welcome to MovieApp',
    subtitle: 'Discover the latest and greatest movies from around the world',
    image: '🎬',
  },
  {
    title: 'Search & Explore',
    subtitle: 'Find your favorite movies with our powerful search feature',
    image: '🔍',
  },
  {
    title: 'Save Favorites',
    subtitle: 'Keep track of movies you love with our favorites feature',
    image: '❤️',
  },
];

export default function OnboardingScreen() {
  const { isDarkMode } = useMovieStore();
  const theme = isDarkMode ? darkTheme : lightTheme;
  const [currentIndex, setCurrentIndex] = useState(0);

  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);

  React.useEffect(() => {
    translateX.value = withSpring(0, { damping: 15 });
    opacity.value = withSpring(1, { damping: 15 });
    scale.value = withSpring(1, { damping: 15 });
  }, [currentIndex]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { scale: scale.value }
    ],
    opacity: opacity.value,
  }));

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      translateX.value = withTiming(-width, { duration: 300 });
      opacity.value = withTiming(0, { duration: 300 });
      scale.value = withTiming(0.8, { duration: 300 });
      
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
      }, 300);
    } else {
      handleFinish();
    }
  };

  const handleFinish = async () => {
    try {
      await AsyncStorage.setItem('hasSeenOnboarding', 'true');
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error saving onboarding status:', error);
      router.replace('/(tabs)');
    }
  };

  const handleSkip = async () => {
    try {
      await AsyncStorage.setItem('hasSeenOnboarding', 'true');
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error saving onboarding status:', error);
      router.replace('/(tabs)');
    }
  };

  return (
    <View style={{
      flex: 1,
      backgroundColor: theme.background,
    }}>
      {/* Skip Button */}
      <TouchableOpacity
        onPress={handleSkip}
        style={{
          position: 'absolute',
          top: 60,
          right: 20,
          zIndex: 10,
        }}
      >
        <Text style={{
          color: theme.primary,
          fontSize: 16,
          fontWeight: '600',
        }}>
          Skip
        </Text>
      </TouchableOpacity>

      {/* Content */}
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
      }}>
        <Animated.View style={[animatedStyle, { alignItems: 'center' }]}>
          {/* Image */}
          <View style={{
            width: 200,
            height: 200,
            borderRadius: 100,
            backgroundColor: theme.primary + '20',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 40,
          }}>
            <Text style={{ fontSize: 80 }}>
              {onboardingData[currentIndex].image}
            </Text>
          </View>

          {/* Title */}
          <Text style={{
            color: theme.text,
            fontSize: 28,
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: 16,
            lineHeight: 36,
          }}>
            {onboardingData[currentIndex].title}
          </Text>

          {/* Subtitle */}
          <Text style={{
            color: theme.textSecondary,
            fontSize: 16,
            textAlign: 'center',
            lineHeight: 24,
            marginBottom: 60,
          }}>
            {onboardingData[currentIndex].subtitle}
          </Text>
        </Animated.View>
      </View>

      {/* Bottom Section */}
      <View style={{
        paddingHorizontal: 40,
        paddingBottom: 60,
      }}>
        {/* Dots */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginBottom: 40,
        }}>
          {onboardingData.map((_, index) => (
            <View
              key={index}
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: index === currentIndex ? theme.primary : theme.border,
                marginHorizontal: 4,
              }}
            />
          ))}
        </View>

        {/* Button */}
        <TouchableOpacity
          onPress={handleNext}
          style={{
            backgroundColor: theme.primary,
            paddingVertical: 16,
            borderRadius: 12,
            alignItems: 'center',
          }}
        >
          <Text style={{
            color: '#FFFFFF',
            fontSize: 18,
            fontWeight: 'bold',
          }}>
            {currentIndex === onboardingData.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
} 