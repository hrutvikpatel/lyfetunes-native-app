import React from 'react';

import { Provider as PaperProvider } from 'react-native-paper';

import { Light } from '../assets/style/theme';

const Context = React.createContext();

export class AppContextProvider extends React.Component {
  state = {
    theme: Light,
    updateTheme: (theme) => {
      this.setState({ theme });
    }
  };

  render() {
    const { theme } = this.state;
    return (
      <Context.Provider value={this.state}>
        <PaperProvider theme={theme}>
          {this.props.children}
        </PaperProvider>
      </Context.Provider>
    );
  }
}

export const AppConsumer = Context.Consumer;
export const AppContext = Context;
