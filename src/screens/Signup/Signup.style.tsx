import { StyleSheet, Dimensions } from 'react-native';

export default (theme: any) => StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    padding: 20,
  },
  contentContainerStyle: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: "40%",
  },
  header: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 50
  },
  button: {
    backgroundColor: "#1DB954",
    padding: 5,
    borderRadius: 20,
    width: '100%',
  },
  labelStyle: {
    fontSize: 16,
  },
  image: {
    height: 300,
    width: Dimensions.get('screen').width,
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 20,
    zIndex: -1,
  }
});
