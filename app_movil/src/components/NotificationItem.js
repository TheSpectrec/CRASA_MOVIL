import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";
import { TrendingDown, TrendingUp, Calendar, UsersRound, TriangleAlert, Check } from "lucide-react-native";
import { useNotifications } from "../contexts/NotificationsContext";
import colors from "../constants/Colors";

const NotificationItem = ({ notification }) => {
    const [modalVisible, setModalVisible] = useState(false)
    const { markAsRead } = useNotifications()

    const handlePress = () => {
        setModalVisible(true)
        if (!notification.read) {
            markAsRead(notification.id)
        }
    }

    const getIcon = () => {
        switch (notification.type) {
            case "low_sales":
                return <TrendingDown size={24} color="#EF4444" />
            case "sales_target":
                return <TrendingUp size={24} color="#F59E0B" />
            case "no_sales_today":
                return <Calendar size={24} color="#EF4444" />
            case "customer_reminder":
                return <UsersRound size={24} color="#3B82F6" />
            default:
                return <TriangleAlert size={24} color="#F59E0B" />
        }
    }

    return (
        <>
            <TouchableOpacity
                style={[styles.card, notification.read ? styles.cardRead : styles.cardUnread]}
                onPress={handlePress}
                activeOpacity={0.7}
            >
                <View style={styles.content}>
                    <View style={styles.iconContainer}>{getIcon()}</View>
                    <View style={styles.textContainer}>
                        <Text style={[styles.title, notification.read ? styles.titleRead : styles.titleUnread]} numberOfLines={1}>
                            {notification.title}
                        </Text>
                        <Text style={styles.description} numberOfLines={2}>
                            {notification.description}
                        </Text>
                        <Text style={styles.date}>{notification.date}</Text>
                    </View>
                </View>
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <View style={styles.modalHeader}>
                            <View style={styles.modalTitleContainer}>
                                {getIcon()}
                                <Text style={styles.modalTitle}>{notification.title}</Text>
                            </View>
                            <Text style={styles.modalDate}>{notification.date}</Text>
                        </View>

                        <View style={styles.modalBody}>
                            <Text style={styles.modalDescription}>{notification.description}</Text>
                        </View>

                        <TouchableOpacity style={styles.button} onPress={() => setModalVisible(false)}>
                            <Check size={16} color="white" style={styles.buttonIcon} />
                            <Text style={styles.buttonText}>Entendido</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </Modal>
        </>
    )
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 8,
        marginHorizontal: 2,
        marginTop: 12,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    cardRead: {
        backgroundColor: "white",
    },
    cardUnread: {
        backgroundColor: "#EFF6FF",
        shadowOpacity: 0.2,
        elevation: 3,
    },
    content: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
    },
    iconContainer: {
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        marginBottom: 4,
        fontSize: 15,
    },
    titleRead: {
        fontWeight: "500",
    },
    titleUnread: {
        fontWeight: "700",
    },
    description: {
        fontSize: 13,
        color: "#4B5563",
        marginBottom: 4,
    },
    date: {
        fontSize: 11,
        color: "#9CA3AF",
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalView: {
        width: "85%",
        backgroundColor: "white",
        borderRadius: 12,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalHeader: {
        marginBottom: 16,
    },
    modalTitleContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 4,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginLeft: 8,
    },
    modalDate: {
        fontSize: 12,
        color: "#9CA3AF",
    },
    modalBody: {
        marginBottom: 20,
    },
    modalDescription: {
        fontSize: 14,
        lineHeight: 20,
    },
    button: {
        backgroundColor: colors.orange,
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
    },
    buttonIcon: {
        marginRight: 8,
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    }
})

export default NotificationItem

