// firebaseConfig.js
import firebase from "firebase/compat/app";
import "firebase/compat/database";

const firebaseConfig = {
  apiKey: "AIzaSyB_XCMfl6i4ZBDB_qHy98UqyiElofekbpI",
  authDomain: "smarthomevoice-d4b3e.firebaseapp.com",
  databaseURL:
    "https://smarthomevoice-d4b3e-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "smarthomevoice-d4b3e",
  storageBucket: "smarthomevoice-d4b3e.appspot.com",
  messagingSenderId: "358088494229",
  appId: "1:358088494229:web:5862ed544917b3e30e1f9c",
  measurementId: "G-S17JFK0Z89",
};

// ✅ ป้องกันไม่ให้ initialize ซ้ำ
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.database();

/* =============================
   ฟังก์ชันส่งคำสั่งควบคุมอุปกรณ์
============================= */
export const sendCommand = async (device, value) => {
  try {
    await db.ref(`/command/${device}`).set(value);
    console.log(`✅ ส่งคำสั่ง ${device}: ${value}`);
  } catch (error) {
    console.error("❌ Firebase Error (sendCommand):", error);
  }
};

/* =============================
   ฟังก์ชันตั้งค่าเซนเซอร์
============================= */
export const setSensorThreshold = async (type, value) => {
  try {
    await db.ref(`/settings/${type}_limit`).set(value);
    console.log(`✅ ตั้งค่า ${type} = ${value}`);
  } catch (error) {
    console.error("❌ Firebase Error (setSensorThreshold):", error);
  }
};

/* =============================
   ฟังก์ชันบันทึกแจ้งเตือน
============================= */
export const logNotification = async (message, type = "info") => {
  try {
    const now = new Date();
    const date = now.toLocaleDateString("th-TH");
    const time = now.toLocaleTimeString("th-TH");

    const newNotification = {
      message,
      type,
      date,
      time,
      timestamp: now.getTime(),
    };

    // ใช้ push เพื่อสร้าง key อัตโนมัติ
    await db.ref("/notifications").push(newNotification);

    console.log("✅ บันทึกแจ้งเตือนสำเร็จ:", newNotification);
  } catch (error) {
    console.error("❌ ไม่สามารถบันทึกแจ้งเตือนได้:", error);
  }
};

/* =============================
   ฟังก์ชันลบแจ้งเตือน (เพิ่มใหม่)
============================= */
export const deleteNotification = async (id) => {
  try {
    await db.ref(`/notifications/${id}`).remove();
    console.log(`🗑️ ลบแจ้งเตือนสำเร็จ ID: ${id}`);
  } catch (error) {
    console.error("❌ ลบแจ้งเตือนล้มเหลว:", error);
  }
};

export default db;
