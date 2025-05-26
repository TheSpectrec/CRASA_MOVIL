import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Modal, TextInput, FlatList } from "react-native";
import Colors from "../../constants/Colors"
import { ChevronDown } from "lucide-react-native";

const Sales = () => {
    const [empresa, setEmpresa] = useState("Todas")
    const [marca, setMarca] = useState("Todas")
    const [familia, setFamilia] = useState("Todas")
    const [cliente, setCliente] = useState("Todos")
    const [producto, setProducto] = useState("Todos")

    const [modalVisible, setModalVisible] = useState(false)
    const [currentFilter, setCurrentFilter] = useState("")
    const [searchText, setSearchText] = useState("")

    const filterOptions = {
        empresas: ["Todas", "Comercializadora Eloro", "Con Alimentos", "Conservas La Costeña", "CRASA"],
        marcas: ["Todas", "Con Alimentos", "JUMEX", "La Costeña", "Estevia"],
        familias: ["Todas", "Aceite", "Agua Natural", "Arizona", "AMI 1.8"],
        clientes: ["Todos", "Abarrotera Fuentes Abad Rivera", "Abarrotera Fuentes Galeana", "Abarrotera Fuentes Jojutla Centro"],
        productos: ["Todos", "Aceitunas c/hueso caja 12/210 g", "Adobo Chonita Caja 24/350 g", "Agua Natural Mia 24/500ml Pet"]
    }

    const monthlySalesData = [
        { month: "Enero", 2023: 120, 2024: 145, 2025: 160 },
        { month: "Febrero", 2023: 135, 2024: 150, 2025: 175 },
        { month: "Marzo", 2023: 140, 2024: 160, 2025: 180 },
        { month: "Abril", 2023: 150, 2024: 165, 2025: 190 },
        { month: "Mayo", 2023: 145, 2024: 170, 2025: 195 },
        { month: "Junio", 2023: 155, 2024: 175, 2025: 200 },
    ]

    const summaryData = {
        currentMonth: 195,
        previousMonth: 170,
        ytd2023: 845,
        ytd2024: 965,
        ytd2025: 1100,
    }

    const openFilterModal = (filtertype) => {
        setCurrentFilter(filtertype)
        setModalVisible(true)
        setSearchText("")
    }

    const selectFilterOption = (option) => {
        switch (currentFilter) {
            case "marca":
                setMarca(option)
                break
            case "familia":
                setFamilia(option)
                break
            case "cliente":
                setCliente(option)
                break
            case "producto":
                setProducto(option)
                break
        }
        setModalVisible(false)
    }

    const getFilteredOptions = () => {
        const options = filterOptions[currentFilter + "s"] || []
        return options.filter((option) => option.toLowerCase().includes(searchText.toLowerCase()))
    }

    const calculateDifference = (row) => {
        const value2024 = row["2024"]
        const value2025 = row["2025"]

        if (value2025 === 0) return { diff: 0, percent: 0 }

        const diff = value2025 - value2024
        const percent = value2024 > 0 ? (diff / value2024) * 100 : 0

        return { diff, percent: Math.round(percent * 10) / 10 }
    }

    const FilterButton = ({ label, value, onPress }) => (
        <View style={styles.filterContainer}>
            <Text style={styles.filterLabel}>{label}</Text>
            <TouchableOpacity style={styles.filterButton} onPress={onPress}>
                <Text style={styles.filterButtonText}>{value}</Text>
                <ChevronDown size={16} color="#6B7280" />
            </TouchableOpacity>
        </View>
    )

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Ventas</Text>
            </View>

            <ScrollView style={styles.scrollView}>
                {/* Filtros */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Filtros</Text>
                    <View style={styles.filtersGrid}>
                        <View style={styles.filterContainer}>
                            <Text style={styles.filterLabel}>Empresa</Text>
                            <View style={styles.pickerContainer}>
                                <Text style={styles.pickerText}>{empresa}</Text>
                            </View>
                        </View>

                        <FilterButton label="Marca" value={marca} onPress={() => openFilterModal("marca")} />
                        <FilterButton label="Familia" value={familia} onPress={() => openFilterModal("familia")} />
                        <FilterButton label="Cliente" value={cliente} onPress={() => openFilterModal("cliente")} />

                        <View style={styles.filterContainerFull}>
                            <FilterButton label="Producto" value={producto} onPress={() => openFilterModal("producto")} />
                        </View>
                    </View>
                </View>

                {/* Modal para filtros */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Seleccionar {currentFilter}</Text>
                                <TouchableOpacity onPress={() => setModalVisible(false)}>
                                    <Ionicons name="close" size={24} color="#6b7280" />
                                </TouchableOpacity>
                            </View>

                            <TextInput
                                style={styles.searchInput}
                                placeholder={`Buscar ${currentFilter}...`}
                                value={searchText}
                                onChangeText={setSearchText}
                            />

                            <FlatList
                                data={getFilteredOptions()}
                                keyExtractor={(item) => item}
                                renderItem={({ item }) => (
                                    <TouchableOpacity style={styles.optionItem} onPress={() => selectFilterOption(item)}>
                                        <Text style={styles.optionText}>{item}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    </View>
                </Modal>


            </ScrollView>
        </SafeAreaView>
    );
}

export default Sales;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.containerColor,
    },
    header: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "E5E7EB",
        backgroundColor: "ffffff",
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "111827"
    },
    scrollView: {
        flex: 1,
        padding: 16,
    },
    card: {
        backgroundColor: "ffffff",
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#111827",
        marginBottom: 16,
    },
    filtersGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    filterContainer: {
        width: "48%",
        marginBottom: 12,
    },
    filterContainerFull: {
        width: "100%",
        marginBottom: 12,
    },
    filterLabel: {
        fontSize: 12,
        fontWeight: "500",
        color: "#374151",
        marginBottom: 4,
    },
    filterButton: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "D1D5DB",
        borderRadius: 6,
        padding: 12,
        backgroundColor: "#ffffff",
    },
    filterButtonText: {
        fontSize: 14,
        color: "#374151",
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: "D1D5DB",
        borderRadius: 6,
        padding: 12,
        backgroundColor: "F9FAFB",
    },
    pickerText: {
        fontSize: 14,
        color: "#374151"
    },
    summaryGrid: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 16,
    },
    summaryCard: {
        flex: 1,
        backgroundColor: "#F9FAFB",
        borderRadius: 6,
        padding: 16,
        marginHorizontal: 4,
    },
    summaryLabel: {
        fontSize: 12,
        color: "#6B7280",
        marginBottom: 4,
    },
    summaryValue: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#111827",
        marginBottom: 4,
    },
    summaruSubText: {
        fontSize: 10,
        color: "#6B7280",
    }
});