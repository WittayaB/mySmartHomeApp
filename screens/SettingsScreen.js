import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
} from "react-native";
import { setSensorThreshold } from "../firebaseConfig";
import firebase from "firebase/compat/app";
import "firebase/compat/database";

export default function SettingScreen() {
  const [humidityLimit, setHumidityLimit] = useState("70");
  const [temperatureLimit, setTemperatureLimit] = useState("35");
  const [lightLimit, setLightLimit] = useState("1500");

  const saveSettings = () => {
    setSensorThreshold("humidity", Number(humidityLimit));
    setSensorThreshold("temperature", Number(temperatureLimit));
    setSensorThreshold("light", Number(lightLimit));
    Alert.alert("✅ บันทึกสำเร็จ", "ค่าการตั้งค่าถูกบันทึกเรียบร้อย");
  };

  const resetSystem = async () => {
  const defaultValues = {
    humidity_limit: 70,
    temperature_limit: 35,
    light_limit: 1500,
  };

  await firebase.database().ref("/settings").set(defaultValues);

  // 👇 เพิ่ม 3 บรรทัดนี้เพื่ออัปเดตค่าบนหน้าจอทันที
  setHumidityLimit(String(defaultValues.humidity_limit));
  setTemperatureLimit(String(defaultValues.temperature_limit));
  setLightLimit(String(defaultValues.light_limit));

  Alert.alert("♻️ รีเซ็ตสำเร็จ", "ค่ากลับสู่ค่าเริ่มต้นแล้ว");
};

  return (
      
    
    <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.headerHome}>
      <Text style={styles.mainHeader}>🏠 Smart Home System</Text>
    </View>

      <View style={styles.card}>
        <Text style={styles.title}>⚙️ ตั้งค่าเซนเซอร์</Text>

        {[
          {
            label: "💧 ความชื้นสูงสุด (%)",
            value: humidityLimit,
            setter: setHumidityLimit,
          },
          {
            label: "🌡️ อุณหภูมิสูงสุด (°C)",
            value: temperatureLimit,
            setter: setTemperatureLimit,
          },
          {
            label: "💡 ความสว่างต่ำสุด",
            value: lightLimit,
            setter: setLightLimit,
          },
        ].map((item, i) => (
          <View key={i} style={styles.inputGroup}>
            <Text style={styles.label}>{item.label}</Text>
            <TextInput
              keyboardType="numeric"
              value={item.value}
              onChangeText={item.setter}
              style={styles.input}
            />
          </View>
        ))}

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#00C896" }]}
          onPress={saveSettings}
        >
          <Text style={styles.buttonText}>💾 บันทึกค่า</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#7AD1B9" }]}
          onPress={resetSystem}
        >
          <Text style={styles.buttonText}>♻️ รีเซ็ตระบบ</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#EEF5F5",
  },

  /* ===== CARD ===== */
  card: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 25,
    padding: 25,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 6,
  },

  /* ===== TITLE ===== */
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1E7C74",
    textAlign: "center",
    marginBottom: 25,
    letterSpacing: 1,
  },

  /* ===== INPUT GROUP ===== */
  inputGroup: {
    marginBottom: 20,
  },

  label: {
    color: "#2E3A3A",
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 8,
  },

  input: {
    borderWidth: 1.5,
    borderColor: "#D4E4E4",
    borderRadius: 14,
    padding: 14,
    fontSize: 16,
    color: "#1E7C74",
    backgroundColor: "#F4FAFA",
  },

  /* ===== BUTTON ===== */
  button: {
    marginTop: 20,
    paddingVertical: 15,
    borderRadius: 18,
    alignItems: "center",
    backgroundColor: "#1E7C74",
    shadowColor: "#1E7C74",
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 6,
  },

  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },

  /* ===== HEADER (Smart Home System ด้านบน) ===== */
  headerHome: {
    width: "100%",
    paddingVertical: 25,
    alignItems: "center",
    marginBottom: 10,
  },

  mainHeader: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1E7C74",
    letterSpacing: 1,
  },
});
