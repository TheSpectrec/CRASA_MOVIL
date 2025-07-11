"use client"

import React, { useState, useRef } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { Picker } from "@react-native-picker/picker"
import Colors from "../../constants/Colors"
import { Users } from "lucide-react-native"
import Animated, { useAnimatedScrollHandler, withTiming } from "react-native-reanimated"
import { useTabBar } from "../../contexts/TabBarContext"

// Sample data
const monthsData = [
  { id: "01", name: "Enero" },
  { id: "02", name: "Febrero" },
  { id: "03", name: "Marzo" },
  { id: "04", name: "Abril" },
  { id: "05", name: "Mayo" },
  { id: "06", name: "Junio" },
  { id: "07", name: "Julio" },
  { id: "08", name: "Agosto" },
  { id: "09", name: "Septiembre" },
  { id: "10", name: "Octubre" },
  { id: "11", name: "Noviembre" },
  { id: "12", name: "Diciembre" },
]

const sellersData = [
  { id: "seller1", name: "Juan Pérez" },
  { id: "seller2", name: "María López" },
  { id: "seller3", name: "Carlos Gómez" },
]

const quotasData = {
  costeña: {
    summary: {
      cuota: 150000,
      avance: 125000,
      diferencia: -25000,
    },
    clients: [
      { client: "Abarrotes El Ahorro", cuota: 25000, avance: 22000, diferencia: -3000 },
      { client: "Distribuidora González", cuota: 35000, avance: 38000, diferencia: 3000 },
      { client: "Minisuper La Esquina", cuota: 20000, avance: 18000, diferencia: -2000 },
      { client: "Tienda Don José", cuota: 30000, avance: 25000, diferencia: -5000 },
      { client: "Comercial Rodríguez", cuota: 40000, avance: 22000, diferencia: -18000 },
    ],
  },
  jumex: {
    summary: {
      cuota: 120000,
      avance: 135000,
      diferencia: 15000,
    },
    clients: [
      { client: "Abarrotes El Ahorro", cuota: 20000, avance: 25000, diferencia: 5000 },
      { client: "Distribuidora González", cuota: 30000, avance: 32000, diferencia: 2000 },
      { client: "Minisuper La Esquina", cuota: 15000, avance: 18000, diferencia: 3000 },
      { client: "Tienda Don José", cuota: 25000, avance: 28000, diferencia: 3000 },
      { client: "Comercial Rodríguez", cuota: 30000, avance: 32000, diferencia: 2000 },
    ],
  },
}

