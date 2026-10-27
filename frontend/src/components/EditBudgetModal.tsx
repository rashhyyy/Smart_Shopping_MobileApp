import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { Picker } from "@react-native-picker/picker"; // Make sure this is installed
import { useEffect, useState } from "react";

import { useUser } from "../context/UserContext";

type Props = {
  visible: boolean;
  onClose: () => void;
  currentBudget: number;
  onSave: (newBudget: number) => void;
  currency?: string;
  setCurrency?: (currency: string) => void;
};

export default function EditBudgetModal({
  visible,
  onClose,
  currentBudget,
  onSave,
  currency,
  setCurrency,
}: Props) {
  const { currency: globalCurrency, setCurrency: setGlobalCurrency } = useUser();
  const [budget, setBudget] = useState(currentBudget > 0 ? currentBudget.toString() : "");

  useEffect(() => {
    setBudget(currentBudget > 0 ? currentBudget.toString() : "");
  }, [currentBudget]);

  const currencies = [
    { code: "USD", symbol: "$", name: "United States Dollar" },
    { code: "EUR", symbol: "€", name: "Euro" },
    { code: "GBP", symbol: "£", name: "British Pound" },
    { code: "INR", symbol: "₹", name: "Indian Rupee" },
    { code: "LKR", symbol: "Rs", name: "Sri Lankan Rupee" },
    { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
    { code: "AUD", symbol: "A$", name: "Australian Dollar" },
    { code: "JPY", symbol: "¥", name: "Japanese Yen" },
    { code: "SGD", symbol: "S$", name: "Singapore Dollar" },
    { code: "AED", symbol: "د.إ", name: "United Arab Emirates Dirham" },
  ];

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          <Text style={styles.title}>Edit Budget</Text>

          <TextInput
            value={budget}
            onChangeText={setBudget}
            keyboardType="numeric"
            style={styles.input}
            placeholder="Enter monthly budget"
          />

          <Text style={styles.label}>Select Currency</Text>

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={globalCurrency?.code || "USD"}
              onValueChange={(itemValue: string) => {
                const match = currencies.find((c) => c.code === itemValue);
                if (match) {
                  setGlobalCurrency({
                    code: match.code,
                    symbol: match.symbol,
                    name: match.name,
                    flag: '',
                  });
                  if (setCurrency) setCurrency(match.symbol);
                }
              }}
              style={styles.picker}
              dropdownIconColor="#FF6B00"
            >
              {currencies.map((item) => (
                <Picker.Item
                  key={item.code}
                  label={`${item.code}  (${item.symbol}) - ${item.name}`}
                  value={item.code}
                />
              ))}
            </Picker>
          </View>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => {
              onSave(Number(budget) || 0);
              onClose();
            }}
          >
            <Text style={styles.saveText}>Save Changes</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "88%",
    backgroundColor: "white",
    borderRadius: 28,
    padding: 25,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#F5F5F5",
    borderRadius: 18,
    padding: 16,
    fontSize: 18,
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  pickerContainer: {
    backgroundColor: "#F5F5F5",
    borderRadius: 18,
    marginBottom: 25,
    overflow: "hidden",
  },
  picker: {
    height: 58,
  },
  saveButton: {
    backgroundColor: "#FF6B00",
    padding: 16,
    borderRadius: 18,
    alignItems: "center",
  },
  saveText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    marginTop: 15,
    alignItems: "center",
  },
  cancelText: {
    color: "gray",
    fontSize: 16,
  },
});
