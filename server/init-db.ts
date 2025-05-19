import { db } from "./db";
import { users, leaks, comments, LEAK_STATUS, LEAK_TYPE } from "../shared/schema";
import { storage } from "./storage";
import path from "path";
import fs from "fs";

/**
 * This file handles database initialization including:
 * - Creating the admin user
 * - Creating sample leak data for testing
 */

export async function initializeDatabase() {
  try {
    // Check if admin user exists
    const adminExists = await storage.getUserByUsername("admin");
    
    // Create admin user if it doesn't exist
    if (!adminExists) {
      const admin = await storage.createUser({
        username: "admin",
        password: "adminpass", // In production, use proper password hashing
        isAdmin: true
      });
      console.log("Admin user created successfully");
    }
    
    // Create sample leak data
    await createSampleData();

    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
}

async function createSampleData() {
  try {
    // Check if we already have leaks
    const existingLeaks = await storage.getLeaks();
    
    if (existingLeaks.length === 0) {
      console.log("Creating sample leak data...");
      
      // Create sample data
      await createSampleLeaks();
      
      console.log("Sample leak data created successfully");
    }
  } catch (error) {
    console.error("Error creating sample data:", error);
  }
}

async function createSampleLeaks() {
  // Create sample leak 1
  const leak1 = await storage.createLeak({
    title: "Fire Hydrant Leak",
    description: "Large leak from hydrant on Main St causing sidewalk flooding and potential road damage.",
    location: "1234 Main St, Central District",
    coordinates: { lat: 40.7128, lng: -74.0060 },
    status: LEAK_STATUS.IN_PROGRESS,
    leakType: LEAK_TYPE.FIRE_HYDRANT,
    severity: 4,
    images: [await ensureSampleImage("sample-hydrant.jpg")],
    isValidated: true
  });
  
  // Create sample leak 2
  const leak2 = await storage.createLeak({
    title: "Water Main Break",
    description: "Major water main break causing flooding on Oak Street. Water pressure issues reported in nearby buildings.",
    location: "567 Oak St, Westside",
    coordinates: { lat: 40.7328, lng: -74.0060 },
    status: LEAK_STATUS.PENDING,
    leakType: LEAK_TYPE.WATER_MAIN,
    severity: 5,
    images: [await ensureSampleImage("sample-water-main.jpg")],
    isValidated: true
  });
  
  // Create sample leak 3
  const leak3 = await storage.createLeak({
    title: "Underground Pipe Leak",
    description: "Water continuously seeping through sidewalk cracks, creating slippery conditions for pedestrians.",
    location: "789 Pine Ave, Eastside",
    coordinates: { lat: 40.7228, lng: -73.9860 },
    status: LEAK_STATUS.RESOLVED,
    leakType: LEAK_TYPE.PIPE,
    severity: 2,
    images: [await ensureSampleImage("sample-pipe.jpg")],
    isValidated: true
  });
  
  // Create sample leak 4
  const leak4 = await storage.createLeak({
    title: "Bridge Infrastructure Damage",
    description: "Significant structural damage and water seepage on the north side of Johnson Bridge. Poses safety hazard.",
    location: "Johnson Bridge, River District",
    coordinates: { lat: 40.7048, lng: -73.9860 },
    status: LEAK_STATUS.PENDING,
    leakType: LEAK_TYPE.INFRASTRUCTURE,
    severity: 4,
    images: [await ensureSampleImage("sample-bridge.jpg")],
    isValidated: false
  });
  
  // Add comments to leaks
  await storage.createComment({
    leakId: leak1.id,
    content: "Maintenance team has been dispatched and will arrive by 3pm today."
  });
  
  await storage.createComment({
    leakId: leak1.id,
    content: "This is the third time this hydrant has leaked this year. Please consider a full replacement."
  });
  
  await storage.createComment({
    leakId: leak2.id,
    content: "Emergency crew is on site. Expect water service disruption for next 4-6 hours."
  });
  
  await storage.createComment({
    leakId: leak3.id,
    content: "Repair completed on May 12. Area has been monitored for 48 hours with no further leaks detected."
  });
}

// Helper to ensure sample images exist in the uploads directory
async function ensureSampleImage(filename: string): Promise<string> {
  const uploadsDir = path.join(process.cwd(), 'uploads');
  const imagePath = path.join(uploadsDir, filename);
  
  // Create uploads directory if it doesn't exist
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log(`Uploads directory created at: ${uploadsDir}`);
  }
  
  // Check if the sample image already exists
  if (!fs.existsSync(imagePath)) {
    // Create a placeholder file since we don't have the actual image
    fs.writeFileSync(imagePath, 'Sample Image Placeholder');
    console.log(`Created placeholder for ${filename}`);
  } else {
    console.log(`Sample image ${filename} already exists`);
  }
  
  // Return the relative path for storage in the database
  return `/uploads/${filename}`;
}