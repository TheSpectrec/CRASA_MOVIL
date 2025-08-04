"use client";

import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

// Datos mensuales de cajas
const monthlyBoxesData = [
  { month: "Enero", boxes2023: 1200, boxes2024: 1350, boxes2025: 1480 },
  { month: "Febrero", boxes2023: 1100, boxes2024: 1280, boxes2025: 1420 },
  { month: "Marzo", boxes2023: 1300, boxes2024: 1400, boxes2025: 1550 },
  { month: "Abril", boxes2023: 1250, boxes2024: 1320, boxes2025: 1600 },
  { month: "Mayo", boxes2023: 1400, boxes2024: 1500, boxes2025: 1650 },
  { month: "Junio", boxes2023: 1350, boxes2024: 1450, boxes2025: 0 },
  { month: "Julio", boxes2023: 1500, boxes2024: 1600, boxes2025: 0 },
  { month: "Agosto", boxes2023: 1450, boxes2024: 1550, boxes2025: 0 },
  { month: "Septiembre", boxes2023: 1300, boxes2024: 1400, boxes2025: 0 },
  { month: "Octubre", boxes2023: 1200, boxes2024: 1350, boxes2025: 0 },
  { month: "Noviembre", boxes2023: 1100, boxes2024: 1250, boxes2025: 0 },
  { month: "Diciembre", boxes2023: 1000, boxes2024: 1200, boxes2025: 0 },
];

// Datos mensuales de pesos
const monthlyPesosData = [
  { month: "Enero", pesos2023: 67500, pesos2024: 81000, pesos2025: 88800 },
  { month: "Febrero", pesos2023: 61600, pesos2024: 76800, pesos2025: 85200 },
  { month: "Marzo", pesos2023: 72800, pesos2024: 84000, pesos2025: 93000 },
  { month: "Abril", pesos2023: 70000, pesos2024: 79200, pesos2025: 96000 },
  { month: "Mayo", pesos2023: 78400, pesos2024: 90000, pesos2025: 99000 },
  { month: "Junio", pesos2023: 75600, pesos2024: 87000, pesos2025: 0 },
  { month: "Julio", pesos2023: 84000, pesos2024: 96000, pesos2025: 0 },
  { month: "Agosto", pesos2023: 81200, pesos2024: 93000, pesos2025: 0 },
  { month: "Septiembre", pesos2023: 72800, pesos2024: 84000, pesos2025: 0 },
  { month: "Octubre", pesos2023: 67200, pesos2024: 81000, pesos2025: 0 },
  { month: "Noviembre", pesos2023: 61600, pesos2024: 75000, pesos2025: 0 },
  { month: "Diciembre", pesos2023: 56000, pesos2024: 72000, pesos2025: 0 },
];

// Helpers para calcular YTD
const calculateYTD = (data, year, keyPrefix) => {
  const currentMonth = 5; // Mayo (index 0-based +1)
  return data
    .slice(0, currentMonth)
    .reduce((sum, month) => sum + month[`${keyPrefix}${year}`], 0);
};

