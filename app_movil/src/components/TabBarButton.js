import React, { useEffect } from 'react';
import { Animated, Pressable, StyleSheet, Text } from "react-native";
import { icons } from "../constants/Icons"
import { interpolate, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

const TabBarButton = ({onPress, onLongPress, isFocused, routeName, label}) => {
    const scale = useSharedValue(0);

    useEffect(() => {
        scale.value = withSpring(typeof isFocused === 'boolean' ? (isFocused ? 1 : 0) : isFocused, 
        { duration: 350 }
    );
    }, [scale, isFocused]);

    const animatedIconStyle = useAnimatedStyle(() => {
        const scaleValue = interpolate(scale.value, [0, 1], [1, 1.2]);
        const translateY = interpolate(scale.value, [0, 1], [0, -4]);

        return {
            transform: [
                { scale: scaleValue },
                { translateY }
            ]
        }
    });
    
    return (
        <Pressable
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabbarItem}
        >
            <Animated.View style={[animatedIconStyle, { marginBottom: isFocused ? 0 : 16 }]}>
                {icons[routeName]({
                    color: isFocused ? '#fff' : '#222',
                    size: isFocused ? 28 : 24
                })}
            </Animated.View>
            
            {!isFocused && (
                <Text style={styles.label}>
                    {label}
                </Text>
            )}
        </Pressable>
    )
} 

export default TabBarButton;

const styles = StyleSheet.create({
    tabbarItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
    },
    label: {
        color: '#222',
        fontSize: 12,
        position: 'absolute',
        bottom: 6
    }
});