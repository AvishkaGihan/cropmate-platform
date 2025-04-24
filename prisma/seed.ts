import { PrismaClient } from "../src/app/generated/prisma";

const prisma = new PrismaClient();

// Sample image URLs
const sampleImageUrls = [
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=800&q=60",
];

async function main() {
  // Create Users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: "alice@example.com",
        password: "password123",
        name: "Alice Smith",
        role: "CUSTOMER",
        address: "123 Main St, Springfield",
      },
    }),
    prisma.user.create({
      data: {
        email: "bob@example.com",
        password: "password123",
        name: "Bob Johnson",
        role: "FARMER",
        address: "456 Elm St, Shelbyville",
      },
    }),
    prisma.user.create({
      data: {
        email: "charlie@example.com",
        password: "password123",
        name: "Charlie Brown",
        role: "DRIVER",
        address: "789 Oak St, Capital City",
      },
    }),
  ]);

  // Add Bank Details for Farmers
  await prisma.bankDetails.create({
    data: {
      accountName: "Bob Johnson",
      accountNumber: "1234567890",
      bankName: "Springfield Bank",
      branch: "Main Branch",
      userId: users[1].id,
    },
  });

  // Create Crops (for Farmer Bob)
  const crops = await Promise.all([
    prisma.crop.create({
      data: {
        name: "Wheat",
        description: "High-quality wheat harvested in 2023.",
        category: "grains", // Enum value from CropCategory
        pricePerUnit: 10.5,
        availableQuantity: 100,
        unit: "kg",
        harvestDate: new Date("2023-08-01"),
        location: "Springfield Farms",
        imageUrl: sampleImageUrls[0],
        farmerId: users[1].id,
      },
    }),
    prisma.crop.create({
      data: {
        name: "Corn",
        description: "Organic corn ready for delivery.",
        category: "grains", // Enum value from CropCategory
        pricePerUnit: 8.75,
        availableQuantity: 200,
        unit: "kg",
        harvestDate: new Date("2023-09-15"),
        location: "Shelbyville Farms",
        imageUrl: sampleImageUrls[1],
        farmerId: users[1].id,
      },
    }),
  ]);

  // Create Orders (for Customer Alice)
  const orders = await Promise.all([
    prisma.order.create({
      data: {
        quantity: 50,
        totalPrice: 50 * crops[0].pricePerUnit,
        status: "PENDING_PAYMENT", // Enum value from OrderStatus
        deliveryAddress: "123 Main St, Springfield",
        buyerId: users[0].id,
        cropId: crops[0].id,
      },
    }),
    prisma.order.create({
      data: {
        quantity: 100,
        totalPrice: 100 * crops[1].pricePerUnit,
        status: "PAYMENT_RECEIVED", // Enum value from OrderStatus
        deliveryAddress: "123 Main St, Springfield",
        paymentProof: "https://example.com/payment-proof.jpg",
        buyerId: users[0].id,
        cropId: crops[1].id,
      },
    }),
  ]);

  // Create Deliveries (for Driver Charlie)
  await prisma.delivery.create({
    data: {
      status: "ACCEPTED", // Enum value from DeliveryStatus
      pickupDate: new Date("2023-10-01T08:00:00Z"),
      deliveryDate: new Date("2023-10-01T12:00:00Z"),
      driverId: users[2].id,
      orderId: orders[1].id,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
