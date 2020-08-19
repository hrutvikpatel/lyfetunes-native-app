import React, { useState, useEffect, createContext } from 'react';
import { withTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Animated, Dimensions } from 'react-native';

import jsx from './ViewSlider.style';

const TOP_DEFAULT_HEIGHT = Dimensions.get("window").height * 0.1;
const BOTTOM_DEFAULT_HEIGHT = Dimensions.get("window").height * 0.2;
const ANIMATION_DURATION = 250;
const DEFAULT_POSITION = 0;

interface iPartyViewContextProps {
    onCloseSlider: (() => void) | (() => null)
}

const PartyViewContext = createContext<iPartyViewContextProps>({
    onCloseSlider: () => null
})

interface iViewSliderProps {
    open: boolean,
    onClose: () => void,
    side: 'top' | 'bottom',
    theme: any,
    children: React.ReactElement | React.ReactElement[],
    title?: string,
    hidden: boolean
}

const ViewSlider = (props: iViewSliderProps) => {
    const {
        open,
        onClose,
        children,
        theme,
        hidden
    } = props;
    const defaultHeight = props.side === 'top'
        ? TOP_DEFAULT_HEIGHT
        : BOTTOM_DEFAULT_HEIGHT

    const [height] = useState(new Animated.Value(defaultHeight));
    const [position] = useState(new Animated.Value(DEFAULT_POSITION));

    const styles = jsx(theme);

    useEffect(() => {
        let toHeight;
        if (open) {
            toHeight = Dimensions.get('window').height * 0.95
        } else {
            toHeight = defaultHeight;
        }
        Animated.timing(
            height,
            {
                toValue: toHeight,
                duration: ANIMATION_DURATION,
                useNativeDriver: false,
            }
        ).start();
    }, [open]);

    useEffect(() => {
        let toPosition;
        if (hidden) {
            toPosition = -200;
        } else {
            toPosition = DEFAULT_POSITION;
        }
        Animated.timing(
            position,
            {
                toValue: toPosition,
                duration: ANIMATION_DURATION,
                useNativeDriver: false,
            }
        ).start();
    }, [hidden]);

    let animatedViewStyle: any[] = [
        styles.slider,
        {
            height,
            [props.side]: position
        }
    ];
    if (props.side === 'top') {
        animatedViewStyle.unshift(styles.topSlider);
    } else {
        animatedViewStyle.unshift(styles.bottomSlider);
    }

    return (
        <PartyViewContext.Provider
            value={{
                onCloseSlider: onClose
            }}
        >
            <Animated.View
                style={animatedViewStyle}
            >
                <SafeAreaView
                    edges={[props.side]}
                    style={styles.safeAreaView}
                >
                    {children}
                </SafeAreaView>
            </Animated.View>
        </PartyViewContext.Provider>
    )
}

export const withSlider = <P extends object>(Component: React.ComponentType<P>) => {
    return (props: any) => (
        <PartyViewContext.Consumer>
            {value => (
                <Component
                    {...props}
                    onCloseSlider={value.onCloseSlider}
                />
            )}
        </PartyViewContext.Consumer>
    )
}       

export default withTheme(ViewSlider);