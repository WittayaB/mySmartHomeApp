import React, { useState, useEffect } from "react";
import { View, Text, Switch, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import firebase from "firebase/compat/app";
import "firebase/compat/database";

export default function HomeScreen() {
  const [sensors, setSensors] = useState({});
  const [switchStates, setSwitchStates] = useState({
    system: false,
    rgbRed: false,
    rgbGreen: false,
    rgbBlue: false,
  });

  useEffect(() => {
    const db = firebase.database().ref("/");
    db.on("value", (snapshot) => {
      const data = snapshot.val() || {};
      setSensors(data.sensors || {});
      setSwitchStates((prev) => ({
        ...prev,
        system: data.systemOn || false,
        rgbRed: data.rgb?.red || false,
        rgbGreen: data.rgb?.green || false,
        rgbBlue: data.rgb?.blue || false,
      }));
    });
    return () => db.off();
  }, []);

  const toggleSwitch = async (device, value) => {
    setSwitchStates((prev) => ({ ...prev, [device]: value }));
    const pathMap = {
      system: "/systemOn",
      rgbRed: "/rgb/red",
      rgbGreen: "/rgb/green",
      rgbBlue: "/rgb/blue",
    };
    if (pathMap[device]) await firebase.database().ref(pathMap[device]).set(value);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.headerHome}>
            <Text style={styles.mainHeader}>🏠 Smart Home System</Text>
          </View>

  {/* Living Room */}
<View style={styles.section}>
  <Text style={styles.sectionTitle}>RGB Status</Text>
  <View style={styles.row}>
    {/* 🔴 Red Light */}
    <View style={styles.circleCard}>
      <Text style={[styles.circleTitle, { color: "#FF4C4C" }]}>🔴</Text>
      <Text style={styles.circleText}>
        {switchStates.rgbRed ? "ON" : "OFF"}
      </Text>
    </View>

    {/* 🟢 Green Light */}
    <View style={styles.circleCard}>
      <Text style={[styles.circleTitle, { color: "#00FF7F" }]}>🟢</Text>
      <Text style={styles.circleText}>
        {switchStates.rgbGreen ? "ON" : "OFF"}
      </Text>
    </View>

    {/* 🔵 Blue Light */}
    <View style={styles.circleCard}>
      <Text style={[styles.circleTitle, { color: "#4DB8FF" }]}>🔵</Text>
      <Text style={styles.circleText}>
        {switchStates.rgbBlue ? "ON" : "OFF"}
      </Text>
    </View>
  </View>
</View>


      {/* Sensors / Security */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sensors</Text>
        <View style={styles.grid}>
          <View style={styles.gridCard}>
            <Text style={styles.sensorValue}>{sensors.temperature ?? 0}°C</Text>
            <Text style={styles.sensorLabel}>Temperature</Text>
          </View>
          <View style={styles.gridCard}>
            <Text style={styles.sensorValue}>{sensors.humidity ?? 0}%</Text>
            <Text style={styles.sensorLabel}>Humidity</Text>
          </View>
          <View style={styles.gridCard}>
            <Text style={styles.sensorValue}>{sensors.light ?? 0}</Text>
            <Text style={styles.sensorLabel}>Light</Text>
          </View>
          <View style={styles.gridCard}>
            <Text style={styles.sensorValue}>
              {sensors.motion === 1 ? "Active" : "None"}
            </Text>
            <Text style={styles.sensorLabel}>Motion</Text>
          </View>
        </View>
      </View>

      {/* RGB Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>RGB Lights</Text>
        {[
          { key: "rgbRed", label: "Red Light 🔴" },
          { key: "rgbGreen", label: "Green Light 🟢" },
          { key: "rgbBlue", label: "Blue Light 🔵" },
        ].map((item, i) => (
          <View key={i} style={styles.switchRow}>
            <Text style={styles.switchLabel}>{item.label}</Text>
            <Switch
              value={switchStates[item.key]}
              onValueChange={(val) => toggleSwitch(item.key, val)}
              thumbColor={switchStates[item.key] ? "#4CD964" : "#888"}
            />
          </View>
        ))}
      </View>

      {/* Main System */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Main System</Text>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>System Power</Text>
          <Switch
            value={switchStates.system}
            onValueChange={(val) => toggleSwitch("system", val)}
            thumbColor={switchStates.system ? "#00C896" : "#888"}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FAFA", // สีพื้นหลังอ่อน
    paddingHorizontal: 20,
  },
  header: {
    paddingVertical: 25,
    borderBottomWidth: 1,
    borderBottomColor: "#DCE8E8",
  },
  title: {
    color: "#2E3A3A", // สีเขียวเทาเข้ม
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
  },
  section: {
    marginBottom: 25,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#E3E7E7",
  },
  sectionTitle: {
    color: "#374B4A",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  circleCard: {
    width: 90,
    height: 90,
    borderRadius: 50,
    backgroundColor: "#E8F4F3", // เขียวอ่อนจาง
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 3 },
    borderWidth: 1,
    borderColor: "#C7DFDE",
  },
  circleTitle: {
    fontSize: 22,
  },
  circleText: {
    color: "#344D4B",
    fontSize: 12,
    marginTop: 5,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gridCard: {
    width: "48%",
    backgroundColor: "#EAF5F4",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#D0E0E0",
  },
  sensorValue: {
    color: "#1E7C74", // เขียวเข้มสำหรับค่าเซนเซอร์
    fontSize: 22,
    fontWeight: "600",
  },
  sensorLabel: {
    color: "#344D4B",
    fontSize: 14,
    marginTop: 6,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 10,
    borderBottomWidth: 0.6,
    borderBottomColor: "#D0E0E0",
  },
  switchLabel: {
    color: "#344D4B",
    fontSize: 16,
  },

  
headerHome: {
  width: "100%",
  paddingVertical: 20,
  alignItems: "center",
  
},


mainHeader: {
  fontSize: 24,
  fontWeight: "bold",
  color: "#000000ff",
},


});
