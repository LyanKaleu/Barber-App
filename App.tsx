import 'react-native-gesture-handler';
import * as React from 'react';
import { ThemeProvider } from 'styled-components';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import * as Font from 'expo-font';

import ThemeSwitcher from './src/components/ThemeSwitcher';
import light from './src/styles/themes/light';
import dark from './src/styles/themes/dark';

import Routes from './src/routes';
import AppProvider from './src/hooks';

const loadFonts = async () => {
  await Font.loadAsync({
    'RobotoSlab-Regular': require('./assets/fonts/RobotoSlab-Regular.ttf'),
    'RobotoSlab-Medium': require('./assets/fonts/RobotoSlab-Medium.ttf'),
  });
};

export default function App() {
  const [theme, setTheme] = React.useState(dark);
  const [isFontLoaded, setFontLoaded] = React.useState(false);

  React.useEffect(() => {
    const loadResources = async () => {
      await loadFonts();
      setFontLoaded(true);
    };

    loadResources();
  }, []);

  const toogleTheme = (): void => {
    setTheme(theme.title === 'dark' ? light : dark); 
  }

  if (!isFontLoaded) {
    return null; // Você pode adicionar um carregador aqui, se desejar.
  }


  return (
    <ActionSheetProvider>
      <NavigationContainer>
          <ThemeProvider theme={theme}>
            <StatusBar barStyle="light-content" backgroundColor="#312e38" translucent/>
            <AppProvider>
              <Routes />
            </AppProvider>
            <ThemeSwitcher toggleTheme={toogleTheme} />
          </ThemeProvider>
      </NavigationContainer>
    </ActionSheetProvider>
  );
}
