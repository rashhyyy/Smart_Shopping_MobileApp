import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useState } from "react";

type Props = {
  visible: boolean;
  onClose: () => void;

  onAdd: (category: { name: string; amount: number; color: string }) => void;
};

export default function AddExpenseModal({ visible, onClose, onAdd }: Props) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  const colors = ["#FF6B00", "#7ED321", "#00B8D9", "#FF3B6B", "#E6B800"];

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          <Text style={styles.title}>Add Category</Text>

          <TextInput
            placeholder="Category Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />

          <TextInput
            placeholder="Amount"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            style={styles.input}
          />

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              const randomColor =
                colors[Math.floor(Math.random() * colors.length)];

              onAdd({
                name,
                amount: Number(amount),
                color: randomColor,
              });

              setName("");
              setAmount("");

              onClose();
            }}
          >
            <Text style={styles.addText}>Add Category</Text>
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
    fontSize: 16,
    marginBottom: 15,
  },

  addButton: {
    backgroundColor: "#FF6B00",
    padding: 16,
    borderRadius: 18,
    alignItems: "center",
  },

  addText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
