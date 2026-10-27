import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  onAdd: (category: { name: string; amount: number; color: string; icon: string }) => void;
};

const SUGGESTED_ICONS = ["🏷️", "🐾", "💊", "👕", "📱", "📚", "☕", "🍕", "🍦", "🧸", "🏋️", "🚗", "🎁", "💡", "🌿"];
const PALETTE = ["#FF6B00", "#00B8D9", "#10B981", "#8B5CF6", "#EC4899", "#F59E0B", "#EF4444", "#3B82F6"];

const guessIcon = (text: string): string => {
  const n = text.trim().toLowerCase();
  if (/(pet|dog|cat|animal)/i.test(n)) return '🐾';
  if (/(pill|med|medicine|health|pharmacy|drug|care)/i.test(n)) return '💊';
  if (/(cloth|shirt|pant|shoe|wear|fashion|dress)/i.test(n)) return '👕';
  if (/(electronic|gadget|phone|tech|computer|laptop)/i.test(n)) return '📱';
  if (/(book|study|read|education|stationery)/i.test(n)) return '📚';
  if (/(coffee|cafe|tea|starbucks)/i.test(n)) return '☕';
  if (/(fast\s*food|burger|pizza|restaurant)/i.test(n)) return '🍕';
  if (/(sweet|ice\s*cream|dessert|cake)/i.test(n)) return '🍦';
  if (/(baby|kids|toy|infant)/i.test(n)) return '🧸';
  if (/(gym|sport|fit|fitness|workout)/i.test(n)) return '🏋️';
  if (/(car|fuel|gas|auto|vehicle|travel)/i.test(n)) return '🚗';
  if (/(gift|party|celebrate)/i.test(n)) return '🎁';
  return '🏷️';
};

export default function AddExpenseModal({ visible, onClose, onAdd }: Props) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("🏷️");
  const [selectedColor, setSelectedColor] = useState(PALETTE[0]);

  const handleNameChange = (val: string) => {
    setName(val);
    const guessed = guessIcon(val);
    if (guessed !== '🏷️' || selectedIcon === '🏷️') {
      setSelectedIcon(guessed);
    }
  };

  const handleAdd = () => {
    const cleanName = name.trim();
    if (!cleanName) return;

    onAdd({
      name: cleanName,
      amount: parseFloat(amount) || 0,
      color: selectedColor,
      icon: selectedIcon,
    });

    setName("");
    setAmount("");
    setSelectedIcon("🏷️");
    setSelectedColor(PALETTE[0]);
    onClose();
  };

  const handleClose = () => {
    setName("");
    setAmount("");
    setSelectedIcon("🏷️");
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          <Text style={styles.title}>Add New Category</Text>
          <Text style={styles.subtitle}>
            This category will appear in Budget & the Add Item page.
          </Text>

          {/* Name Input */}
          <Text style={styles.fieldLabel}>CATEGORY NAME</Text>
          <TextInput
            placeholder="e.g. Pharmacy, Pets, Electronics"
            placeholderTextColor="#9CA3AF"
            value={name}
            onChangeText={handleNameChange}
            style={styles.input}
          />

          {/* Budget / Extra Amount Input */}
          <Text style={styles.fieldLabel}>INITIAL AMOUNT (OPTIONAL)</Text>
          <TextInput
            placeholder="0"
            placeholderTextColor="#9CA3AF"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            style={styles.input}
          />

          {/* Icon Picker */}
          <Text style={styles.fieldLabel}>SELECT ICON</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.iconScroll}
          >
            {SUGGESTED_ICONS.map((ic) => (
              <TouchableOpacity
                key={ic}
                style={[
                  styles.iconPill,
                  selectedIcon === ic && styles.iconPillActive,
                ]}
                onPress={() => setSelectedIcon(ic)}
              >
                <Text style={styles.iconEmoji}>{ic}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Color Palette */}
          <Text style={styles.fieldLabel}>COLOR</Text>
          <View style={styles.colorRow}>
            {PALETTE.map((c) => (
              <TouchableOpacity
                key={c}
                style={[
                  styles.colorDot,
                  { backgroundColor: c },
                  selectedColor === c && styles.colorDotActive,
                ]}
                onPress={() => setSelectedColor(c)}
              />
            ))}
          </View>

          {/* Action Buttons */}
          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.addButton,
                !name.trim() && { opacity: 0.5 },
              ]}
              onPress={handleAdd}
              disabled={!name.trim()}
            >
              <Text style={styles.addText}>Add Category</Text>
            </TouchableOpacity>
          </View>
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
    padding: 20,
  },
  modalBox: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: "white",
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 16,
    lineHeight: 18,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#6B7280",
    letterSpacing: 0.8,
    marginBottom: 6,
    marginTop: 4,
  },
  input: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#111827",
    marginBottom: 12,
  },
  iconScroll: {
    flexDirection: "row",
    gap: 8,
    paddingBottom: 14,
  },
  iconPill: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  iconPillActive: {
    backgroundColor: "#FFF0E6",
    borderColor: "#FF6B00",
  },
  iconEmoji: {
    fontSize: 20,
  },
  colorRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    marginTop: 2,
  },
  colorDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "transparent",
  },
  colorDotActive: {
    borderColor: "#111827",
    transform: [{ scale: 1.15 }],
  },
  btnRow: {
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#4B5563",
  },
  addButton: {
    flex: 1.4,
    backgroundColor: "#FF6B00",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#FF6B00",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  addText: {
    color: "white",
    fontSize: 15,
    fontWeight: "800",
  },
});
