"use client"

import { useState } from "react"
import { View, Text, StyleSheet } from "react-native"
import { Picker } from "@react-native-picker/picker"

const productsData = [
  { product: "Coca-Cola 600ml", ventas2023: 45000, ventas2024: 52000, ventas2025: 58000 },
  { product: "Pepsi 500ml", ventas2023: 38000, ventas2024: 41000, ventas2025: 47000 },
  { product: "Fanta Naranja 355ml", ventas2023: 32000, ventas2024: 35000, ventas2025: 39000 },
  { product: "Sprite 600ml", ventas2023: 28000, ventas2024: 31000, ventas2025: 34000 },
  { product: "Dr Pepper 355ml", ventas2023: 22000, ventas2024: 25000, ventas2025: 28000 },
  { product: "Agua Ciel 1L", ventas2023: 55000, ventas2024: 62000, ventas2025: 68000 },
  { product: "Jugo Del Valle 1L", ventas2023: 18000, ventas2024: 21000, ventas2025: 24000 },
  { product: "Red Bull 250ml", ventas2023: 15000, ventas2024: 18000, ventas2025: 21000 },
  { product: "Monster Energy 473ml", ventas2023: 12000, ventas2024: 15000, ventas2025: 18000 },
  { product: "Powerade 500ml", ventas2023: 25000, ventas2024: 28000, ventas2025: 32000 },
]

const ProductsReport = () => {
  const [selectedMonth, setSelectedMonth] = useState("05") // Mayo por defecto

  const totals = productsData.reduce(
    (acc, product) => ({
      ventas2023: acc.ventas2023 + product.ventas2023,
      ventas2024: acc.ventas2024 + product.ventas2024,
      ventas2025: acc.ventas2025 + product.ventas2025,
    }),
    { ventas2023: 0, ventas2024: 0, ventas2025: 0 },
  )

  return (
    <>
      {/* Filtro por mes */}
      <View style={styles.monthFilterContainer}>
        <Text style={styles.monthFilterLabel}>Filtrar por mes:</Text>
        <View style={styles.monthPickerContainer}>
          <Picker
            selectedValue={selectedMonth}
            onValueChange={(value) => setSelectedMonth(value)}
            style={styles.picker}
          >
            <Picker.Item label="Enero" value="01" />
            <Picker.Item label="Febrero" value="02" />
            <Picker.Item label="Marzo" value="03" />
            <Picker.Item label="Abril" value="04" />
            <Picker.Item label="Mayo" value="05" />
            <Picker.Item label="Junio" value="06" />
            <Picker.Item label="Julio" value="07" />
            <Picker.Item label="Agosto" value="08" />
            <Picker.Item label="Septiembre" value="09" />
            <Picker.Item label="Octubre" value="10" />
            <Picker.Item label="Noviembre" value="11" />
            <Picker.Item label="Diciembre" value="12" />
          </Picker>
        </View>
      </View>

      {/* Tabla de productos */}
      <View style={styles.tableContainer}>
        <Text style={styles.sectionTitle}>Reporte de Productos</Text>
        <View style={styles.table}>
          {/* Header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.productColumnWide]}>Producto</Text>
            <Text style={styles.tableHeaderCell}>2023</Text>
            <Text style={styles.tableHeaderCell}>2024</Text>
            <Text style={styles.tableHeaderCell}>2025</Text>
          </View>

          {/* Rows */}
          {productsData.map((row, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.productColumnWide]}>{row.product}</Text>
              <Text style={styles.tableCell}>${row.ventas2023.toLocaleString()}</Text>
              <Text style={styles.tableCell}>${row.ventas2024.toLocaleString()}</Text>
              <Text style={styles.tableCell}>${row.ventas2025.toLocaleString()}</Text>
            </View>
          ))}

          {/* Total Row */}
          <View style={[styles.tableRow, styles.specialRow]}>
            <Text style={[styles.tableCell, styles.productColumnWide, styles.boldText]}>TOTAL</Text>
            <Text style={[styles.tableCell, styles.boldText]}>${totals.ventas2023.toLocaleString()}</Text>
            <Text style={[styles.tableCell, styles.boldText]}>${totals.ventas2024.toLocaleString()}</Text>
            <Text style={[styles.tableCell, styles.boldText, styles.totalHighlight]}>
              ${totals.ventas2025.toLocaleString()}
            </Text>
          </View>
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  monthFilterContainer: {
    marginBottom: 24,
    padding: 2,
    borderRadius: 8,
  },
  monthFilterLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
    color: "#333",
  },
  monthPickerContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    width: 200,
  },
  picker: {
    height: 50,
  },
  tableContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
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
    fontSize: 12,
    textAlign: "center",
    borderRightWidth: 1,
    borderRightColor: "#ddd",
    minWidth: 80,
  },
  tableRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  specialRow: {
    backgroundColor: "#f9f9f9",
  },
  tableCell: {
    padding: 12,
    fontSize: 12,
    textAlign: "center",
    borderRightWidth: 1,
    borderRightColor: "#ddd",
    minWidth: 80,
  },
  productColumnWide: {
    flex: 2,
    textAlign: "left",
  },
  boldText: {
    fontWeight: "bold",
  },
  totalHighlight: {
    backgroundColor: "#e0f2fe",
    color: "#0369a1",
  },
})

export default ProductsReport
