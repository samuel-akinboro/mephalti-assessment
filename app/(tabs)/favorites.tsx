import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useMovieStore, Movie } from '../../store/movieStore';
import { MovieCard } from '../../components/MovieCard';
import { lightTheme, darkTheme } from '../../constants/Theme';

export default function FavoritesScreen() {
  const { isDarkMode, favorites } = useMovieStore();
  const theme = isDarkMode ? darkTheme : lightTheme;

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
        ❤️
      </Text>
      <Text style={{
        color: theme.text,
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
      }}>
        No favorites yet
      </Text>
      <Text style={{
        color: theme.textSecondary,
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 24,
      }}>
        Start exploring movies and add them to your favorites
      </Text>
      
      <TouchableOpacity
        onPress={() => router.push('/(tabs)')}
        style={{
          backgroundColor: theme.primary,
          paddingHorizontal: 24,
          paddingVertical: 12,
          borderRadius: 8,
        }}
      >
        <Text style={{
          color: '#FFFFFF',
          fontSize: 16,
          fontWeight: 'bold',
        }}>
          Explore Movies
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: theme.background,
    }}>
      {/* Header */}
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
          marginBottom: 8,
        }}>
          Favorites
        </Text>
        <Text style={{
          color: theme.textSecondary,
          fontSize: 16,
        }}>
          {favorites.length} movie{favorites.length !== 1 ? 's' : ''} saved
        </Text>
      </View>

      {/* Favorites List */}
      {favorites.length > 0 ? (
        <FlatList
          data={favorites}
          renderItem={renderMovieItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={{ padding: 20 }}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        renderEmptyState()
      )}
    </SafeAreaView>
  );
} 