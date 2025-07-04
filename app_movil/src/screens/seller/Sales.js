import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, FlatList } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Search, X as CloseIcon, ChevronDown, RefreshCw as RefreshIcon } from "lucide-react-native";
import Animated, { useAnimatedScrollHandler, withTiming } from "react-native-reanimated";
import { useTabBar } from "../../contexts/TabBarContext";

// Simple data
const sampleData = {
    companies: [
        { id: "all", name: "Todas las empresas" },
        { id: "1", name: "Distribuidora Norte" },
        { id: "2", name: "Comercial Sur" },
        { id: "3", name: "Mayorista Centro" },
    ],
    brands: [
        { id: "1", name: "Coca-Cola" },
        { id: "2", name: "Pepsi" },
        { id: "3", name: "Fanta" },
        { id: "4", name: "Sprite" },
        { id: "5", name: "Dr Pepper" },
    ],
    families: [
        { id: "1", name: "Bebidas Gaseosas" },
        { id: "2", name: "Jugos Naturales" },
        { id: "3", name: "Agua Embotellada" },
        { id: "4", name: "Bebidas Energéticas" },
    ],
    clients: [
        { id: "1", name: "Abarrotes El Ahorro" },
        { id: "2", name: "Distribuidora González" },
        { id: "3", name: "Minisuper La Esquina" },
        { id: "4", name: "Tienda Don José" },
        { id: "5", name: "Comercial Rodríguez" },
    ],
    products: [
        { id: "1", name: "Coca-Cola 600ml" },
        { id: "2", name: "Pepsi 500ml" },
        { id: "3", name: "Fanta Naranja 355ml" },
        { id: "4", name: "Sprite 600ml" },
        { id: "5", name: "Dr Pepper 355ml" },
    ],
}

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
]

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
  ]

  const reportTypes = [
    { id: "general", name: "General" },
    { id: "boxes", name: "Cajas" },
    { id: "pesos", name: "Pesos" },
    { id: "products", name: "Productos" },
    { id: "families", name: "Familias" },
    { id: "brands", name: "Marcas" }
  ]

