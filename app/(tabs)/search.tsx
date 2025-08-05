import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useMovieStore, Movie } from '../../store/movieStore';
import { MovieCard } from '../../components/MovieCard';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';
import { lightTheme, darkTheme } from '../../constants/Theme';

export default function SearchScreen() {
  const { 
    isDarkMode, 
    searchResults, 
    isLoading, 
    error, 
    searchMovies, 
    clearSearch 
  } = useMovieStore();
  
  const theme = isDarkMode ? darkTheme : lightTheme;
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        searchMovies(searchQuery);
      } else {
        clearSearch();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const renderMovieItem = ({ item, index }: { item: Movie; index: number }) => (
    <MovieCard
      movie={item}
      onPress={() => router.push(`/movie-details?id=${item.id}`)}
      index={index}
    />
  );

  const renderEmptyState = () => (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 40,
    }}>
      <Text style={{
        fontSize: 48,
        marginBottom: 16,
      }}>
        🔍
      </Text>
      <Text style={{
        color: theme.text,
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
      }}>
        Search for movies
      </Text>
      <Text style={{
        color: theme.textSecondary,
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
      }}>
        Find your favorite movies by typing in the search bar above
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: theme.background,
    }}>
      {/* Search Header */}
      <View style={{
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: theme.border,
      }}>
        <Text style={{
          color: theme.text,
          fontSize: 28,
          fontWeight: 'bold',
          marginBottom: 16,
        }}>
          Search
        </Text>
        
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: theme.surface,
          borderRadius: 12,
          paddingHorizontal: 16,
          paddingVertical: 12,
        }}>
          <Text style={{ fontSize: 20, marginRight: 12 }}>🔍</Text>
          <TextInput
            style={{
              flex: 1,
              color: theme.text,
              fontSize: 16,
            }}
            placeholder="Search for movies..."
            placeholderTextColor={theme.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={{ marginLeft: 8 }}
            >
              <Text style={{ fontSize: 20 }}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Search Results */}
      {isLoading && searchQuery.trim() ? (
        <LoadingSpinner message="Searching..." />
      ) : error && searchQuery.trim() ? (
        <ErrorMessage message={error} onRetry={() => searchMovies(searchQuery)} />
      ) : searchQuery.trim() ? (
        <FlatList
          data={searchResults}
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
                😕
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
                Try searching with different keywords
              </Text>
            </View>
          }
        />
      ) : (
        renderEmptyState()
      )}
    </SafeAreaView>
  );
} 