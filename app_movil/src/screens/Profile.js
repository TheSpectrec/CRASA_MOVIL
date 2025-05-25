import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert } from "react-native";
import { Upload } from "lucide-react-native";
import Colors from "../constants/Colors";

const Profile = ({ navigation }) => {
    const [user] = useState({
        name: "Carlos Rodríguez Peralta",
        rol: "Vendedor",
        email: "carlosrodriguez@example.com",
        initials: "CR"
    })

    const Logout = () => {
        Alert.alert(
            "Cerrar Sesión",
            "¿Estás seguro de cerrar sesión?",
            [
                {
                    text: "Cancelar",
                    onPress: () => console.log("Cancelado el cierre de sesión"),
                    style: "cancel"
                },
                {
                    text: "Aceptar",
                    style: "destructive",
                    onPress: () => {
                        navigation.navigate("login")
                        console.log("Cerrando sesión...")
                    },
                },
            ]
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}> Mi Perfil</Text>
            </View>

            <View style={styles.content}>
                <View style={styles.profileSection}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{user.initials}</Text>
                    </View>
                    <View style={styles.userInfo}>
                        <Text style={styles.userName}>{user.name}</Text>
                        <Text style={styles.userRole}>{user.rol}</Text>
                    </View>
                </View>

                <View style={styles.separator} />

                <View style={styles.infoSection}>
                    <Text style={styles.infoLabel}>Correo electrónico</Text>
                    <Text style={styles.infoValue}>{user.email}</Text>
                </View>

                <TouchableOpacity style={styles.logoutButton} onPress={Logout}>
                    <Upload size={20} color="#ffffff" style={{transform: [{rotate: '90deg'}]}} />
                    <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

export default Profile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.containerColor,
    },
    header: {
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        top: 15,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "bold",
    },
    content: {
        flex: 1,
        padding: 24,
    },
    profileSection: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,

    },
    avatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: Colors.brown,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
    },
    avatarText: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#ffffff",
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 20,
        fontWeight: "bold",
        color: "111827",
        marginBottom: 4,
    },
    userRole: {
        fontSize: 14,
        color: "#6b7280",
    },
    separator: {
        height: 1,
        backgroundColor: "#e5e7eb",
        marginVertical: 16,
    },
    infoSection: {
        marginBottom: 32,
    }, 
    infoLabel: {
        fontSize: 14,
        color: "#6b7280",
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 16,
        color: "#111827",   
    },
    logoutButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.brown,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    logoutButtonText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#ffffff",
        marginLeft: 8,
    },

});