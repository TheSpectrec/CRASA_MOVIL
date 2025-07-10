import React from "react";
import { View, Text, StyleSheet } from "react-native";

const SellerQuotas = () => {
    return (
        <View style={styles.container}>
            <Text>Seller Targets</Text>
        </View>
    );
}

export default SellerQuotas;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});