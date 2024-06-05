// In App.js in a new project

import { NavigationContainer } from '@react-navigation/native';
import * as React from 'react';
import FlashMessage from 'react-native-flash-message';
import StackNav from './routes/Stack';

import { enableScreens } from 'react-native-screens'
import { StatusBar } from 'react-native';
import colors from './utils/colors';


function App() {

  enableScreens()
  return (
    <>
      <NavigationContainer>
        <StatusBar backgroundColor={colors.primary} />
        <StackNav />
      </NavigationContainer>
      <FlashMessage position='top' />
    </>
  );
}

export default App;