const SellerQuotas = () => {
  const [selectedMonth, setSelectedMonth] = useState("05") // Mayo por defecto
  const [selectedBrand, setSelectedBrand] = useState("costeña")
  const [sellerDropdownVisible, setSellerDropdownVisible] = useState(false)
  const [dropdownPos, setDropdownPos] = useState({ x: 0, y: 0 })
  const buttonRef = useRef(null)
  const [selectedSeller, setSelectedSeller] = useState("seller1")

  // Tab bar visibility on scroll
  const { tabBarVisibility } = useTabBar()
  const lastScrollY = useRef(0)
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const currentY = event.contentOffset.y
      if (currentY < lastScrollY.current || currentY <= 0) {
        tabBarVisibility.value = withTiming(1, { duration: 300 })
      } else if (currentY > lastScrollY.current && currentY > 10) {
        tabBarVisibility.value = withTiming(0, { duration: 300 })
      }
      lastScrollY.current = currentY
    },
  })

  const renderSummaryCard = (brandName, data) => (
    <View style={styles.summaryCard}>
      <Text style={styles.cardTitle}>{brandName}</Text>
      <View style={styles.summaryRow}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Cuota</Text>
          <Text style={styles.summaryValue}>${data.cuota.toLocaleString()}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Avance</Text>
          <Text style={styles.summaryValue}>${data.avance.toLocaleString()}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Diferencia</Text>
          <Text style={[styles.summaryValue, data.diferencia >= 0 ? styles.positiveValue : styles.negativeValue]}>
            ${data.diferencia.toLocaleString()}
          </Text>
        </View>
      </View>
    </View>
  )

  const renderTable = () => {
    const currentData = quotasData[selectedBrand]
    const totals = currentData.clients.reduce(
      (acc, client) => ({
        cuota: acc.cuota + client.cuota,
        avance: acc.avance + client.avance,
        diferencia: acc.diferencia + client.diferencia,
      }),
      { cuota: 0, avance: 0, diferencia: 0 },
    )

    return (
      <View style={styles.tableContainer}>

        <View style={styles.table}>
          {/* Header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.clientColumn]}>Cliente</Text>
            <Text style={styles.tableHeaderCell}>Cuota</Text>
            <Text style={styles.tableHeaderCell}>Avance</Text>
            <Text style={styles.tableHeaderCell}>Diferencia</Text>
          </View>

          {/* Rows */}
          {currentData.clients.map((row, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.clientColumn]}>{row.client}</Text>
              <Text style={styles.tableCell}>${row.cuota.toLocaleString()}</Text>
              <Text style={styles.tableCell}>${row.avance.toLocaleString()}</Text>
              <Text style={[styles.tableCell, row.diferencia >= 0 ? styles.positiveChange : styles.negativeChange]}>
                ${row.diferencia.toLocaleString()}
              </Text>
            </View>
          ))}

          {/* Total Row */}
          <View style={[styles.tableRow, styles.totalRow]}>
            <Text style={[styles.tableCell, styles.clientColumn, styles.boldText]}>TOTAL</Text>
            <Text style={[styles.tableCell, styles.boldText]}>${totals.cuota.toLocaleString()}</Text>
            <Text style={[styles.tableCell, styles.boldText]}>${totals.avance.toLocaleString()}</Text>
            <Text
              style={[
                styles.tableCell,
                styles.boldText,
                totals.diferencia >= 0 ? styles.positiveChange : styles.negativeChange,
              ]}
            >
              ${totals.diferencia.toLocaleString()}
            </Text>
          </View>
        </View>
      </View>
    )
  }

  return (
    <Animated.ScrollView style={styles.container} onScroll={scrollHandler} scrollEventThrottle={16}>
      {/* Header con selector de mes */}
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Cuotas</Text>
        <TouchableOpacity
          ref={buttonRef}
          style={styles.iconButton}
          onPress={() => {
            if (buttonRef.current) {
              buttonRef.current.measureInWindow((x, y, width, height) => {
                setDropdownPos({ x, y: y + height })
              })
            }
            setSellerDropdownVisible((v) => !v)
          }}
        >
          <Users size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.monthSelector}>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedMonth}
              onValueChange={(value) => setSelectedMonth(value)}
              style={styles.picker}
            >
              {monthsData.map((month) => (
                <Picker.Item key={month.id} label={month.name} value={month.id} />
              ))}
            </Picker>
          </View>
        </View>
      </View>

      {/* Seller Dropdown */}
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

      {/* Summary Cards */}
      <View style={styles.cardsContainer}>
        {renderSummaryCard("Costeña", quotasData.costeña.summary)}
        {renderSummaryCard("Jumex", quotasData.jumex.summary)}
      </View>

      {/* Brand Toggle */}
      <View style={styles.toggleContainer}>
        <View style={styles.toggleButtons}>
          <TouchableOpacity
            style={[styles.toggleButton, selectedBrand === "costeña" && styles.activeToggle]}
            onPress={() => setSelectedBrand("costeña")}
          >
            <Text style={[styles.toggleButtonText, selectedBrand === "costeña" && styles.activeToggleText]}>
              Costeña
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, selectedBrand === "jumex" && styles.activeToggle]}
            onPress={() => setSelectedBrand("jumex")}
          >
            <Text style={[styles.toggleButtonText, selectedBrand === "jumex" && styles.activeToggleText]}>Jumex</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Table */}
      {renderTable()}
    </Animated.ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    top: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    flex: 1,
  },
  monthSelector: {
    width: 150,
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
  cardsContainer: {
    marginBottom: 24,
  },
  summaryCard: {
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
    color: "#333",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  summaryItem: {
    alignItems: "center",
    flex: 1,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    fontWeight: "500",
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  positiveValue: {
    color: "#22c55e",
  },
  negativeValue: {
    color: "#ef4444",
  },
  toggleContainer: {
    marginBottom: 20,
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
  },
  toggleButtons: {
    flexDirection: "row",
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: "center",
  },
  activeToggle: {
    backgroundColor: Colors.orange,
  },
  toggleButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#64748b",
  },
  activeToggleText: {
    color: "white",
  },
  tableContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
  },
  table: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f8f9fa",
  },
  tableHeaderCell: {
    padding: 12,
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "center",
    borderRightWidth: 1,
    borderRightColor: "#ddd",
    flex: 1,
  },
  tableRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  totalRow: {
    backgroundColor: "#f9f9f9",
  },
  tableCell: {
    padding: 12,
    fontSize: 13,
    textAlign: "center",
    borderRightWidth: 1,
    borderRightColor: "#ddd",
    flex: 1,
  },
  clientColumn: {
    flex: 2,
    textAlign: "left",
  },
  boldText: {
    fontWeight: "bold",
  },
  positiveChange: {
    color: "#22c55e",
    fontWeight: "500",
  },
  negativeChange: {
    color: "#ef4444",
    fontWeight: "500",
  },
  iconButton: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginRight: 8,
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
    position: "absolute",
    top: 60,
    right: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
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
  }
})

export default SellerQuotas
