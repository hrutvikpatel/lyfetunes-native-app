import { StyleSheet } from 'react-native';

export default (theme: any) => StyleSheet.create({
    slider: {
        elevation: 3,
        paddingHorizontal: 20,
        width: '100%',
        position: 'absolute',
        display: 'flex',
        flexDirection: 'column',
        shadowColor: '#ccc',
        shadowRadius: 8,
        shadowOpacity: 0.9,
        backgroundColor: 'white',
        zIndex: 999
    },
    topSlider: {
        top: 0,
        paddingBottom: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    bottomSlider: {
        bottom: 0,
        paddingTop: 20,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
    },
    safeAreaView: {
        height: '100%',
        width: '100%'
    }
});
