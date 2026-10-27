import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useEffect, useState } from "react";

type Props = {
  visible: boolean;
  onClose: () => void;
  categoryName: string;
  currentAmount: number;

  onSave: (newAmount: number) => void;

  onDelete: () => void;
};

export default function EditCategoryModal({
  visible,
  onClose,
  categoryName,
  currentAmount,
  onSave,
  onDelete,
}: Props) {
  const [amount, setAmount] = useState(currentAmount.toString());

  useEffect(() => {
    setAmount(currentAmount.toString());
  }, [currentAmount]);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          <Text style={styles.title}>Edit {categoryName}</Text>

          <TextInput
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            style={styles.input}
          />

          {/* Save */}
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => {
              onSave(Number(amount));
              onClose();
            }}
          >
            <Text style={styles.saveText}>Save Changes</Text>
          </TouchableOpacity>

          {/* Delete */}
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => {
              onDelete();
              onClose();
            }}
          >
            <Text style={styles.deleteText}>Delete Category</Text>
          </TouchableOpacity>

          {/* Cancel */}
          <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
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
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalBox: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 25,
    padding: 25,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },

  input: {
    backgroundColor: "#F5F5F5",
    borderRadius: 15,
    padding: 15,
    fontSize: 18,
    marginBottom: 20,
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

  deleteButton: {
    backgroundColor: "#FFE5E5",
    padding: 16,
    borderRadius: 18,
    alignItems: "center",
    marginTop: 12,
  },

  deleteText: {
    color: "red",
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
