import React, { createContext, useState, useContext, useEffect } from "react";

// Datos de ejemplo para notificaciones
const sampleNotifications = [
    {
        id: 1,
        title: "Ventas bajas esta semana",
        description: "Ventas 15% por debajo del promedio semanal.",
        date:"Hoy, 10:30 AM",
        type: "low_sales",
        read: false,
    },
    {
        id: 2,
        title: "Meta mensual",
        description: "Faltan 10 ventas para superar el mes del año pasado.",
        date: "Ayer, 2:45 PM",
        type: "sales_target",
        read: false,
    },
    {
        id: 3,
        title: "Sin ventas hoy",
        description: "No has registrado ventas durante el día de hoy.",
        date: "Hoy, 3:00 PM",
        type: "no_sales_today",
        read: false,
    },
    {
        id: "4",
        title: "Cliente inactivo",
        description: "Distribuidora González: 3 meses sin compras.",
        date: "Hace 2 días",
        type: "customer_reminder",
        read: true,
      },
      {
        id: "5",
        title: "Cliente inactivo",
        description: "Abarrotes El Ahorro: 2 meses sin compras.",
        date: "Hace 3 días",
        type: "customer_reminder",
        read: true,
      },
      {
        id: "6",
        title: "Cliente inactivo",
        description: "Abarrotes El Ahorro: 2 meses sin compras.",
        date: "Hace 3 días",
        type: "customer_reminder",
        read: true,
      },
      {
        id: "7",
        title: "Cliente inactivo",
        description: "Abarrotes El Ahorro: 2 meses sin compras.",
        date: "Hace 3 días",
        type: "customer_reminder",
        read: true,
      },
      {
        id: "8",
        title: "Cliente inactivo",
        description: "Abarrotes El Ahorro: 2 meses sin compras.",
        date: "Hace 3 días",
        type: "customer_reminder",
        read: true,
      },
      {
        id: "9",
        title: "Cliente inactivo",
        description: "Abarrotes El Ahorro: 2 meses sin compras.",
        date: "Hace 3 días",
        type: "customer_reminder",
        read: true,
      },
];

const NotificationsContext = createContext()

export const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(sampleNotifications)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    // Calcular el número de notificaciones no leídas
    const count = notifications.filter((notification) => !notification.read).length
    setUnreadCount(count)
  }, [notifications])

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  )
}

export const useNotifications = () => useContext(NotificationsContext)