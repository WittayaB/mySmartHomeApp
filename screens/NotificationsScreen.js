import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import firebase from "firebase/compat/app";
import "firebase/compat/database";

export default function NotificationScreen() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const notifRef = firebase.database().ref("/notifications");

    notifRef.on("value", (snapshot) => {
      const data = snapshot.val() || {};
      const list = Object.entries(data)
        .map(([key, value]) => ({
          key,
          ...value,
          timestamp: value.timestamp || "",
        }))
        .sort((a, b) => b.timestamp - a.timestamp);
      setNotifications(list);
    });

    return () => notifRef.off();
  }, []);

  const deleteNotification = (key) => {
    Alert.alert("🗑️ ลบการแจ้งเตือน", "คุณแน่ใจหรือไม่ว่าจะลบรายการนี้?", [
      { text: "ยกเลิก" },
      {
        text: "ลบ",
        onPress: () => firebase.database().ref(`/notifications/${key}`).remove(),
      },
    ]);
  };

  const clearAllNotifications = () => {
    Alert.alert("⚠️ ลบทั้งหมด", "คุณต้องการลบการแจ้งเตือนทั้งหมดหรือไม่?", [
      { text: "ยกเลิก" },
      {
        text: "ลบทั้งหมด",
        onPress: () => firebase.database().ref("/notifications").remove(),
      },
    ]);
  };

  return (
    
    <View style={styles.container}>

      <View style={styles.header}>
      <Text style={styles.mainHeader}>🏠 Smart Home System</Text>
    </View>
      <Text style={styles.title}>🔔 ประวัติการแจ้งเตือน</Text>

      {notifications.length === 0 ? (
        <Text style={styles.noNotif}>ไม่มีการแจ้งเตือน</Text>
      ) : (
        <>
          <TouchableOpacity
            style={styles.clearButton}
            onPress={clearAllNotifications}
          >
            <Text style={styles.clearButtonText}>🧹 ลบทั้งหมด</Text>
          </TouchableOpacity>

          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {notifications.map((item, index) => (
              <View key={index} style={styles.card}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.message}>{item.message}</Text>
                  <Text style={styles.timestamp}>
                    📅 {item.date || "-"} 🕒 {item.time || "-"}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deleteNotification(item.key)}
                >
                  <Text style={styles.deleteButtonText}>ลบ</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </>
      )}
    </View>
  );
}

// ===== Styles =====
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEF5F5",
  },

  /* ===== HEADER ===== */
  header: {
    width: "100%",
    paddingTop: 50,
    paddingBottom: 25,
    backgroundColor: "#1E7C74",
    alignItems: "center",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 6,
  },

  mainHeader: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#ffffff",
    letterSpacing: 1,
  },

  /* ===== TITLE ===== */
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2E3A3A",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 15,
  },

  noNotif: {
    color: "#6C7A7A",
    fontSize: 16,
    marginTop: 40,
    textAlign: "center",
  },

  /* ===== CLEAR BUTTON ===== */
  clearButton: {
    backgroundColor: "#ff6b6b",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
    alignSelf: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 4,
  },

  clearButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },

  scrollContainer: {
    width: "100%",
    paddingHorizontal: 20,
    paddingBottom: 30,
  },

  /* ===== CARD ===== */
  card: {
    width: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 18,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 4,
  },

  message: {
    fontSize: 16,
    color: "#2E3A3A",
    fontWeight: "600",
  },

  timestamp: {
    fontSize: 13,
    color: "#7A8C8C",
    marginTop: 6,
  },

  deleteButton: {
    backgroundColor: "#e74c3c",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: "flex-end",
    marginTop: 12,
  },

  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
  },
});

