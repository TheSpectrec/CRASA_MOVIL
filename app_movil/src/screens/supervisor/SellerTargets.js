import React from "react";
import { View, Text, StyleSheet } from "react-native";

const SellerTargets = () => {
    return (
        <View style={styles.container}>
            <Text>Seller Targets</Text>
        </View>
    );
}

export default SellerTargets;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});