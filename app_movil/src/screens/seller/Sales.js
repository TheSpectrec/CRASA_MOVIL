import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, FlatList } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Search, X as CloseIcon, ChevronDown, RefreshCw as RefreshIcon, CloseCircle, Check } from "lucide-react-native";
import Animated, { useAnimatedScrollHandler, withTiming } from "react-native-reanimated";
import { useTabBar } from "../../contexts/TabBarContext";
import Colors from "../../constants/Colors";

// Reports
import PesosReport from "../PesosReport";
import ProductsReport from "../ProductsReport";
import FamiliesReport from "../FamiliesReport";
import BoxesReport from "../BoxesReport";
import BrandsReport from "../BrandsReport";
import GeneralReport from "../GeneralReport";

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
    companies: [],
    brands: [],
    families: [],
    clients: [],
    products: [],
  })

  const [modalVisible, setModalVisible] = useState({
    company: false,
    brand: false,
    family: false,
    client: false,
    product: false,
  })

  const [searchText, setSearchText] = useState("")

  // Utility to get the corresponding key inside the filters/sampleData objects
  const getFilterKey = (type) => {
    if (type === "company") return "companies";
    if (type === "family") return "families"; // plural irregularity
    return `${type}s`;
  }
  const [currentModalData, setCurrentModalData] = useState([])
  const [currentModalType, setCurrentModalType] = useState("")

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
    setCurrentModalData(sampleData[getFilterKey(type)])
    setCurrentModalType(type)
    setModalVisible({ ...modalVisible, [type]: true })
  }

  const closeModal = (type) => {
    setModalVisible({ ...modalVisible, [type]: false })
    setSearchText("")
    setCurrentModalType("")
  }

  const toggleItem = (type, item) => {
    const filterKey = getFilterKey(type)
    const currentSelection = filters[filterKey]
    const isSelected = currentSelection.some((selected) => selected.id === item.id)

    let newSelection
    if (isSelected) {
      // Remover el item si ya esta seleccionado
      newSelection = currentSelection.filter((selected) => selected.id !== item.id)
    } else {
      // Agregar el item si no esta seleccionado
      newSelection = [...currentSelection, item]
    }

    setFilters({ ...filters, [filterKey]: newSelection })
  }

  const clearFilters = () => {
    setFilters({
      companies: [],
      brands: [],
      families: [],
      clients: [],
      products: [],
    })
  }

  const clearSpecificFilter = (type) => {
    const filterKey = getFilterKey(type)
    setFilters({ ...filters, [filterKey]: [] })
  }

  const filteredModalData = currentModalData.filter((item) =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  )

  const getSelectedText = (type) => {
    // Map English filter keys to Spanish labels for UI
    const labels = {
      company: { singular: "empresa", plural: "empresas" },
      brand: { singular: "marca", plural: "marcas" },
      family: { singular: "familia", plural: "familias" },
      client: { singular: "cliente", plural: "clientes" },
      product: { singular: "producto", plural: "productos" },
    }

    const filterKey = getFilterKey(type)
    const selected = filters[filterKey]

    const { singular, plural } = labels[type] || { singular: type, plural: `${type}s` }

    if (selected.length === 0) {
      return `Seleccionar ${singular}`
    } else if (selected.length === 1) {
      return selected[0].name
    } else {
      return `${selected.length} ${plural} seleccionados`
    }
  }

  const renderFilterModal = (type, title) => {
    const filterKey = getFilterKey(type)
    const selectedItems = filters[filterKey]

    return (
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
              <View style={styles.modalHeaderButtons}>
                {selectedItems.length > 0 && (
                  <TouchableOpacity style={styles.clearFilterButton} onPress={() => clearSpecificFilter(type)}>
                    <Text style={styles.clearFilterButtonText}>Limpiar</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={() => closeModal(type)}>
                  <CloseIcon size={24} color="#666" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.searchContainer}>
              <Search size={20} color="#666" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder={`Buscar ${title.toLowerCase()}...`}
                value={searchText}
                onChangeText={setSearchText}
              />
            </View>

            {selectedItems.length > 0 && (
              <View style={styles.selectedContainer}>
                <Text style={styles.selectedTitle}>Seleccionados ({selectedItems.length}):</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.selectedScroll}>
                  {selectedItems.map((item) => (
                    <View key={item.id} style={styles.selectedTag}>
                      <Text style={styles.selectedTagText}>{item.name}</Text>
                      <TouchableOpacity onPress={() => toggleItem(type, item)}>
                        <CloseIcon size={16} color="#666" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}

            <FlatList
              data={filteredModalData}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                const isSelected = selectedItems.some((selected) => selected.id === item.id)
                return (
                  <TouchableOpacity
                    style={[styles.modalItem, isSelected && styles.modalItemSelected]}
                    onPress={() => toggleItem(type, item)}
                  >
                    <View style={styles.modalItemContent}>
                      <Text style={[styles.modalItemText, isSelected && styles.modalItemTextSelected]}>
                        {item.name}
                      </Text>
                      <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                        {isSelected && <Check size={14} color="white" />}
                      </View>
                    </View>
                  </TouchableOpacity>
                )
              }}
              style={styles.modalList}
            />

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.doneButton} onPress={() => closeModal(type)}>
                <Text style={styles.doneButtonText}>Listo</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    )
  }

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
              <TouchableOpacity style={styles.filterButton} onPress={() => openModal("company", "Empresa")}>
                <Text style={styles.filterButtonText}>{getSelectedText("company")}</Text>
                <View style={styles.filterButtonRight}>
                  {filters.companies.length > 0 && (
                    <View style={styles.filterBadge}>
                      <Text style={styles.filterBadgeText}>{filters.companies.length}</Text>
                    </View>
                  )}
                  <ChevronDown size={16} color="#666" />
                </View>
              </TouchableOpacity>
            </View>

            {/* Familia */}
            <View style={styles.filterItem}>
              <Text style={styles.filterLabel}>Familia:</Text>
              <TouchableOpacity style={styles.filterButton} onPress={() => openModal("family", "Familia")}>
                <Text style={styles.filterButtonText}>{getSelectedText("family")}</Text>
                <View style={styles.filterButtonRight}>
                  {filters.families.length > 0 && (
                    <View style={styles.filterBadge}>
                      <Text style={styles.filterBadgeText}>{filters.families.length}</Text>
                    </View>
                  )}
                  <ChevronDown size={16} color="#666" />
                </View>
              </TouchableOpacity>
            </View>

            {/* Producto */}
            <View style={styles.filterItem}>
              <Text style={styles.filterLabel}>Producto:</Text>
              <TouchableOpacity style={styles.filterButton} onPress={() => openModal("product", "Producto")}>
                <Text style={styles.filterButtonText}>{getSelectedText("product")}</Text>
                <View style={styles.filterButtonRight}>
                  {filters.products.length > 0 && (
                    <View style={styles.filterBadge}>
                      <Text style={styles.filterBadgeText}>{filters.products.length}</Text>
                    </View>
                  )}
                  <ChevronDown size={16} color="#666" />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Segunda columna */}
          <View style={styles.filterColumn}>
            {/* Marca */}
            <View style={styles.filterItem}>
              <Text style={styles.filterLabel}>Marca:</Text>
              <TouchableOpacity style={styles.filterButton} onPress={() => openModal("brand", "Marca")}>
                <Text style={styles.filterButtonText}>{getSelectedText("brand")}</Text>
                <View style={styles.filterButtonRight}>
                  {filters.brands.length > 0 && (
                    <View style={styles.filterBadge}>
                      <Text style={styles.filterBadgeText}>{filters.brands.length}</Text>
                    </View>
                  )}
                  <ChevronDown size={16} color="#666" />
                </View>
              </TouchableOpacity>
            </View>

            {/* Cliente */}
            <View style={styles.filterItem}>
              <Text style={styles.filterLabel}>Cliente:</Text>
              <TouchableOpacity style={styles.filterButton} onPress={() => openModal("client", "Cliente")}>
                <Text style={styles.filterButtonText}>{getSelectedText("client")}</Text>
                <View style={styles.filterButtonRight}>
                  {filters.clients.length > 0 && (
                    <View style={styles.filterBadge}>
                      <Text style={styles.filterBadgeText}>{filters.clients.length}</Text>
                    </View>
                  )}
                  <ChevronDown size={16} color="#666" />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* Contenido según el reporte seleccionado */}
      {selectedReport === "general" && <GeneralReport />}
      {selectedReport === "boxes" && <BoxesReport />}
      {selectedReport === "products" && <ProductsReport />}
      {selectedReport === "pesos" && <PesosReport />}
      {selectedReport === "families" && <FamiliesReport />}
      {selectedReport === "brands" && <BrandsReport />}

      {/* Modales */}
      {renderFilterModal("company", "Empresa")}
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
  },
  picker: {
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
  },
  filterButtonText: {
    fontSize: 14,
    color: "#333",
    flex: 1,
  },
  filterButtonRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  filterBadge: {
    backgroundColor: Colors.orange,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 8,
    minWidth: 20,
    alignItems: "center",
  },
  filterBadgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
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
    modalHeaderButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
    clearFilterButton: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 12,
  },
    clearFilterButtonText: {
    fontSize: 12,
    color: "#666",
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
  selectedContainer: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  selectedTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  selectedScroll: {
    maxHeight: 40,
  },
  selectedTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7E4D7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 8,
  },
  selectedTagText: {
    fontSize: 12,
    color: "#E77A34",
    marginRight: 4,
  },
  modalList: {
    flex: 1,
  },
  modalItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
    modalItemSelected: {
    backgroundColor: "#F9ECE4",
  },
  modalItemContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalItemText: {
    fontSize: 14,
    color: "#333",
  },
  modalItemTextSelected: {
    color: Colors.brown,
    fontWeight: "500",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#d1d5db",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxSelected: {
    backgroundColor: Colors.orange,
    borderColor: Colors.orange,
  },
  modalFooter: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "white",
  },
  doneButton: {
    backgroundColor: Colors.orange,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  doneButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
})

export default Sales
