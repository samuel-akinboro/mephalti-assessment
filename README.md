# MovieApp - React Native Movie Application

A modern, cross-platform movie application built with React Native, Expo Router, and TypeScript. The app allows users to browse popular movies, search for content, view detailed information, and save favorites locally.

## 🎬 Features

### Core Features
- **Home Screen**: Browse popular movies with a beautiful card-based layout
- **Search Functionality**: Real-time search with debounced API calls
- **Movie Details**: Comprehensive movie information including cast, crew, and trailers
- **Favorites System**: Save and manage favorite movies locally
- **Dark/Light Mode**: Toggle between themes with persistent storage
- **Onboarding**: Welcome screen for first-time users

### Technical Features
- **Zustand State Management**: Efficient and lightweight state management
- **TypeScript**: Full type safety throughout the application
- **React Native Reanimated**: Smooth animations and transitions
- **Expo Router**: File-based routing with bottom tab navigation
- **NativeWind**: Utility-first styling with Tailwind CSS
- **AsyncStorage**: Local data persistence for favorites and settings
- **TMDb API Integration**: Real movie data from The Movie Database

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Yarn or npm
- Expo CLI
- iOS Simulator or Android Emulator (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mephalti-assessment
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Set up TMDb API Key**
   - Sign up for a free account at [The Movie Database](https://www.themoviedb.org/settings/api)
   - Get your API key from the settings
   - Open `store/movieStore.ts`
   - Replace `'your_tmdb_api_key_here'` with your actual API key

4. **Start the development server**
   ```bash
   yarn start
   ```

5. **Run on your device/simulator**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on your phone

## 📱 App Structure

```
mephalti-assessment/
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx          # Tab navigation configuration
│   │   ├── index.tsx            # Home screen
│   │   ├── search.tsx           # Search screen
│   │   └── favorites.tsx        # Favorites screen
│   ├── _layout.tsx              # Root layout with onboarding
│   ├── onboarding.tsx           # Welcome screen
│   └── movie-details.tsx        # Movie details screen
├── components/
│   ├── MovieCard.tsx            # Reusable movie card component
│   ├── LoadingSpinner.tsx       # Loading animation component
│   └── ErrorMessage.tsx         # Error state component
├── store/
│   └── movieStore.ts            # Zustand store with API integration
├── constants/
│   └── Theme.ts                 # Theme configuration
└── assets/                      # Images and fonts
```

## 🏗️ Architecture

### State Management (Zustand)
The app uses Zustand for state management with the following structure:
- **Theme State**: Dark/light mode toggle with persistence
- **Movie Data**: Popular movies, search results, and movie details
- **Favorites**: Local storage of user's favorite movies
- **Loading States**: API call status management
- **Error Handling**: Centralized error state management

### API Integration
- **TMDb API**: Fetches real movie data including:
  - Popular movies
  - Search results
  - Movie details with cast and crew
  - Movie trailers
- **Image URLs**: Dynamic image loading with different sizes
- **Error Handling**: Graceful fallbacks for failed API calls

### Navigation (Expo Router)
- **File-based Routing**: Automatic route generation
- **Bottom Tab Navigation**: Home, Search, and Favorites
- **Stack Navigation**: Movie details and onboarding screens
- **Deep Linking**: Support for direct navigation to movie details

### Styling (NativeWind)
- **Utility-first CSS**: Rapid UI development
- **Theme System**: Consistent colors and spacing
- **Responsive Design**: Adapts to different screen sizes
- **Dark Mode**: Complete theme switching

## 🎨 UI/UX Features

### Design System
- **Consistent Theming**: Unified color palette and typography
- **Card-based Layout**: Modern, clean interface
- **Smooth Animations**: Reanimated-powered transitions
- **Loading States**: Engaging loading animations
- **Error States**: User-friendly error messages

### User Experience
- **Onboarding Flow**: Guided first-time user experience
- **Persistent Preferences**: Remembers theme and favorites
- **Offline Support**: Cached data for better performance
- **Accessibility**: Proper contrast and touch targets

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:
```env
TMDB_API_KEY=your_api_key_here
```

### API Configuration
The app is configured to use TMDb API v3. Update the API key in `store/movieStore.ts`:
```typescript
const TMDB_API_KEY = 'your_actual_api_key';
```

## 📦 Dependencies

### Core Dependencies
- `expo`: React Native framework
- `expo-router`: File-based routing
- `react-native-reanimated`: Animation library
- `zustand`: State management
- `axios`: HTTP client
- `@react-native-async-storage/async-storage`: Local storage

### Development Dependencies
- `typescript`: Type safety
- `nativewind`: Utility-first styling
- `tailwindcss`: CSS framework

## 🚀 Deployment

### Building for Production
```bash
# Build for iOS
expo build:ios

# Build for Android
expo build:android

# Build for web
expo build:web
```

### EAS Build (Recommended)
```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Configure EAS
eas build:configure

# Build for platforms
eas build --platform ios
eas build --platform android
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [The Movie Database](https://www.themoviedb.org/) for providing the movie data API
- [Expo](https://expo.dev/) for the amazing React Native framework
- [Zustand](https://github.com/pmndrs/zustand) for lightweight state management
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) for smooth animations

## 📞 Support

If you encounter any issues or have questions:
1. Check the [Issues](../../issues) page
2. Create a new issue with detailed information
3. Contact the development team

---

**Note**: Make sure to replace the TMDb API key with your own before running the application. The current placeholder will not work for API calls. 