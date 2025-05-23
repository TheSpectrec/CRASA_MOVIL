import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Targets = () => {
    return (
        <View style={styles.container}>
            <Text>Targets</Text>
        </View>
    );
}

export default Targets;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});