"use client"

import { useState, useRef } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal } from "react-native"
import { Picker } from "@react-native-picker/picker"
import { useTabBar } from "../../contexts/TabBarContext"
import Animated, { useAnimatedScrollHandler, withTiming } from "react-native-reanimated";

// Icons
import { Users, TrendingUp, TrendingDown, Calendar, AlertTriangle, BellOff, X, AlertCircle, Send, CheckCircle, Check, CheckCheck } from "lucide-react-native"

// Colors
import colors from "../../constants/Colors"

const supervisorNotificationsData = [
  {
    id: "1",
    vendorId: "v1",
    vendorName: "Juan Pérez",
    title: "Ventas bajas esta semana",
    description: "Ventas 15% por debajo del promedio semanal.",
    date: "Hoy, 10:30 AM",
    type: "low_sales",
    read: false,
  },
  {
    id: "2",
    vendorId: "v1",
    vendorName: "Juan Pérez",
    title: "Meta mensual",
    description: "Faltan 10 ventas para superar el mes del año pasado.",
    date: "Ayer, 2:45 PM",
    type: "sales_target",
    read: true,
  },
  {
    id: "3",
    vendorId: "v1",
    vendorName: "Juan Pérez",
    title: "Cliente inactivo",
    description: "Distribuidora González: 3 meses sin compras.",
    date: "Hace 2 días",
    type: "customer_reminder",
    read: false,
  },


  {
    id: "4",
    vendorId: "v2",
    vendorName: "María García",
    title: "Sin ventas hoy",
    description: "No ha registrado ventas durante el día de hoy.",
    date: "Hoy, 3:00 PM",
    type: "no_sales_today",
    read: false,
  },
  {
    id: "5",
    vendorId: "v2",
    vendorName: "María García",
    title: "Excelente desempeño",
    description: "Ha superado la meta semanal en un 25%.",
    date: "Ayer, 5:20 PM",
    type: "sales_target",
    read: true,
  },
  {
    id: "6",
    vendorId: "v2",
    vendorName: "María García",
    title: "Cliente inactivo",
    description: "Abarrotes El Ahorro: 2 meses sin compras.",
    date: "Hace 1 día",
    type: "customer_reminder",
    read: false,
  },

  {
    id: "7",
    vendorId: "v3",
    vendorName: "Carlos López",
    title: "Ventas excepcionales",
    description: "Ventas 30% por encima del promedio mensual.",
    date: "Hoy, 11:15 AM",
    type: "sales_target",
    read: true,
  },
  {
    id: "8",
    vendorId: "v3",
    vendorName: "Carlos López",
    title: "Nuevo cliente potencial",
    description: "Contacto con Supermercado Central para nueva cuenta.",
    date: "Hoy, 9:00 AM",
    type: "customer_reminder",
    read: false,
  },

  // Vendedor 4: Ana Rodríguez
  {
    id: "9",
    vendorId: "v4",
    vendorName: "Ana Rodríguez",
    title: "Ventas bajas esta semana",
    description: "Ventas 20% por debajo del promedio semanal.",
    date: "Hoy, 8:45 AM",
    type: "low_sales",
    read: false,
  },
  {
    id: "10",
    vendorId: "v4",
    vendorName: "Ana Rodríguez",
    title: "Recordatorio de seguimiento",
    description: "Pendiente seguimiento con 3 clientes importantes.",
    date: "Ayer, 4:30 PM",
    type: "customer_reminder",
    read: false,
  },
]

const vendors = [
  { id: "v1", name: "Juan Pérez" },
  { id: "v2", name: "María García" },
  { id: "v3", name: "Carlos López" },
  { id: "v4", name: "Ana Rodríguez" },
]

