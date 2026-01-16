#!/usr/bin/env python3
"""
Seed script to populate the database with initial data.
Run: python scripts/seed_data.py
"""
import asyncio
import sys
from datetime import datetime

# Add parent directory to path
sys.path.insert(0, '.')

from app.database import connect_to_mongo, close_mongo_connection, get_collection

async def seed_database():
    """Seed the database with initial data"""
    await connect_to_mongo()
    
    # Get collections
    kits_collection = get_collection("kits")
    orders_collection = get_collection("orders")
    
    # Clear existing data
    await kits_collection.delete_many({})
    await orders_collection.delete_many({})
    
    # Seed kits
    starter_kits = [
        {
            "name": "ESP32 Beginner Kit",
            "description": "Complete starter kit for ESP32 development. Perfect for IoT projects.",
            "price": 49.99,
            "image_url": "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400",
            "category": "IoT",
            "components": [
                {"name": "ESP32 Development Board", "quantity": 1, "description": "Wi-Fi & Bluetooth enabled"},
                {"name": "Breadboard", "quantity": 1, "description": "400-point breadboard"},
                {"name": "Jumper Wires", "quantity": 30, "description": "Male-to-male, male-to-female, female-to-female"},
                {"name": "LEDs (5mm)", "quantity": 10, "description": "Red, Green, Blue, Yellow"},
                {"name": "Resistors (220Ω)", "quantity": 20, "description": "1/4W carbon film resistors"},
                {"name": "Push Buttons", "quantity": 5, "description": "Tactile switches"},
                {"name": "Potentiometer", "quantity": 2, "description": "10K linear potentiometer"},
                {"name": "DHT11 Sensor", "quantity": 1, "description": "Temperature & Humidity sensor"},
                {"name": "Photoresistor", "quantity": 2, "description": "Light dependent resistor"},
                {"name": "Buzzer", "quantity": 1, "description": "Active buzzer"}
            ],
            "stock_quantity": 100,
            "is_active": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "name": "Arduino Starter Pack",
            "description": "Everything you need to start with Arduino. 30+ components included.",
            "price": 69.99,
            "image_url": "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400",
            "category": "Microcontrollers",
            "components": [
                {"name": "Arduino Uno R3", "quantity": 1, "description": "Original Arduino board"},
                {"name": "USB Cable", "quantity": 1, "description": "Type-A to Type-B"},
                {"name": "Breadboard", "quantity": 2, "description": "830-point solderless breadboard"},
                {"name": "LED Kit", "quantity": 1, "description": "Assorted colors and sizes"},
                {"name": "Resistor Kit", "quantity": 1, "description": "Values from 10Ω to 1MΩ"},
                {"name": "Capacitor Kit", "quantity": 1, "description": "Various values"},
                {"name": "Motor Driver", "quantity": 1, "description": "L298N dual H-bridge"},
                {"name": "Servo Motor", "quantity": 2, "description": "SG90 micro servo"},
                {"name": "LCD Display", "quantity": 1, "description": "16x2 character LCD"},
                {"name": "Ultrasonic Sensor", "quantity": 1, "description": "HC-SR04 distance sensor"}
            ],
            "stock_quantity": 75,
            "is_active": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "name": "Raspberry Pi 4 Kit",
            "description": "Complete Raspberry Pi 4 kit with all essential accessories.",
            "price": 129.99,
            "image_url": "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w-400",
            "category": "SBC",
            "components": [
                {"name": "Raspberry Pi 4 Model B", "quantity": 1, "description": "4GB RAM version"},
                {"name": "Official Case", "quantity": 1, "description": "White/red official case"},
                {"name": "32GB MicroSD Card", "quantity": 1, "description": "Class 10 with adapter"},
                {"name": "Power Supply", "quantity": 1, "description": "5.1V/3A USB-C power supply"},
                {"name": "HDMI Cable", "quantity": 1, "description": "Micro HDMI to HDMI"},
                {"name": "Heat Sinks", "quantity": 1, "description": "Set of 3 aluminum heat sinks"},
                {"name": "GPIO Extension", "quantity": 1, "description": "40-pin GPIO ribbon cable"},
                {"name": "Breadboard", "quantity": 1, "description": "400-point with GPIO adapter"}
            ],
            "stock_quantity": 50,
            "is_active": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "name": "Sensor Master Collection",
            "description": "Collection of 15 different sensors for various applications.",
            "price": 89.99,
            "image_url": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
            "category": "Sensors",
            "components": [
                {"name": "Temperature & Humidity", "quantity": 1, "description": "DHT22 high precision"},
                {"name": "Motion Sensor", "quantity": 2, "description": "PIR HC-SR501"},
                {"name": "Gas Sensor", "quantity": 1, "description": "MQ-2 smoke/LPG/CO"},
                {"name": "Soil Moisture", "quantity": 2, "description": "Capacitive soil sensor"},
                {"name": "Water Level", "quantity": 1, "description": "Ultrasonic water level"},
                {"name": "Color Sensor", "quantity": 1, "description": "TCS34725 RGB"},
                {"name": "Gesture Sensor", "quantity": 1, "description": "APDS-9960"},
                {"name": "Heart Rate Sensor", "quantity": 1, "description": "Pulse sensor"},
                {"name": "GPS Module", "quantity": 1, "description": "NEO-6M with antenna"},
                {"name": "RFID Kit", "quantity": 1, "description": "RC522 with cards/keyfobs"}
            ],
            "stock_quantity": 30,
            "is_active": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "name": "Soldering Station Bundle",
            "description": "Professional soldering equipment for electronics projects.",
            "price": 149.99,
            "image_url": "https://images.unsplash.com/photo-1586816871360-818c6d8b4c1f?w=400",
            "category": "Tools",
            "components": [
                {"name": "Digital Soldering Station", "quantity": 1, "description": "60W adjustable temperature"},
                {"name": "Soldering Iron Stand", "quantity": 1, "description": "With sponge and brass wool"},
                {"name": "Solder Wire", "quantity": 1, "description": "100g 60/40 rosin core"},
                {"name": "Desoldering Pump", "quantity": 1, "description": "Spring loaded desoldering tool"},
                {"name": "Helping Hands", "quantity": 1, "description": "With magnifying glass"},
                {"name": "Wire Stripper", "quantity": 1, "description": "Automatic wire stripper"},
                {"name": "Tweezers Set", "quantity": 1, "description": "Anti-static precision tweezers"},
                {"name": "Multimeter", "quantity": 1, "description": "Digital auto-ranging multimeter"}
            ],
            "stock_quantity": 25,
            "is_active": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
    ]
    
    # Insert kits
    result = await kits_collection.insert_many(starter_kits)
    print(f"✓ Inserted {len(result.inserted_ids)} kits")
    
    # Seed sample orders
    sample_orders = [
        {
            "customer_name": "John Doe",
            "customer_email": "john.doe@example.com",
            "phone": "+1-555-123-4567",
            "address": "123 Main St, Anytown, USA",
            "kit_id": str(result.inserted_ids[0]),
            "quantity": 2,
            "total_price": 99.98,
            "status": "delivered",
            "notes": "Please leave at front door",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "customer_name": "Jane Smith",
            "customer_email": "jane.smith@example.com",
            "phone": "+1-555-987-6543",
            "address": "456 Oak Ave, Somewhere, USA",
            "kit_id": str(result.inserted_ids[1]),
            "quantity": 1,
            "total_price": 69.99,
            "status": "processing",
            "notes": "Gift wrap requested",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "customer_name": "Bob Wilson",
            "customer_email": "bob.wilson@example.com",
            "phone": "+1-555-456-7890",
            "address": "789 Pine Rd, Nowhere, USA",
            "kit_id": str(result.inserted_ids[2]),
            "quantity": 3,
            "total_price": 389.97,
            "status": "pending",
            "notes": "Bulk order for workshop",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
    ]
    
    # Insert orders
    order_result = await orders_collection.insert_many(sample_orders)
    print(f"✓ Inserted {len(order_result.inserted_ids)} orders")
    
    # Close connection
    await close_mongo_connection()
    
    print("✅ Database seeding completed successfully!")
    print("\nSample data includes:")
    print("  - 5 different electronics kits")
    print("  - 3 sample orders")
    print("\nYou can now run the application with:")
    print("  uvicorn app.main:app --reload")

if __name__ == "__main__":
    asyncio.run(seed_database())