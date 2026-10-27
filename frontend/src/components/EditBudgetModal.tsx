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

type Props = {
  visible: boolean;
  onClose: () => void;
  currentBudget: number;
  onSave: (newBudget: number) => void;
  currency: string;
  setCurrency: (currency: string) => void;
};

export default function EditBudgetModal({
  visible,
  onClose,
  currentBudget,
  onSave,
  currency,
  setCurrency,
}: Props) {
  const [budget, setBudget] = useState(currentBudget.toString());

  useEffect(() => {
    setBudget(currentBudget.toString());
  }, [currentBudget]);

  const currencies = [
    { code: "INR", symbol: "₹" },
    { code: "USD", symbol: "$" },
    { code: "EUR", symbol: "€" },
    { code: "GBP", symbol: "£" },
    { code: "LKR", symbol: "Rs" },
    { code: "JPY", symbol: "¥" },
    { code: "AUD", symbol: "A$" },
    { code: "CAD", symbol: "C$" },
    { code: "SGD", symbol: "S$" },
    { code: "AED", symbol: "د.إ" },
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
              selectedValue={currency}
              onValueChange={(itemValue: string) => setCurrency(itemValue)}
              style={styles.picker}
              dropdownIconColor="#FF6B00"
            >
              {currencies.map((item) => (
                <Picker.Item
                  key={item.code}
                  label={`${item.code}  (${item.symbol})`}
                  value={item.symbol}
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