const Notifications = () => {
  const [selectedVendor, setSelectedVendor] = useState("v1") // Iniciar con el primer vendedor
  const [notifications, setNotifications] = useState(supervisorNotificationsData)
  const [selectedNotification, setSelectedNotification] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const { tabBarVisibility } = useTabBar()
  const lastScrollY = useRef(0)

  // Scroll
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

  // Filtrar notificaciones por vendedor seleccionado
  const filteredNotifications = notifications.filter((notification) => notification.vendorId === selectedVendor)

  // Contar notificaciones no leídas
  const unreadCount = filteredNotifications.filter((notification) => !notification.read).length

  const getIcon = (type) => {
    switch (type) {
      case "low_sales":
        return <TrendingDown size={24} color="#ef4444" />
      case "sales_target":
        return <TrendingUp size={24} color="#f59e0b" />
      case "no_sales_today":
        return <Calendar size={24} color="#ef4444" />
      case "customer_reminder":
        return <Users size={24} color="#3b82f6" />
      default:
        return <AlertTriangle size={24} color="#f59e0b" />
    }
  }

  const handleNotificationPress = (notification) => {
    setSelectedNotification(notification)
    setModalVisible(true)
    // IMPORTANTE: NO marcamos como leída automáticamente para el supervisor
  }

  const handleResendNotification = (notification) => {
    // Simular reenvío de notificación
    alert(`Notificación reenviada a ${notification.vendorName}`)
    setModalVisible(false)
  }

  const renderNotificationItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.notificationCard, item.read ? styles.cardRead : styles.cardUnread]}
      onPress={() => handleNotificationPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        <View style={styles.iconContainer}>{getIcon(item.type)}</View>
        <View style={styles.textContainer}>
          <View style={styles.headerRow}>
          </View>
          <Text style={[styles.title, item.read ? styles.titleRead : styles.titleUnread]} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>
          <Text style={styles.date}>{item.date}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      {/* Header con filtro de vendedor */}
      <View style={styles.headerContainer}>
        <Text style={styles.titleHeader}>Notificaciones</Text>
        {unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unreadCount} sin leer</Text>
          </View>
        )}
      </View>

      {/* Filtro por vendedor */}
      <View style={styles.filterContainer}>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedVendor}
            onValueChange={(value) => setSelectedVendor(value)}
            style={styles.picker}
          >
            {vendors.map((vendor) => (
              <Picker.Item key={vendor.id} label={vendor.name} value={vendor.id} />
            ))}
          </Picker>
        </View>
      </View>

      {/* Lista de notificaciones */}
      <Animated.FlatList
        data={filteredNotifications}
        keyExtractor={(item) => item.id}
        renderItem={renderNotificationItem}
        contentContainerStyle={styles.list}
        bounces={true}
        overScrollMode="always"
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <BellOff size={48} color="#9ca3af" />
            <Text style={styles.emptyText}>No hay notificaciones</Text>
            <Text style={styles.emptySubtext}>
              No hay notificaciones de {vendors.find((v) => v.id === selectedVendor)?.name}
            </Text>
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

      {/* Modal de detalle */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {selectedNotification && (
              <>
                <View style={styles.modalHeader}>
                  <View style={styles.modalTitleContainer}>
                    {getIcon(selectedNotification.type)}
                    <View style={styles.modalTitleText}>
                      <Text style={styles.modalTitle}>{selectedNotification.title}</Text>
                    </View>
                  </View>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <X size={24} color="#666" />
                  </TouchableOpacity>
                </View>

                <Text style={styles.modalDate}>{selectedNotification.date}</Text>

                <View style={styles.modalBody}>
                  <Text style={styles.modalDescription}>{selectedNotification.description}</Text>

                  {/* Estado de lectura */}
                  <View style={styles.statusContainer}>
                    <View
                      style={[
                        styles.statusIndicator,
                        selectedNotification.read ? styles.statusRead : styles.statusUnread,
                      ]}
                    >
                      {selectedNotification.read ? (
                        <CheckCircle size={16} color="#22c55e" />
                      ) : (
                        <AlertCircle size={16} color="#ef4444" />
                      )}
                      <Text
                        style={[
                          styles.statusText,
                          selectedNotification.read ? styles.statusTextRead : styles.statusTextUnread,
                        ]}
                      >
                        {selectedNotification.read ? "Leída por el vendedor" : "No leída por el vendedor"}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.modalFooter}>
                  {!selectedNotification.read && (
                    <TouchableOpacity
                      style={styles.resendButton}
                      onPress={() => handleResendNotification(selectedNotification)}
                    >
                      <Send size={16} color="white" style={styles.buttonIcon} />
                      <Text style={styles.resendButtonText}>Reenviar Notificación</Text>
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity
                    style={[styles.closeButton, !selectedNotification.read && styles.closeButtonSecondary]}
                    onPress={() => setModalVisible(false)}
                  >
                    <Check
                      size={16}
                      color={!selectedNotification.read ? "#666" : "white"}
                      style={styles.buttonIcon}
                    />
                    <Text
                      style={[styles.closeButtonText, !selectedNotification.read && styles.closeButtonTextSecondary]}
                    >
                      Cerrar
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.containerColor,
    padding: 16,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  titleHeader: {
    fontSize: 24,
    fontWeight: "bold",
  },
  badge: {
    backgroundColor: colors.brown,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  filterContainer: {
    marginBottom: 20,
  },
  pickerContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  picker: {
    height: 50,
  },
  list: {
    flexGrow: 1,
  },
  notificationCard: {
    borderRadius: 8,
    marginHorizontal: 2,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardRead: {
    backgroundColor: "white",
  },
  cardUnread: {
    backgroundColor: "#eff6ff",
    shadowOpacity: 0.2,
    elevation: 3,
  },
  cardContent: {
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
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  vendorName: {
    fontSize: 12,
    fontWeight: "600",
    flex: 1,
  },
  textRead: {
    color: "#6b7280",
  },
  textUnread: {
    color: "#3b82f6",
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ef4444",
    marginLeft: 8,
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
    color: "#4b5563",
    marginBottom: 4,
  },
  date: {
    fontSize: 11,
    color: "#9ca3af",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: "90%",
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  modalTitleContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
  },
  modalTitleText: {
    marginLeft: 12,
    flex: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  modalVendor: {
    fontSize: 14,
    color: "#3b82f6",
    fontWeight: "500",
  },
  modalDate: {
    fontSize: 12,
    color: "#9ca3af",
    marginBottom: 16,
  },
  modalBody: {
    marginBottom: 20,
  },
  modalDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  statusContainer: {
    marginTop: 8,
  },
  statusIndicator: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  statusRead: {
    backgroundColor: "#f0fdf4",
    borderColor: "#bbf7d0",
  },
  statusUnread: {
    backgroundColor: "#fef2f2",
    borderColor: "#fecaca",
  },
  statusText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "500",
  },
  statusTextRead: {
    color: "#166534",
  },
  statusTextUnread: {
    color: "#dc2626",
  },
  modalFooter: {
    gap: 12,
  },
  resendButton: {
    backgroundColor: colors.orange,
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  resendButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  closeButton: {
    backgroundColor: "#3b82f6",
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonSecondary: {
    backgroundColor: "#f3f4f6",
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  closeButtonTextSecondary: {
    color: "#666",
  },
  buttonIcon: {
    marginRight: 8,
  },
})

export default Notifications
