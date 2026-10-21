/**
 * billingStorage.js
 * 
 * Centralized utility for managing customer bills and invoices in localStorage.
 * Ensures bills paid from the cart are saved, retrieved, and synced.
 */

export const CUSTOMER_BILLS_KEY = "tastepoint-customer-bills";
export const ADMIN_BILLING_KEY = "tastepoint-billing-data";
export const ADMIN_DATA_KEY = "tastepoint-admin-data";

// Sample initial paid bills so the user dashboard has data out-of-the-box
export const initialCustomerBills = [
  {
    id: "TP-8492019",
    billNumber: "TP-8492019",
    tableNumber: "T-01",
    date: "20 Oct 2026, 08:45 PM",
    createdAt: "2026-10-20T20:45:00.000Z",
    customer: "Rahul Sharma",
    phone: "+91 98765 43210",
    paymentMethod: "UPI",
    status: "Paid",
    subtotal: 617,
    sgst: 15,
    cgst: 15,
    discount: 0,
    grandTotal: 647,
    transactionId: "UPI-TXN-984210492",
    items: [
      {
        id: 1,
        name: "Margherita Pizza",
        category: "Pizza",
        price: 249,
        quantity: 2,
        image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=85",
      },
      {
        id: 4,
        name: "Peri-Peri French Fries",
        category: "Sides",
        price: 119,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=85",
      },
    ],
  },
  {
    id: "TP-8481023",
    billNumber: "TP-8481023",
    tableNumber: "T-03",
    date: "18 Oct 2026, 01:30 PM",
    createdAt: "2026-10-18T13:30:00.000Z",
    customer: "Rahul Sharma",
    phone: "+91 98765 43210",
    paymentMethod: "Card",
    status: "Paid",
    subtotal: 368,
    sgst: 9,
    cgst: 9,
    discount: 0,
    grandTotal: 386,
    transactionId: "CARD-AUTH-883192",
    items: [
      {
        id: 2,
        name: "Creamy Alfredo Pasta",
        category: "Pasta",
        price: 219,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=800&q=85",
      },
      {
        id: 8,
        name: "Chocolate Lava Cake",
        category: "Desserts",
        price: 149,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=800&q=85",
      },
    ],
  },
  {
    id: "TP-8463910",
    billNumber: "TP-8463910",
    tableNumber: "T-02",
    date: "15 Oct 2026, 07:15 PM",
    createdAt: "2026-10-15T19:15:00.000Z",
    customer: "Rahul Sharma",
    phone: "+91 98765 43210",
    paymentMethod: "Cash",
    status: "Paid",
    subtotal: 487,
    sgst: 12,
    cgst: 12,
    discount: 0,
    grandTotal: 511,
    transactionId: "CASH-REC-104928",
    items: [
      {
        id: 3,
        name: "Classic Veg Burger",
        category: "Burgers",
        price: 179,
        quantity: 2,
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=85",
      },
      {
        id: 7,
        name: "Garlic Butter Breadsticks",
        category: "Sides",
        price: 129,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1619895092538-128341789043?auto=format&fit=crop&w=800&q=85",
      },
    ],
  },
];

/**
 * Format currency in Indian Rupees (INR)
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);
};

/**
 * Get all customer bills from localStorage, fallback to initial bills on first load only.
 */
export function getCustomerBills() {
  try {
    const raw = localStorage.getItem(CUSTOMER_BILLS_KEY);
    if (raw === null) {
      localStorage.setItem(CUSTOMER_BILLS_KEY, JSON.stringify(initialCustomerBills));
      return initialCustomerBills;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Error loading customer bills:", error);
    return [];
  }
}

/**
 * Delete a customer bill by ID from localStorage and sync with admin billing data.
 * Removes the bill permanently from both CUSTOMER_BILLS_KEY and ADMIN_BILLING_KEY.
 */
export function deleteCustomerBill(billId) {
  try {
    const raw = localStorage.getItem(CUSTOMER_BILLS_KEY);
    let existingBills = [];
    if (raw !== null) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          existingBills = parsed;
        }
      } catch (e) {
        console.error("Failed to parse customer bills for deletion:", e);
      }
    } else {
      existingBills = [...initialCustomerBills];
    }

    const updatedBills = existingBills.filter(
      (b) => b && b.id !== billId && b.billNumber !== billId
    );
    localStorage.setItem(CUSTOMER_BILLS_KEY, JSON.stringify(updatedBills));

    // Also remove from admin billing storage so data stays synchronized
    try {
      const adminBillsRaw = localStorage.getItem(ADMIN_BILLING_KEY);
      if (adminBillsRaw) {
        const adminBills = JSON.parse(adminBillsRaw);
        if (Array.isArray(adminBills)) {
          const updatedAdmin = adminBills.filter(
            (b) => b && b.id !== billId && b.billNumber !== billId
          );
          localStorage.setItem(ADMIN_BILLING_KEY, JSON.stringify(updatedAdmin));
        }
      }
    } catch (e) {
      console.warn("Could not sync deletion with admin billing data:", e);
    }

    return updatedBills;
  } catch (error) {
    console.error("Error deleting customer bill:", error);
    return [];
  }
}




/**
 * Save a new bill from cart checkout to customer bills and sync with admin billing data.
 */
export function saveCustomerBill(bill) {
  try {
    const existingBills = getCustomerBills();
    // Prepend new bill
    const normalizedBill = {
      ...bill,
      id: bill.id || bill.billNumber || `TP-${Date.now().toString().slice(-8)}`,
      billNumber: bill.billNumber || bill.id || `TP-${Date.now().toString().slice(-8)}`,
      status: bill.status || "Paid",
      createdAt: bill.createdAt || new Date().toISOString(),
    };

    const updatedBills = [normalizedBill, ...existingBills.filter((b) => b.id !== normalizedBill.id)];
    localStorage.setItem(CUSTOMER_BILLS_KEY, JSON.stringify(updatedBills));

    // Also sync to admin billing storage so admin sees this bill
    try {
      const adminBillsRaw = localStorage.getItem(ADMIN_BILLING_KEY);
      const adminBills = adminBillsRaw ? JSON.parse(adminBillsRaw) : [];
      const adminEntry = {
        id: normalizedBill.billNumber,
        date: new Date().toISOString().slice(0, 10),
        customer: normalizedBill.customer || "Customer (Cart)",
        items: normalizedBill.items.map((it) => ({
          name: it.name || it.title || "Dish",
          quantity: it.quantity || 1,
          price: Number(it.price || 0),
        })),
        discount: normalizedBill.discount || 0,
        taxRate: 5,
        payment: normalizedBill.paymentMethod || "UPI",
        status: "Paid",
        refund: 0,
      };
      const updatedAdminBills = [adminEntry, ...adminBills.filter((b) => b.id !== adminEntry.id)];
      localStorage.setItem(ADMIN_BILLING_KEY, JSON.stringify(updatedAdminBills));
    } catch (e) {
      console.warn("Could not sync with admin billing data:", e);
    }

    return normalizedBill;
  } catch (error) {
    console.error("Error saving customer bill:", error);
    return bill;
  }
}
