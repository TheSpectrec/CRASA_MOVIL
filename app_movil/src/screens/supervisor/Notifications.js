import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useNotifications } from "../../contexts/NotificationsContext";
import { useTabBar } from "../../contexts/TabBarContext";
import Animated, { useAnimatedScrollHandler, withTiming } from "react-native-reanimated";
import NotificationItem from "../../components/NotificationItem";
import Colors from "../../constants/Colors";
import { Users } from "lucide-react-native";

const sellersData = [
  { id: "seller1", name: "Juan Pérez" },
  { id: "seller2", name: "María López" },
  { id: "seller3", name: "Carlos Gómez" },
]

const Notifications = () => {
    const navigation = useNavigation()
    const { notifications } = useNotifications()
    const { tabBarVisibility } = useTabBar()
    const lastScrollY = useRef(0)
    const [sellerDropdownVisible, setSellerDropdownVisible] = useState(false)
    const [selectedSeller, setSelectedSeller] = useState("seller1")
    const DROPDOWN_WIDTH = 160
    const [dropdownPos, setDropdownPos] = useState({ x: 0, y: 0 })
    const buttonRef = useRef(null)

    
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
            <TouchableOpacity
              ref={buttonRef}
              style={styles.filterButton}
              onPress={() => {
                if (buttonRef.current) {
                  buttonRef.current.measureInWindow((x, y, w, h) => {
                    const left = x + w - DROPDOWN_WIDTH;
                    setDropdownPos({ x: left, y: y + h });
                  })
                }
                setSellerDropdownVisible(v => !v)
              }}
            >
              <Users size={20} color="#333" />
            </TouchableOpacity>
          </View>
    
          {sellerDropdownVisible && (
            <View style={[styles.dropdownContainer, { top: dropdownPos.y, left: dropdownPos.x }]}> 
              {sellersData.map((seller) => (
                <TouchableOpacity
                  key={seller.id}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSelectedSeller(seller.id);
                    setSellerDropdownVisible(false);
                  }}
                >
                  <Text style={[styles.dropdownItemText, selectedSeller === seller.id && styles.selectedSellerText]}>
                    {seller.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

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
    filterButton: {
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#ddd",
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
    dropdownContainer: {
        position: "absolute",
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 10,
        zIndex: 1000,
    },
    dropdownItem: {
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    dropdownItemText: {
        fontSize: 16,
        color: "#333",
    },
    selectedSellerText: {
        color: Colors.orange,
        fontWeight: "700",
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
