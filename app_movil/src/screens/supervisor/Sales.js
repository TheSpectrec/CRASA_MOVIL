import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Sales = () => {
    return (
        <View style={styles.container}>
            <Text>Sales</Text>
        </View>
    );
}

export default Sales;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});