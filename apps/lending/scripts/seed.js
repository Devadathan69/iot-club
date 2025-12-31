import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, where, writeBatch } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDPW0X3GMkKaA7om89YQRxUbTPTRuKCZyU",
    authDomain: "iot-club-main.firebaseapp.com",
    projectId: "iot-club-main",
    storageBucket: "iot-club-main.firebasestorage.app",
    messagingSenderId: "7234199920",
    appId: "1:7234199920:web:d2496279504d544be1efb5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const devices = [
    {
        name: "Arduino Uno R3",
        model: "ATmega328P",
        description: "The classic Arduino board. Best for beginners.",
        category: "Microcontroller",
        total_stock: 10,
        available_stock: 10,
        image_url: "https://docs.arduino.cc/static/9d5a9df67d1620a214b73b22b13fc918/ABX00003_00.png"
    },
    {
        name: "Raspberry Pi 4 Model B",
        model: "4GB RAM",
        description: "A powerful single-board computer for advanced IoT projects.",
        category: "Microcontroller",
        total_stock: 5,
        available_stock: 5,
        image_url: "https://assets.raspberrypi.com/static/raspberry-pi-4-model-b-3d6291a92ce75f54807358705fcc5064.png"
    },
    {
        name: "Ultrasonic Sensor",
        model: "HC-SR04",
        description: "Distance measurement sensor using ultrasonic waves.",
        category: "Sensor",
        total_stock: 20,
        available_stock: 20,
        image_url: "https://m.media-amazon.com/images/I/41+McdC-cBL._AC_.jpg"
    },
    {
        name: "Servo Motor",
        model: "SG90 Micro",
        description: "Tiny and lightweight with high output power. Server can rotate approximately 180 degrees.",
        category: "Actuator",
        total_stock: 15,
        available_stock: 15,
        image_url: "https://m.media-amazon.com/images/I/5137-bYwMGL.jpg"
    },
    {
        name: "DHT11 Sensor",
        model: "DHT11",
        description: "Basic digital temperature and humidity sensor.",
        category: "Sensor",
        total_stock: 12,
        available_stock: 12,
        image_url: "https://m.media-amazon.com/images/I/518c7kS-4RL.jpg"
    }
];

async function seed() {
    console.log("Starting data seeding...");

    try {
        const devicesRef = collection(db, "devices");

        // Check if data already exists to avoid duplicates
        const snapshot = await getDocs(devicesRef);
        if (!snapshot.empty) {
            console.log(`Collection 'devices' already has ${snapshot.size} documents. Skipping seed.`);
            // Optional: Clear collection if you want to force re-seed (commented out for safety)
            // return;
        }

        const batch = writeBatch(db);

        for (const device of devices) {
            // Create a doc reference with auto-generated ID
            const newDocRef = await addDoc(collection(db, "devices"), device);
            console.log(`Added: ${device.name} with ID: ${newDocRef.id}`);
        }

        console.log("Seeding completed successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding data:", error);
        process.exit(1);
    }
}

seed();
