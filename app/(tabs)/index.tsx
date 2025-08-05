import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList, Image, Dimensions, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
  interpolate,
  Extrapolate 
} from 'react-native-reanimated';
import { useMovieStore, Movie } from '../../store/movieStore';
import { MovieCard } from '../../components/MovieCard';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';
import { SkeletonLoader } from '../../components/SkeletonLoader';
import { lightTheme, darkTheme } from '../../constants/Theme';
import { BlurView } from 'expo-blur';


const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { 
    isDarkMode, 
    toggleTheme, 
    popularMovies, 
    isLoading, 
    error, 
    fetchPopularMovies 
  } = useMovieStore();
  
  const theme = isDarkMode ? darkTheme : lightTheme;

  useEffect(() => {
    fetchPopularMovies();
  }, []);

  const renderMovieItem = ({ item, index }: { item: Movie; index: number }) => (
    <MovieCard
      movie={item}
      onPress={() => router.push(`/movie-details?id=${item.id}`)}
      index={index}
    />
  );

  const renderLiveNowItem = ({ item, index }: { item: any; index: number }) => {
    const CARD_WIDTH = width - 60;
  
    return (
      <ImageBackground 
        style={{
          width: CARD_WIDTH,
          // backgroundColor: theme.card,
          borderRadius: 16,
          overflow: 'hidden',
          shadowColor: theme.cardShadow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 8,
        }}
        source={{ uri: 'https://placehold.jp/61d0f5/ffffff/120x120.png' }}
      >
        <View style={{
          flexDirection: 'row',
          height: 200,
        }}>
          {/* Left Content */}
          <View style={{
            flex: 1,
            padding: 20,
            justifyContent: 'space-between',
          }}>
            <BlurView
              intensity={40}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
              }}
            />

            <View>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 8,
                backgroundColor: '#fff',
                alignSelf: 'flex-start',
                padding: 3,
                borderRadius: 20,
                paddingHorizontal: 7
              }}>
                <View style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: '#FF3B30',
                  marginRight: 8,
                }} />
                <Text style={{
                  color: '#FF3B30',
                  fontSize: 12,
                  fontWeight: 'bold',
                }}>
                  Live now
                </Text>
              </View>
              
              <Text 
                style={{
                  color: theme.text,
                  fontSize: 18,
                  fontWeight: 'bold',
                  marginBottom: 8,
                  lineHeight: 24,
                }}
                numberOfLines={2}
              >
                Nonton bareng Ashiap Man 2022
              </Text>
              
              <Text style={{
                color: theme.text,
                fontSize: 14,
                lineHeight: 20,
              }}>
                Nobar Livestream Ashiap man 2022 disini
              </Text>
            </View>
            
            <TouchableOpacity style={{
              backgroundColor: theme.primary,
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderRadius: 20,
              alignSelf: 'flex-start',
              marginTop: 7
            }}>
              <Text style={{
                color: '#FFFFFF',
                fontSize: 12,
                fontWeight: 'bold',
              }}>
                Click here
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Right Image */}
          <View style={{
            width: 120,
            height: '100%',
          }}>
            <Image
              source={{ uri: 'https://placehold.jp/61d0f5/ffffff/120x120.png' }}
              style={{
                width: '100%',
                height: '100%',
              }}
              resizeMode="cover"
            />
          </View>
        </View>
      </ImageBackground>
    )
  };

  if (isLoading && popularMovies.length === 0) {
    return (
      <SafeAreaView style={{
        flex: 1,
        backgroundColor: theme.background,
      }}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* Header Skeleton */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingVertical: 16,
          }}>
            <View>
              <View style={{
                height: 14,
                backgroundColor: theme.border,
                borderRadius: 4,
                marginBottom: 4,
                width: 100,
              }} />
              <View style={{
                height: 24,
                backgroundColor: theme.border,
                borderRadius: 4,
                width: 150,
              }} />
            </View>
            
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
              {[1, 2, 3].map((_, index) => (
                <View key={index} style={{
                  width: 20,
                  height: 20,
                  backgroundColor: theme.border,
                  borderRadius: 10,
                  marginLeft: 16,
                }} />
              ))}
            </View>
          </View>

          {/* Live Now Skeleton */}
          <View style={{ marginBottom: 32 }}>
            <View style={{
              width: width - 40,
              height: 200,
              backgroundColor: theme.border,
              borderRadius: 16,
              marginHorizontal: 20,
            }} />
          </View>

          {/* Latest Movies Skeleton */}
          <View style={{ marginBottom: 32 }}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 20,
              marginBottom: 16,
            }}>
              <View style={{
                height: 20,
                backgroundColor: theme.border,
                borderRadius: 4,
                width: 120,
              }} />
              <View style={{
                height: 14,
                backgroundColor: theme.border,
                borderRadius: 4,
                width: 60,
              }} />
            </View>
            
            <View style={{ paddingHorizontal: 20 }}>
              <SkeletonLoader type="movie-card" count={5} />
            </View>
          </View>

          {/* Top Rated Skeleton */}
          <View>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 20,
              marginBottom: 16,
            }}>
              <View style={{
                height: 20,
                backgroundColor: theme.border,
                borderRadius: 4,
                width: 100,
              }} />
              <View style={{
                height: 14,
                backgroundColor: theme.border,
                borderRadius: 4,
                width: 60,
              }} />
            </View>
            
            <View style={{ paddingHorizontal: 20 }}>
              <SkeletonLoader type="movie-card" count={5} />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (error && popularMovies.length === 0) {
    return <ErrorMessage message={error} onRetry={fetchPopularMovies} />;
  }

  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: theme.background,
    }}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Header */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 20,
          paddingVertical: 16,
        }}>
          <View>
            <Text style={{
              color: theme.textSecondary,
              fontSize: 14,
              marginBottom: 4,
            }}>
              Welcome back,
            </Text>
            <Text style={{
              color: theme.text,
              fontSize: 24,
              fontWeight: 'bold',
            }}>
              Yacob Krisna
            </Text>
          </View>
          
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
            <TouchableOpacity
              onPress={toggleTheme}
              style={{
                marginRight: 16,
                padding: 8,
              }}
            >
              <Text style={{ fontSize: 20 }}>
                {isDarkMode ? '🌙' : '☀️'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={{ marginRight: 16 }}>
              <Text style={{ fontSize: 20 }}>🔔</Text>
            </TouchableOpacity>
            
            <TouchableOpacity>
              <Text style={{ fontSize: 20 }}>🔍</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Live Now Section */}
        <View style={{ marginBottom: 32 }}>
          <FlatList
            data={[{ id: 1 }, {id: 2}, {id: 3}]} // Single item for now
            renderItem={renderLiveNowItem}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, gap: 20 }}
            pagingEnabled
          />
          
          {/* Pagination Dots */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 16,
          }}>
            {[1, 2, 3, 4].map((_, index) => (
              <View
                key={index}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: index === 0 ? theme.primary : theme.border,
                  marginHorizontal: 4,
                }}
              />
            ))}
          </View>
        </View>

        {/* Latest Movies Section */}
        <View style={{ marginBottom: 32 }}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
            marginBottom: 16,
          }}>
            <Text style={{
              color: theme.text,
              fontSize: 20,
              fontWeight: 'bold',
            }}>
              Latest movies
            </Text>
            <TouchableOpacity onPress={() => router.push('/see-all?type=latest')}>
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
            data={popularMovies.slice(0, 10)}
            renderItem={renderMovieItem}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20 }}
            keyExtractor={(item) => item.id.toString()}
          />
        </View>

        {/* Top Rated Section */}
        <View>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
            marginBottom: 16,
          }}>
            <Text style={{
              color: theme.text,
              fontSize: 20,
              fontWeight: 'bold',
            }}>
              Top rated
            </Text>
            <TouchableOpacity onPress={() => router.push('/see-all?type=top-rated')}>
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
            data={popularMovies.slice(10, 20)}
            renderItem={renderMovieItem}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20 }}
            keyExtractor={(item) => item.id.toString()}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
