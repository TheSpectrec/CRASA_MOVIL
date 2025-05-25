import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useNotifications } from "../../contexts/NotificationsContext";
import { useTabBar } from "../../contexts/TabBarContext";
import Animated, { useAnimatedScrollHandler, withTiming } from "react-native-reanimated";
import NotificationItem from "../../components/NotificationItem";
import Colors from "../../constants/Colors";

const Notifications = () => {
    const navigation = useNavigation()
    const { notifications, unreadCount } = useNotifications()
    const { tabBarVisibility } = useTabBar()
    const lastScrollY = useRef(0)

    // Actualizar el badge del tab de notificaciones
    useEffect(() => {
        navigation.setParams({ unreadCount })
    }, [unreadCount, navigation])
    
    // Scroll handler to show/hide tab bar
    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            const currentScrollY = event.contentOffset.y
            
            // Show tab bar when scrolling up, hide when scrolling down
            if (currentScrollY < lastScrollY.current || currentScrollY <= 0) {
                // Scrolling up or at the top
                tabBarVisibility.value = withTiming(1, { duration: 300 })
            } else if (currentScrollY > lastScrollY.current && currentScrollY > 10) {
                // Scrolling down and not at the very top
                tabBarVisibility.value = withTiming(0, { duration: 300 })
            }
            
            lastScrollY.current = currentScrollY
        }
    })

    return (
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Notificaciones</Text>
            {unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadCount} sin leer</Text>
              </View>
            )}
          </View>
    
          <Animated.FlatList
            data={notifications}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <NotificationItem notification={item} />}
            contentContainerStyle={styles.list}
            bounces={true}
            overScrollMode="always"
            onScroll={scrollHandler}
            scrollEventThrottle={16} // For smooth updates
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No hay notificaciones</Text>
              </View>
            }
            ListFooterComponent={
              notifications.length > 0 ? (
                <View style={styles.footerContainer}>
                  <Text style={styles.footerText}>No hay más notificaciones</Text>
                </View>
              ) : null
            }
          />
        </View>
      )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.containerColor,
        padding: 16,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 25,
        top: 15,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
    },
    badge: {
        backgroundColor: Colors.brown,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    badgeText: {
        color: "white",
        fontSize: 12,
        fontWeight: "bold",
    },
    list: {
        flexGrow: 1,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 40,
    },
    emptyText: {
        fontSize: 16,
        color: "#6b7280",
    },
    footerContainer: {
        paddingVertical: 20,
        alignItems: "center",
    },
    footerText: {
        fontSize: 14,
        color: "#9CA3AF",
        fontStyle: "italic",
    },
});

export default Notifications;
