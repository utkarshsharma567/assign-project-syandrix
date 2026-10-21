import { Link } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import PaymentOptions from "../components/PaymentOptions";
import {
  ArrowLeft,
  ShoppingBag,
  Trash2,
  Minus,
  Plus,
  ChefHat,
  ReceiptText,
} from "lucide-react";
import { saveCustomerBill } from "../utils/billingStorage";

const money = (amount) => `₹${Number(amount || 0).toFixed(2)}`;

function getBillNumber() {
  return `TP-${Date.now().toString().slice(-8)}`;
}

function getCurrentDate() {
  return new Date().toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Cart() {
  const {
    cartItems = [],
    cartTotal = 0,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedBill, setPlacedBill] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const billRef = useRef(null);

  const subtotal = Number(cartTotal) || 0;
  const sgst = Math.floor(subtotal * 0.025);
  const cgst = Math.floor(subtotal * 0.025);
  const grandTotal = subtotal + sgst + cgst;

  const getItemPrice = (item) => Number(item.price ?? item.amount ?? 0);

  const getItemQuantity = (item) => Number(item.quantity ?? item.qty ?? 1);

  const confirmPayment = ({ method } = {}) => {
    if (!method) {
      window.alert("Please select a payment method.");
      return;
    }

    if (cartItems.length === 0) {
      window.alert("Your cart is empty.");
      return;
    }

    const total = grandTotal;
    const message =
      method === "Cash"
        ? `Confirm cash order for ${money(total)}?`
        : `Have you completed and verified the UPI payment of ${money(total)}?`;

    if (!window.confirm(message)) return;

    const billNum = getBillNumber();
    const bill = {
      id: billNum,
      billNumber: billNum,
      tableNumber: "T-01",
      date: getCurrentDate(),
      createdAt: new Date().toISOString(),
      customer: "Customer (Cart)",
      items: cartItems.map((item) => ({ ...item })),
      subtotal,
      sgst,
      cgst,
      grandTotal,
      paymentMethod: method,
      status: "Paid",
      transactionId: method === "UPI" ? `UPI-TXN-${Date.now().toString().slice(-6)}` : `CASH-${Date.now().toString().slice(-6)}`,
    };

    saveCustomerBill(bill);
    setPlacedBill(bill);
    setOrderPlaced(true);
    if (typeof clearCart === "function") {
      clearCart();
    }
  };

  const downloadBill = async () => {
    if (!billRef.current || !placedBill) return;

    setDownloading(true);

    try {
      const canvas = await html2canvas(billRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
        logging: false,
        imageTimeout: 15000,
      });

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 12;
      const availableWidth = pageWidth - margin * 2;
      const availableHeight = pageHeight - margin * 2;

      const imageHeight = (canvas.height / canvas.width) * availableWidth;

      const scale = Math.min(1, availableHeight / imageHeight);
      const finalWidth = availableWidth * scale;
      const finalHeight = imageHeight * scale;
      const x = (pageWidth - finalWidth) / 2;

      pdf.addImage(
        canvas.toDataURL("image/png"),
        "PNG",
        x,
        margin,
        finalWidth,
        finalHeight,
      );

      pdf.save(
        `TastePoint-${placedBill.billNumber.replace(/[^a-zA-Z0-9-]/g, "")}.pdf`,
      );
    } catch (error) {
      console.error("PDF download failed:", error);
      window.alert(
        "PDF download nahi ho paya. QR image ka URL aur browser console check karein.",
      );
    } finally {
      setDownloading(false);
    }
  };

  // ORDER CONFIRMATION AND BILL
  if (orderPlaced && placedBill) {
    const paymentQR = localStorage.getItem("tastepoint_payment_qr");

    return (
      <section className="min-h-screen bg-gray-100 px-3 py-8 sm:px-6">
        <div
          ref={billRef}
          data-bill-receipt
          className="mx-auto max-w-2xl border border-gray-300 bg-white p-5 text-black sm:p-8"
        >
          {/* Restaurant heading */}

          <div className=" text-center">
            <h1 className="text-2xl font-extrabold tracking-wide text-gray-800">
              TastePoint Restaurant
            </h1>

            <p className="mt-2 text-sm text-gray-700">
              123, Food Street, Bhopal, Madhya Pradesh - 462001
            </p>

            <p className="mt-1 text-sm text-gray-700">Phone: +91 98765 43210</p>

            <p className="text-sm text-gray-700">
              Email: tastepoint@example.com
            </p>
         {/* baad mai  GSTIN ka full form    Goods and Services Tax Identification Number   */} 
            <p className="text-sm text-gray-700">GSTIN: 23AABCU9603R1ZM </p>

            
          </div>

          <div className="my-5 border-t-2 border-dashed border-black" />

          {/* Bill information */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="font-bold">Bill Number</p>
              <p>{placedBill.billNumber}</p>
            </div>
            <div className="text-right">
              <p className="font-bold">Table Number</p>
              <p>{placedBill.tableNumber}</p>
            </div>
            <div className="col-span-2">
              <p className="font-bold">Date & Time</p>
              <p>{placedBill.date}</p>
            </div>
          </div>

          <div className="my-5 border-t border-black" />

          {/* Items */}
          <div className="overflow-hidden">
            <table className="w-full table-fixed text-sm">
              <thead>
                <tr className="border-b border-black text-left">
                  <th className="w-[42%] py-2 pr-1">Item</th>
                  <th className="w-[14%] py-2 text-center">Qty </th>
                  <th className="w-[22%] py-2 text-right">Rate (₹)</th>
                  <th className="w-[22%] py-2 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                {placedBill.items.map((item, index) => {
                  const price = getItemPrice(item);
                  const quantity = getItemQuantity(item);

                  return (
                    <tr
                      key={item.id ?? item._id ?? `${item.name}-${index}`}
                      className="border-b border-gray-200"
                    >
                      <td className="break-words py-3 pr-1">
                        {item.name ?? item.title ?? "Food Item"}
                      </td>
                      <td className="py-3 text-center">{quantity}</td>
                      <td className="py-3 text-right">{money(price)}</td>
                      <td className="py-3 text-right">
                        {money(price * quantity)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="ml-auto mt-5 max-w-xs space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <span>Subtotal</span>
              <span>{money(placedBill.subtotal)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>SGST (2.5%)</span>
              <span>{money(placedBill.sgst)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>CGST (2.5%)</span>
              <span>{money(placedBill.cgst)}</span>
            </div>

            <div className="border-t-2 border-black pt-3">
              <div className="flex justify-between gap-4 text-lg font-black">
                <span>GRAND TOTAL</span>
                <span>{money(placedBill.grandTotal)}</span>
              </div>
            </div>
          </div>

          <div className="my-5 border-t border-dashed border-black" />

          {/* Payment information */}
          <div className="text-sm">
            <div className="flex justify-between gap-3">
              <span className="font-bold">Payment Mode</span>
              <span>{placedBill.paymentMethod}</span>
            </div>
            <div className="mt-2 flex justify-between gap-3">
              <span className="font-bold">Payment Status</span>
              <span>
                {placedBill.paymentMethod === "Cash"
                  ? "Cash confirmation"
                  : "Customer confirmed"}
              </span>
            </div>
          </div>

          {/* UPI QR */}
          <div className="my-5 border-t border-dashed border-black" />

          <div className="text-center">
            <p className="text-sm font-black tracking-wide">
              SCAN & PAY USING ANY UPI APP
            </p>

            {paymentQR ? (
              <img
                src={paymentQR}
                alt="TastePoint UPI payment QR code"
                crossOrigin="anonymous"
                className="mx-auto mt-3 h-36 w-36 object-contain"
              />
            ) : (
              <p className="mt-3 text-xs">UPI QR code is not available.</p>
            )}

            <p className="mt-3 text-xs">Thank you for visiting TastePoint!</p>
            <p className="mt-1 text-xs">Please visit us again.</p>
          </div>

          <div className="my-5 border-t-2 border-dashed border-black" />

          <p className="text-center text-[10px]">Computer-generated bill</p>
        </div>

        {/* These buttons are outside the PDF receipt */}
        <div className="mx-auto mt-6 flex max-w-2xl flex-col gap-3 sm:flex-row print:hidden">
          <button
            type="button"
            onClick={downloadBill}
            disabled={downloading}
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-black px-5 py-3 font-bold text-white transition hover:bg-gray-800 disabled:opacity-60"
          >
            <ReceiptText size={18} />
            {downloading ? "Preparing PDF..." : "Download Bill (PDF)"}
          </button>

          <Link
            to="/menu"
            className="flex flex-1 items-center justify-center gap-2 rounded-full border border-black px-5 py-3 text-center font-bold text-black transition hover:bg-gray-100"
          >
            <ShoppingBag size={18} />
            Order More Dishes
          </Link>
        </div>
      </section>
    );
  }

  // EMPTY CART
  if (!cartItems.length) {
    return (
      <section className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
        <ShoppingBag size={56} className="mb-4 text-gray-400" />
        <h1 className="text-2xl font-bold text-gray-900">Your cart is empty</h1>
        <p className="mt-2 text-gray-500">
          Add your favourite dishes to get started.
        </p>
        <Link
          to="/menu"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-orange-500 px-6 py-3 font-bold text-white hover:bg-orange-600 shadow-md"
        >
          <ArrowLeft size={18} />
          Browse Menu
        </Link>
      </section>
    );
  }

  // CART PAGE
  return (
    <section className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center gap-3">
          <ShoppingBag size={30} className="text-orange-500" />
          <div>
            <h1 className="text-3xl font-black text-gray-900">Your Cart</h1>
            <p className="text-sm text-gray-500">
              Review your order before checkout.
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* Cart items */}
          <div className="space-y-4">
            {cartItems.map((item, index) => {
              const price = getItemPrice(item);
              const quantity = getItemQuantity(item);
              const key = item.id ?? item._id ?? `${item.name}-${index}`;

              return (
                <article
                  key={key}
                  className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-center"
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name ?? "Food item"}
                      className="h-24 w-full rounded-xl object-cover sm:w-24"
                    />
                  )}

                  <div className="min-w-0 flex-1">
                    <h2 className="font-bold text-gray-900">
                      {item.name ?? item.title ?? "Food Item"}
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      {money(price)} each
                    </p>

                    <div className="mt-3 flex items-center gap-3">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        onClick={() => decreaseQuantity(item.id ?? item._id)}
                        className="rounded-full border border-gray-300 p-2 hover:bg-gray-100"
                      >
                        <Minus size={14} />
                      </button>

                      <span className="min-w-5 text-center font-bold">
                        {quantity}
                      </span>

                      <button
                        type="button"
                        aria-label="Increase quantity"
                        onClick={() => increaseQuantity(item.id ?? item._id)}
                        className="rounded-full border border-gray-300 p-2 hover:bg-gray-100"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                    <p className="font-black text-gray-900">
                      {money(price * quantity)}
                    </p>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id ?? item._id)}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                      Remove
                    </button>
                  </div>
                </article>
              );
            })}

            <Link
              to="/menu"
              className="inline-flex items-center gap-2 py-2 font-semibold text-orange-600 hover:text-orange-700"
            >
              <ArrowLeft size={18} />
              Continue Shopping
            </Link>
          </div>

          {/* Order summary and payment */}
          <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="mb-5 text-xl font-black text-gray-900">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between gap-3">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">{money(subtotal)}</span>
              </div>

              <div className="flex justify-between gap-3">
                <span className="text-gray-600">SGST (2.5%)</span>
                <span>{money(sgst)}</span>
              </div>

              <div className="flex justify-between gap-3">
                <span className="text-gray-600">CGST (2.5%)</span>
                <span>{money(cgst)}</span>
              </div>

              <div className="border-t border-dashed border-gray-300 pt-4">
                <div className="flex justify-between gap-3 text-lg font-black">
                  <span>Total</span>
                  <span>{money(grandTotal)}</span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <PaymentOptions onConfirm={confirmPayment} />
            </div>

            <p className="mt-4 text-xs leading-5 text-gray-500">
              Taxes are calculated at 2.5% SGST and 2.5% CGST. Confirm UPI
              payments only after verifying the payment in your UPI app.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