const GeneralReport = () => {
  // Calcular YTD
  const ytdBoxes = {
    2023: calculateYTD(monthlyBoxesData, 2023, "boxes"),
    2024: calculateYTD(monthlyBoxesData, 2024, "boxes"),
    2025: calculateYTD(monthlyBoxesData, 2025, "boxes"),
  };
  const ytdPesos = {
    2023: calculateYTD(monthlyPesosData, 2023, "pesos"),
    2024: calculateYTD(monthlyPesosData, 2024, "pesos"),
    2025: calculateYTD(monthlyPesosData, 2025, "pesos"),
  };

  // Utilidad para calcular comparaciones
  const calculateComparison = (current, previous) => {
    if (current === 0) return { diff: 0, percent: 0 };
    const diff = current - previous;
    const percent = ((diff / previous) * 100).toFixed(1);
    return { diff, percent };
  };

  const renderTable = (data, title, isBoxes = true) => {
    // Datos ficticios de mes actual / anterior para ejemplo visual
    const currentMonth2024 = isBoxes ? 1500 : 90000;
    const currentMonth2025 = isBoxes ? 1650 : 99000;
    const previousMonth2024 = isBoxes ? 1320 : 79200;
    const previousMonth2025 = isBoxes ? 1600 : 96000;

    const ytd2023 = isBoxes ? ytdBoxes[2023] : ytdPesos[2023];
    const ytd2024 = isBoxes ? ytdBoxes[2024] : ytdPesos[2024];
    const ytd2025 = isBoxes ? ytdBoxes[2025] : ytdPesos[2025];

    return (
      <View style={styles.tableContainer}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.table}>
            {/* Encabezado */}
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, styles.conceptColumn]}>Concepto</Text>
              <Text style={styles.tableHeaderCell}>2023</Text>
              <Text style={styles.tableHeaderCell}>2024</Text>
              <Text style={styles.tableHeaderCell}>2025</Text>
              <Text style={styles.tableHeaderCell}>2024 vs 2025</Text>
            </View>

            {/* Filas por mes */}
            {data.map((row, idx) => {
              const val2023 = isBoxes ? row.boxes2023 : row.pesos2023;
              const val2024 = isBoxes ? row.boxes2024 : row.pesos2024;
              const val2025 = isBoxes ? row.boxes2025 : row.pesos2025;
              const comparison = calculateComparison(val2025, val2024);

              return (
                <View key={idx} style={styles.tableRow}>
                  <Text style={[styles.tableCell, styles.conceptColumn]}>{row.month}</Text>
                  <Text style={styles.tableCell}>{val2023 > 0 ? (isBoxes ? val2023.toLocaleString() : `$${val2023.toLocaleString()}`) : "-"}</Text>
                  <Text style={styles.tableCell}>{val2024 > 0 ? (isBoxes ? val2024.toLocaleString() : `$${val2024.toLocaleString()}`) : "-"}</Text>
                  <Text style={styles.tableCell}>{val2025 > 0 ? (isBoxes ? val2025.toLocaleString() : `$${val2025.toLocaleString()}`) : "-"}</Text>
                  <Text style={[styles.tableCell, val2025 > 0 ? styles.positiveChange : null]}>
                    {val2025 > 0 ? `${comparison.diff >= 0 ? "+" : ""}${isBoxes ? comparison.diff.toLocaleString() : `$${comparison.diff.toLocaleString()}`} (${comparison.percent}%)` : "-"}
                  </Text>
                </View>
              );
            })}

            {/* YTD */}
            <View style={[styles.tableRow, styles.specialRow]}>
              <Text style={[styles.tableCell, styles.conceptColumn, styles.boldText]}>YTD</Text>
              <Text style={[styles.tableCell, styles.boldText]}>{isBoxes ? ytd2023.toLocaleString() : `$${ytd2023.toLocaleString()}`}</Text>
              <Text style={[styles.tableCell, styles.boldText]}>{isBoxes ? ytd2024.toLocaleString() : `$${ytd2024.toLocaleString()}`}</Text>
              <Text style={[styles.tableCell, styles.boldText]}>{isBoxes ? ytd2025.toLocaleString() : `$${ytd2025.toLocaleString()}`}</Text>
              <Text style={[styles.tableCell, styles.boldText, styles.positiveChange]}>
                {isBoxes ? "+" : "+$"}
                {(ytd2025 - ytd2024).toLocaleString()} ({(((ytd2025 - ytd2024) / ytd2024) * 100).toFixed(1)}%)
              </Text>
            </View>

            {/* Mes actual */}
            <View style={[styles.tableRow, styles.specialRow]}>
              <Text style={[styles.tableCell, styles.conceptColumn, styles.boldText]}>Mes Actual</Text>
              <Text style={[styles.tableCell, styles.boldText]}>{isBoxes ? "1,400" : "$78,400"}</Text>
              <Text style={[styles.tableCell, styles.boldText]}>{currentMonth2024.toLocaleString()}</Text>
              <Text style={[styles.tableCell, styles.boldText]}>{currentMonth2025.toLocaleString()}</Text>
              <Text style={[styles.tableCell, styles.boldText, styles.positiveChange]}>
                +{(currentMonth2025 - currentMonth2024).toLocaleString()} ({(((currentMonth2025 - currentMonth2024) / currentMonth2024) * 100).toFixed(1)}%)
              </Text>
            </View>

            {/* Mes anterior */}
            <View style={[styles.tableRow, styles.specialRow]}>
              <Text style={[styles.tableCell, styles.conceptColumn, styles.boldText]}>Mes Anterior</Text>
              <Text style={[styles.tableCell, styles.boldText]}>{isBoxes ? "1,250" : "$70,000"}</Text>
              <Text style={[styles.tableCell, styles.boldText]}>{previousMonth2024.toLocaleString()}</Text>
              <Text style={[styles.tableCell, styles.boldText]}>{previousMonth2025.toLocaleString()}</Text>
              <Text style={[styles.tableCell, styles.boldText, styles.positiveChange]}>
                +{(previousMonth2025 - previousMonth2024).toLocaleString()} ({(((previousMonth2025 - previousMonth2024) / previousMonth2024) * 100).toFixed(1)}%)
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  };

  return (
    <>
      {renderTable(monthlyBoxesData, "Tabla de Cajas", true)}
      {renderTable(monthlyPesosData, "Tabla de Pesos ($)", false)}
    </>
  );
};

const styles = StyleSheet.create({
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
    width: 100,
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
    width: 100,
  },
  conceptColumn: {
    width: 140,
    textAlign: "left",
  },
  boldText: {
    fontWeight: "bold",
  },
  positiveChange: {
    color: "#22c55e",
    fontWeight: "500",
  },
});

export default GeneralReport;
