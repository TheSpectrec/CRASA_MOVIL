"use client"

import { useState } from "react"
import { View, Text, StyleSheet } from "react-native"
import { Picker } from "@react-native-picker/picker"

const clientsPesosData = [
  { client: "Abarrotes El Ahorro", pesos2023: 24500, pesos2024: 28000, pesos2025: 32000 },
  { client: "Distribuidora González", pesos2023: 38000, pesos2024: 42000, pesos2025: 46500 },
  { client: "Minisuper La Esquina", pesos2023: 18000, pesos2024: 19500, pesos2025: 22500 },
  { client: "Tienda Don José", pesos2023: 29000, pesos2024: 31500, pesos2025: 35000 },
  { client: "Comercial Rodríguez", pesos2023: 42000, pesos2024: 38500, pesos2025: 41000 },
  { client: "Super Mercado Central", pesos2023: 35000, pesos2024: 39000, pesos2025: 42500 },
  { client: "Tienda La Esquina", pesos2023: 16000, pesos2024: 17500, pesos2025: 19000 },
  { client: "Abarrotes San Juan", pesos2023: 22000, pesos2024: 24000, pesos2025: 26500 },
]

const PesosReport = () => {
  const [selectedMonth, setSelectedMonth] = useState("05") // Mayo por defecto

  const totals = clientsPesosData.reduce(
    (acc, client) => ({
      pesos2023: acc.pesos2023 + client.pesos2023,
      pesos2024: acc.pesos2024 + client.pesos2024,
      pesos2025: acc.pesos2025 + client.pesos2025,
    }),
    { pesos2023: 0, pesos2024: 0, pesos2025: 0 },
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

      {/* Tabla de pesos por cliente */}
      <View style={styles.tableContainer}>
        <Text style={styles.sectionTitle}>Reporte de Pesos por Cliente</Text>
        <View style={styles.table}>
          {/* Header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.clientColumnWide]}>Cliente</Text>
            <Text style={styles.tableHeaderCell}>2023</Text>
            <Text style={styles.tableHeaderCell}>2024</Text>
            <Text style={styles.tableHeaderCell}>2025</Text>
          </View>

          {/* Rows */}
          {clientsPesosData.map((row, index) => (
            <View key={index} style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.clientColumnWide]}>{row.client}</Text>
            <Text style={styles.tableCell}>${row.pesos2023.toLocaleString()}</Text>
            <Text style={styles.tableCell}>${row.pesos2024.toLocaleString()}</Text>
            <Text style={styles.tableCell}>${row.pesos2025.toLocaleString()}</Text>
          </View>
          ))}

          {/* Total Row */}
          <View style={[styles.tableRow, styles.specialRow]}>
            <Text style={[styles.tableCell, styles.clientColumnWide, styles.boldText]}>TOTAL</Text>
            <Text style={[styles.tableCell, styles.boldText]}>${totals.pesos2023.toLocaleString()}</Text>
            <Text style={[styles.tableCell, styles.boldText]}>${totals.pesos2024.toLocaleString()}</Text>
            <Text style={[styles.tableCell, styles.boldText, styles.totalHighlight]}>
              ${totals.pesos2025.toLocaleString()}
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
  clientColumnWide: {
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

export default PesosReport
