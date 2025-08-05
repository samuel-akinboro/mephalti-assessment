import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useMovieStore, Movie } from '../../store/movieStore';
import { MovieCard } from '../../components/MovieCard';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';
import { lightTheme, darkTheme } from '../../constants/Theme';

export default function SeeAllScreen() {
  const { type } = useLocalSearchParams<{ type: string }>();
  const { 
    isDarkMode, 
    popularMovies, 
    isLoading, 
    error, 
    fetchPopularMovies 
  } = useMovieStore();
  
  const theme = isDarkMode ? darkTheme : lightTheme;

  useEffect(() => {
    if (popularMovies.length === 0) {
      fetchPopularMovies();
    }
  }, []);

  const getTitle = () => {
    switch (type) {
      case 'latest':
        return 'Latest Movies';
      case 'top-rated':
        return 'Top Rated Movies';
      default:
        return 'All Movies';
    }
  };

  const getMovies = () => {
    switch (type) {
      case 'latest':
        return popularMovies.slice(0, 20);
      case 'top-rated':
        return popularMovies.slice(10, 30);
      default:
        return popularMovies;
    }
  };

  const renderMovieItem = ({ item, index }: { item: Movie; index: number }) => (
    <MovieCard
      movie={item}
      onPress={() => router.push(`/movie-details?id=${item.id}`)}
      index={index}
    />
  );

  if (isLoading && popularMovies.length === 0) {
    return <LoadingSpinner message="Loading movies..." />;
  }

  if (error && popularMovies.length === 0) {
    return <ErrorMessage message={error} onRetry={fetchPopularMovies} />;
  }

  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: theme.background,
    }}>
      {/* Header */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: theme.border,
      }}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            padding: 8,
          }}
        >
          <Text style={{ fontSize: 20 }}>←</Text>
        </TouchableOpacity>
        
        <Text style={{
          color: theme.text,
          fontSize: 20,
          fontWeight: 'bold',
        }}>
          {getTitle()}
        </Text>
        
        <View style={{ width: 36 }} />
      </View>

      {/* Movies Grid */}
      <FlatList
        data={getMovies()}
        renderItem={renderMovieItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={{ padding: 20 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 40,
            paddingTop: 60,
          }}>
            <Text style={{
              fontSize: 48,
              marginBottom: 16,
            }}>
              🎬
            </Text>
            <Text style={{
              color: theme.text,
              fontSize: 20,
              fontWeight: 'bold',
              textAlign: 'center',
              marginBottom: 8,
            }}>
              No movies found
            </Text>
            <Text style={{
              color: theme.textSecondary,
              fontSize: 16,
              textAlign: 'center',
              lineHeight: 24,
            }}>
              Try refreshing the page
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
} 