const Sales = () => {
    const [selectedReport, setSelectedReport] = useState("general")
    const [filters, setFilters] = useState({
        company: "all",
        brand: null,
        family: null,
        client: null,
        product: null,
    })

    const [modalVisible, setModalVisible] = useState({
        brand: false,
        family: false,
        client: false,
        product: false,
    })

    const [searchText, setSearchText] = useState("")
    const [currentModalData, setCurrentModalData] = useState([])

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

    const openModal = (type) => {
        setSearchText("")
        const keyMap = {
          company: "companies",
          brand: "brands",
          family: "families",
          client: "clients",
          product: "products",
        }
        const dataKey = keyMap[type] || `${type}s`
        setCurrentModalData(sampleData[dataKey] || [])
        setModalVisible({ ...modalVisible, [type]: true })
    }

    const closeModal = (type) => {
        setModalVisible({ ...modalVisible, [type]: false })
        setSearchText("")
    }

    const selectItem = (type, item) => {
        setFilters({ ...filters, [type]: item })
        closeModal(type)
    }

    const clearFilters = () => {
        setFilters({
            company: "all",
            brand: null,
            family: null,
            client: null,
            product: null,
        })
    }

    const filteredModalData = currentModalData.filter((item) =>
        item.name.toLowerCase().includes(searchText.toLowerCase())
    )

    // Cálculos para cajas
    const calculateYTDBoxes = (data, year) => {
        const currentMonth = 5
        return data.slice(0, currentMonth).reduce((sum, month) => sum + month[`boxes${year}`], 0)
    }

    const ytdBoxes2023 = calculateYTDBoxes(monthlyBoxesData, 2023)
    const ytdBoxes2024 = calculateYTDBoxes(monthlyBoxesData, 2024)
    const ytdBoxes2025 = calculateYTDBoxes(monthlyBoxesData, 2025)

    // Cálculos para pesos
    const calculateYTDPesos = (data, year) => {
        const currentMonth = 5
        return data.slice(0, currentMonth).reduce((sum, month) => sum + month[`pesos${year}`], 0)
    }

    const ytdPesos2023 = calculateYTDPesos(monthlyPesosData, 2023)
    const ytdPesos2024 = calculateYTDPesos(monthlyPesosData, 2024)
    const ytdPesos2025 = calculateYTDPesos(monthlyPesosData, 2025)

    const renderTable = (data, title, isBoxes = true) => {
        const currentMonth2024 = isBoxes ? 1500 : 90000
    const currentMonth2025 = isBoxes ? 1650 : 99000
    const previousMonth2024 = isBoxes ? 1320 : 79200
    const previousMonth2025 = isBoxes ? 1600 : 96000

    const ytd2023 = isBoxes ? ytdBoxes2023 : ytdPesos2023
    const ytd2024 = isBoxes ? ytdBoxes2024 : ytdPesos2024
    const ytd2025 = isBoxes ? ytdBoxes2025 : ytdPesos2025

    const calculateComparison = (val2025, val2024) => {
      if (val2025 === 0) return { diff: 0, percent: 0 }
      const diff = val2025 - val2024
      const percent = ((diff / val2024) * 100).toFixed(1)
      return { diff, percent }
    }

    return (
        <View style={styles.tableContainer}>
          <Text style={styles.sectionTitle}>{title}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderCell, styles.conceptColumn]}>Concepto</Text>
                <Text style={styles.tableHeaderCell}>2023</Text>
                <Text style={styles.tableHeaderCell}>2024</Text>
                <Text style={styles.tableHeaderCell}>2025</Text>
                <Text style={styles.tableHeaderCell}>2024 vs 2025</Text>
              </View>
  
              {/* Meses */}
              {data.map((row, index) => {
                const val2023 = isBoxes ? row.boxes2023 : row.pesos2023
                const val2024 = isBoxes ? row.boxes2024 : row.pesos2024
                const val2025 = isBoxes ? row.boxes2025 : row.pesos2025
                const comparison = calculateComparison(val2025, val2024)
  
                return (
                  <View key={index} style={styles.tableRow}>
                    <Text style={[styles.tableCell, styles.conceptColumn]}>{row.month}</Text>
                    <Text style={styles.tableCell}>
                      {val2023 > 0 ? (isBoxes ? val2023.toLocaleString() : `$${val2023.toLocaleString()}`) : "-"}
                    </Text>
                    <Text style={styles.tableCell}>
                      {val2024 > 0 ? (isBoxes ? val2024.toLocaleString() : `$${val2024.toLocaleString()}`) : "-"}
                    </Text>
                    <Text style={styles.tableCell}>
                      {val2025 > 0 ? (isBoxes ? val2025.toLocaleString() : `$${val2025.toLocaleString()}`) : "-"}
                    </Text>
                    <Text style={[styles.tableCell, val2025 > 0 ? styles.positiveChange : null]}>
                      {val2025 > 0
                        ? `${comparison.diff >= 0 ? "+" : ""}${isBoxes ? comparison.diff.toLocaleString() : `$${comparison.diff.toLocaleString()}`} (${comparison.percent}%)`
                        : "-"}
                    </Text>
                  </View>
                )
              })}
  
              {/* YTD */}
              <View style={[styles.tableRow, styles.specialRow]}>
                <Text style={[styles.tableCell, styles.conceptColumn, styles.boldText]}>YTD</Text>
                <Text style={[styles.tableCell, styles.boldText]}>
                  {isBoxes ? ytd2023.toLocaleString() : `$${ytd2023.toLocaleString()}`}
                </Text>
                <Text style={[styles.tableCell, styles.boldText]}>
                  {isBoxes ? ytd2024.toLocaleString() : `$${ytd2024.toLocaleString()}`}
                </Text>
                <Text style={[styles.tableCell, styles.boldText]}>
                  {isBoxes ? ytd2025.toLocaleString() : `$${ytd2025.toLocaleString()}`}
                </Text>
                <Text style={[styles.tableCell, styles.boldText, styles.positiveChange]}>
                  {isBoxes ? "+" : "+$"}
                  {(ytd2025 - ytd2024).toLocaleString()} ({(((ytd2025 - ytd2024) / ytd2024) * 100).toFixed(1)}%)
                </Text>
              </View>
  
              {/* Mes Actual */}
              <View style={[styles.tableRow, styles.specialRow]}>
                <Text style={[styles.tableCell, styles.conceptColumn, styles.boldText]}>Mes Actual</Text>
                <Text style={[styles.tableCell, styles.boldText]}>{isBoxes ? "1,400" : "$78,400"}</Text>
                <Text style={[styles.tableCell, styles.boldText]}>{currentMonth2024.toLocaleString()}</Text>
                <Text style={[styles.tableCell, styles.boldText]}>{currentMonth2025.toLocaleString()}</Text>
                <Text style={[styles.tableCell, styles.boldText, styles.positiveChange]}>
                  +{(currentMonth2025 - currentMonth2024).toLocaleString()} (
                  {(((currentMonth2025 - currentMonth2024) / currentMonth2024) * 100).toFixed(1)}%)
                </Text>
              </View>
  
              {/* Mes Anterior */}
              <View style={[styles.tableRow, styles.specialRow]}>
                <Text style={[styles.tableCell, styles.conceptColumn, styles.boldText]}>Mes Anterior</Text>
                <Text style={[styles.tableCell, styles.boldText]}>{isBoxes ? "1,250" : "$70,000"}</Text>
                <Text style={[styles.tableCell, styles.boldText]}>{previousMonth2024.toLocaleString()}</Text>
                <Text style={[styles.tableCell, styles.boldText]}>{previousMonth2025.toLocaleString()}</Text>
                <Text style={[styles.tableCell, styles.boldText, styles.positiveChange]}>
                  +{(previousMonth2025 - previousMonth2024).toLocaleString()} (
                  {(((previousMonth2025 - previousMonth2024) / previousMonth2024) * 100).toFixed(1)}%)
                </Text>
              </View>
            </View>
          </ScrollView>
        </View>
      )
    }
  
    const renderFilterModal = (type, title) => (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible[type]}
        onRequestClose={() => closeModal(type)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Seleccionar {title}</Text>
              <TouchableOpacity onPress={() => closeModal(type)}>
                <CloseIcon name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
  
            <View style={styles.searchContainer}>
              <Search name="search" size={20} color="#666" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder={`Buscar ${title.toLowerCase()}...`}
                value={searchText}
                onChangeText={setSearchText}
              />
            </View>
  
            <FlatList
              data={filteredModalData}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.modalItem} onPress={() => selectItem(type, item)}>
                  <Text style={styles.modalItemText}>{item.name}</Text>
                </TouchableOpacity>
              )}
              style={styles.modalList}
            />
          </View>
        </View>
      </Modal>
    )
  
    const renderGeneralReport = () => (
      <>
        {renderTable(monthlyBoxesData, "Tabla de Cajas", true)}
        {renderTable(monthlyPesosData, "Tabla de Pesos ($)", false)}
      </>
    )
  
    const renderOtherReport = (reportName) => (
      <View style={styles.emptyReport}>
        <Text style={styles.emptyReportText}>Contenido de {reportName}</Text>
        <Text style={styles.emptyReportSubtext}>Esta sección estará disponible próximamente</Text>
      </View>
    )
  
    return (
      <Animated.ScrollView style={styles.container} onScroll={scrollHandler} scrollEventThrottle={16}>
        {/* Header con selector de reporte */}
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Ventas</Text>
          <View style={styles.reportSelector}>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedReport}
                onValueChange={(value) => setSelectedReport(value)}
                style={styles.picker}
              >
                {reportTypes.map((report) => (
                  <Picker.Item key={report.id} label={report.name} value={report.id} />
                ))}
              </Picker>
            </View>
          </View>
        </View>
  
        {/* Filtros */}
        <View style={styles.filtersContainer}>
          <View style={styles.filtersHeader}>
            <Text style={styles.sectionTitle}>Filtros</Text>
            <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
              <RefreshIcon size={16} color="#666" />
              <Text style={styles.clearButtonText}>Limpiar</Text>
            </TouchableOpacity>
          </View>
  
          <View style={styles.filtersGrid}>
            {/* Primera columna */}
            <View style={styles.filterColumn}>
              {/* Empresa */}
              <View style={styles.filterItem}>
                <Text style={styles.filterLabel}>Empresa:</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={filters.company}
                    onValueChange={(value) => setFilters({ ...filters, company: value })}
                    style={styles.picker}
                  >
                    {sampleData.companies.map((company) => (
                      <Picker.Item key={company.id} label={company.name} value={company.id} />
                    ))}
                  </Picker>
                </View>
              </View>
  
              {/* Familia */}
              <View style={styles.filterItem}>
                <Text style={styles.filterLabel}>Familia:</Text>
                <TouchableOpacity style={styles.filterButton} onPress={() => openModal("family", "Familia")}>
                  <Text style={styles.filterButtonText} numberOfLines={1} ellipsizeMode="tail">
                    {filters.family ? filters.family.name : "Familia"}
                  </Text>
                  <ChevronDown name="chevron-down" size={16} color="#666" />
                </TouchableOpacity>
              </View>
  
              {/* Producto */}
              <View style={styles.filterItem}>
                <Text style={styles.filterLabel}>Producto:</Text>
                <TouchableOpacity style={styles.filterButton} onPress={() => openModal("product", "Producto")}>
                  <Text style={styles.filterButtonText} numberOfLines={1} ellipsizeMode="tail">
                    {filters.product ? filters.product.name : "Producto"}
                  </Text>
                  <ChevronDown name="chevron-down" size={16} color="#666" />
                </TouchableOpacity>
              </View>
            </View>
  
            {/* Segunda columna */}
            <View style={styles.filterColumn}>
              {/* Marca */}
              <View style={styles.filterItem}>
                <Text style={styles.filterLabel}>Marca:</Text>
                <TouchableOpacity style={styles.filterButton} onPress={() => openModal("brand", "Marca")}>
                  <Text style={styles.filterButtonText} numberOfLines={1} ellipsizeMode="tail">{filters.brand ? filters.brand.name : "Marca"}</Text>
                  <ChevronDown name="chevron-down" size={16} color="#666" />
                </TouchableOpacity>
              </View>
  
              {/* Cliente */}
              <View style={styles.filterItem}>
                <Text style={styles.filterLabel}>Cliente:</Text>
                <TouchableOpacity style={styles.filterButton} onPress={() => openModal("client", "Cliente")}>
                  <Text style={styles.filterButtonText} numberOfLines={1} ellipsizeMode="tail">
                    {filters.client ? filters.client.name : "Cliente"}
                  </Text>
                  <ChevronDown name="chevron-down" size={16} color="#666" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
  
        {/* Contenido según el reporte seleccionado */}
        {selectedReport === "general" && renderGeneralReport()}
        {selectedReport === "boxes" && renderOtherReport("Reporte de cajas")}
        {selectedReport === "products" && renderOtherReport("Reporte de productos")}
        {selectedReport === "pesos" && renderOtherReport("Reporte de pesos")}
        {selectedReport === "families" && renderOtherReport("Reporte de familias")}
        {selectedReport === "brands" && renderOtherReport("Reporte de marcas")}
  
        {/* Modales */}
        {renderFilterModal("brand", "Marca")}
        {renderFilterModal("family", "Familia")}
        {renderFilterModal("client", "Cliente")}
        {renderFilterModal("product", "Producto")}
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
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 25,
      top: 6,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      flex: 1,
    },
    reportSelector: {
        width: 170,
    },
    reportLabel: {
      fontSize: 14,
      fontWeight: "500",
      marginBottom: 8,
      color: "#333",
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: "#333",
    },
    filtersContainer: {
      marginBottom: 24,
      
      padding: 16,
      borderRadius: 8,
      borderColor: "#ddd",
      borderWidth: 1,
    },
    filtersHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    clearButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "white",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: "#ddd",
    },
    clearButtonText: {
      marginLeft: 4,
      fontSize: 12,
      color: "#666",
    },
    filtersGrid: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    filterColumn: {
      flex: 1,
      marginHorizontal: 4,
    },
    filterItem: {
      marginBottom: 16,
    },
    filterLabel: {
      fontSize: 14,
      fontWeight: "500",
      marginBottom: 8,
      color: "#333",
    },
    pickerContainer: {
      backgroundColor: "white",
      borderRadius: 8,
      borderWidth: 1,
      borderColor: "#ddd",
      height: 50,
      justifyContent: "center",
      backgroundColor: "white",
      borderRadius: 8,
      borderWidth: 1,
      borderColor: "#ddd",
    },
    picker: {
      height: 46,
      height: 50,
    },
    filterButton: {
      backgroundColor: "white",
      height: 50,
      paddingHorizontal: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: "#ddd",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "white",
      padding: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: "#ddd",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    filterButtonText: {
      fontSize: 14,
      color: "#333",
      flex: 1,
      marginRight: 6,
      fontSize: 14,
      color: "#333",
      flex: 1,
    },
    tableContainer: {
      marginBottom: 24,
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
    conceptColumn: {
      minWidth: 120,
      textAlign: "left",
    },
    boldText: {
      fontWeight: "bold",
    },
    positiveChange: {
      color: "#22c55e",
      fontWeight: "500",
    },
    emptyReport: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 60,
    },
    emptyReportText: {
      fontSize: 18,
      fontWeight: "600",
      color: "#333",
      marginBottom: 8,
    },
    emptyReportSubtext: {
      fontSize: 14,
      color: "#666",
    },
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalView: {
      width: "90%",
      height: "70%",
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
      alignItems: "center",
      marginBottom: 16,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "bold",
    },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#f8f9fa",
      borderRadius: 8,
      paddingHorizontal: 12,
      marginBottom: 16,
    },
    searchIcon: {
      marginRight: 8,
    },
    searchInput: {
      flex: 1,
      height: 40,
      fontSize: 14,
    },
    modalList: {
      flex: 1,
    },
    modalItem: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: "#f0f0f0",
    },
    modalItemText: {
      fontSize: 14,
      color: "#333",
    },
  })
  
  export default Sales
  