"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView } from "react-native"
import { Picker } from "@react-native-picker/picker"

const boxesData = [
  {
    client: "Abarrotes El Ahorro",
    data2023: { "Coca-Cola": 150, Pepsi: 120, Fanta: 80, Sprite: 60, "Dr Pepper": 40 },
    data2024: { "Coca-Cola": 180, Pepsi: 140, Fanta: 90, Sprite: 70, "Dr Pepper": 50 },
    data2025: { "Coca-Cola": 200, Pepsi: 160, Fanta: 100, Sprite: 80, "Dr Pepper": 60 },
  },
  {
    client: "Distribuidora González",
    data2023: { "Coca-Cola": 220, Pepsi: 180, Fanta: 120, Sprite: 90, "Dr Pepper": 70 },
    data2024: { "Coca-Cola": 250, Pepsi: 200, Fanta: 140, Sprite: 110, "Dr Pepper": 80 },
    data2025: { "Coca-Cola": 280, Pepsi: 220, Fanta: 160, Sprite: 130, "Dr Pepper": 90 },
  },
  {
    client: "Minisuper La Esquina",
    data2023: { "Coca-Cola": 100, Pepsi: 80, Fanta: 60, Sprite: 45, "Dr Pepper": 30 },
    data2024: { "Coca-Cola": 120, Pepsi: 95, Fanta: 70, Sprite: 55, "Dr Pepper": 35 },
    data2025: { "Coca-Cola": 140, Pepsi: 110, Fanta: 80, Sprite: 65, "Dr Pepper": 40 },
  },
  {
    client: "Tienda Don José",
    data2023: { "Coca-Cola": 180, Pepsi: 150, Fanta: 100, Sprite: 75, "Dr Pepper": 55 },
    data2024: { "Coca-Cola": 200, Pepsi: 170, Fanta: 120, Sprite: 85, "Dr Pepper": 65 },
    data2025: { "Coca-Cola": 220, Pepsi: 190, Fanta: 140, Sprite: 95, "Dr Pepper": 75 },
  },
  {
    client: "Comercial Rodríguez",
    data2023: { "Coca-Cola": 160, Pepsi: 130, Fanta: 90, Sprite: 70, "Dr Pepper": 50 },
    data2024: { "Coca-Cola": 180, Pepsi: 150, Fanta: 110, Sprite: 80, "Dr Pepper": 60 },
    data2025: { "Coca-Cola": 200, Pepsi: 170, Fanta: 130, Sprite: 90, "Dr Pepper": 70 },
  },
]

const brands = ["Coca-Cola", "Pepsi", "Fanta", "Sprite", "Dr Pepper"]
const years = ["2023", "2024", "2025"]

const BoxesReport = () => {
  const [selectedMonth, setSelectedMonth] = useState("05") // Mayo por defecto

  // Calcular totales por marca por año
  const calculateTotals = () => {
    const totals = {}
    years.forEach((year) => {
      totals[year] = {}
      brands.forEach((brand) => {
        totals[year][brand] = boxesData.reduce((sum, client) => {
          return sum + (client[`data${year}`][brand] || 0)
        }, 0)
      })
    })
    return totals
  }

  const totals = calculateTotals()

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

      {/* Tabla de cajas por cliente y marca */}
      <View style={styles.tableContainer}>
        <Text style={styles.sectionTitle}>Reporte de Cajas por Cliente y Marca</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.table}>
            {/* Header principal con años */}
            <View style={styles.tableHeaderMain}>
              <Text style={[styles.tableHeaderCell, styles.clientColumn]}>Cliente</Text>
              {years.map((year) => (
                <View key={year} style={[styles.yearHeaderContainer]}>
                  <Text style={styles.yearHeader}>{year}</Text>
                </View>
              ))}
            </View>

            {/* Sub-header con marcas */}
            <View style={styles.tableHeaderSub}>
              <Text style={[styles.tableHeaderCell, styles.clientColumn]}></Text>
              {years.map((year) => (
                <View key={year} style={styles.brandsContainer}>
                  {brands.map((brand) => (
                    <Text key={`${year}-${brand}`} style={styles.brandHeader}>
                      {brand.replace("-", "\n")}
                    </Text>
                  ))}
                </View>
              ))}
            </View>

            {/* Filas de datos */}
            {boxesData.map((row, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.clientColumn]}>{row.client}</Text>
                {years.map((year) => (
                  <View key={year} style={styles.brandsContainer}>
                    {brands.map((brand) => (
                      <Text key={`${year}-${brand}`} style={styles.dataCell}>
                        {row[`data${year}`][brand].toLocaleString()}
                      </Text>
                    ))}
                  </View>
                ))}
              </View>
            ))}

            {/* Fila de totales */}
            <View style={[styles.tableRow, styles.totalRow]}>
              <Text style={[styles.tableCell, styles.clientColumn, styles.boldText]}>TOTAL</Text>
              {years.map((year) => (
                <View key={year} style={styles.brandsContainer}>
                  {brands.map((brand) => (
                    <Text key={`${year}-${brand}`} style={[styles.dataCell, styles.boldText, styles.totalHighlight]}>
                      {totals[year][brand].toLocaleString()}
                    </Text>
                  ))}
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
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
  tableHeaderMain: {
    flexDirection: "row",
    backgroundColor: "#f8f9fa",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  tableHeaderSub: {
    flexDirection: "row",
    backgroundColor: "#f1f5f9",
  },
  tableHeaderCell: {
    padding: 12,
    fontWeight: "bold",
    fontSize: 12,
    textAlign: "center",
    borderRightWidth: 1,
    borderRightColor: "#ddd",
  },
  clientColumn: {
    width: 150,
    textAlign: "left",
  },
  yearHeaderContainer: {
    width: 250, // 5 marcas * 50px cada una
    alignItems: "center",
    justifyContent: "center",
    borderRightWidth: 1,
    borderRightColor: "#ddd",
    paddingVertical: 8,
  },
  yearHeader: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  brandsContainer: {
    flexDirection: "row",
    width: 250,
    borderRightWidth: 1,
    borderRightColor: "#ddd",
  },
  brandHeader: {
    width: 50,
    padding: 8,
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
    borderRightWidth: 1,
    borderRightColor: "#e5e7eb",
    color: "#666",
    lineHeight: 12,
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
    fontSize: 12,
    textAlign: "center",
    borderRightWidth: 1,
    borderRightColor: "#ddd",
  },
  dataCell: {
    width: 50,
    padding: 8,
    fontSize: 11,
    textAlign: "center",
    borderRightWidth: 1,
    borderRightColor: "#e5e7eb",
    color: "#333",
  },
  boldText: {
    fontWeight: "bold",
  },
  totalHighlight: {
    backgroundColor: "#e0f2fe",
    color: "#0369a1",
  },
})

export default BoxesReport
