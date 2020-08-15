import React from 'react';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppContextProvider } from './src/config/AppContextProvider';
import AppNavigator from './src/config/AppNavigator';
import store from './src/store/store';

// import SplashScreen from 'react-native-splash-screen';

// when app in the production the uri should be the deployed api link
declare const global: {HermesInternal: null | {}};

export default class App extends React.Component {
  // eslint-disable-next-line class-methods-use-this

  // componentDidMount = () => {
  //   SplashScreen.hide();
  // }

  render() {
    return (
      <Provider store={store}>
        <AppContextProvider>
          <SafeAreaProvider>
            <AppNavigator />
          </SafeAreaProvider>
        </AppContextProvider>
      </Provider>
    );
  }
}
