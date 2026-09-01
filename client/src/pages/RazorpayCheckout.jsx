import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Building2, CreditCard, IndianRupee, Lock, Wallet } from "lucide-react";
import { cars, currency } from "../data/cars";

export function RazorpayCheckout() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const car = cars.find((item) => item.id === params.get("car")) || cars[0];
  const days = parseInt(params.get("days") || "3", 10);
  const amount = car.pricePerDay * days;
  const [payMethod, setPayMethod] = useState("card");
  const [processing, setProcessing] = useState(false);
  const [cardNum, setCardNum] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [upiId, setUpiId] = useState("");

  const handlePay = async () => {
    setProcessing(true);
    try {
      // 1. Load Razorpay SDK
      if (!window.Razorpay) {
        await new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = resolve;
          script.onerror = reject;
          document.body.appendChild(script);
        });
      }

      // 2. Create order on backend using your test key
      const orderRes = await fetch("/api/payments/demo-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amount * 100 }), // paise
      });
      const orderData = await orderRes.json();

      if (!orderData.success) throw new Error(orderData.message || "Order creation failed");

      // 3. Open real Razorpay checkout
      const rzp = new window.Razorpay({
        key: "rzp_test_TLEXRM7N4kO22g",
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "DriveOn",
        description: `Booking: ${car.brand} ${car.name}`,
        order_id: orderData.order.id,
        handler: function () {
          navigate(`/booking?car=${car.id}&paid=true`);
        },
        prefill: { name: "", email: "", contact: "" },
        theme: { color: "#1a1a2e" },
        modal: { ondismiss: () => setProcessing(false) },
      });
      rzp.on("payment.failed", () => {
        alert("Payment failed. Please try again.");
        setProcessing(false);
      });
      rzp.open();
    } catch (err) {
      console.error("Payment error:", err);
      alert("Could not initiate payment. Make sure the backend server is running on port 3000.");
      setProcessing(false);
    }
  };

  return (
    <div className="rzp-page">
      <div className="rzp-page-ribbon"><span>TEST MODE</span></div>
      <div className="rzp-page-container">
        {/* Left - Merchant Info */}
        <div className="rzp-page-left">
          <div className="rzp-page-header">
            <span className="rzp-page-logo">D</span>
            <div>
              <strong>DriveOn</strong>
              <small>Car Rental</small>
            </div>
          </div>
          <div className="rzp-page-order-info">
            <div className="rzp-order-row"><span>Order ID</span><strong>order_test_{Math.floor(Math.random()*100000)}</strong></div>
            <div className="rzp-order-row"><span>Car</span><strong>{car.brand} {car.name}</strong></div>
            <div className="rzp-order-row"><span>Duration</span><strong>{days} {days === 1 ? "day" : "days"}</strong></div>
            <div className="rzp-order-row total"><span>Amount Payable</span><strong>₹{currency(amount)}</strong></div>
          </div>
          <div className="rzp-page-secured">
            <Lock size={14} /> Secured by <strong>Razorpay</strong>
          </div>
        </div>

        {/* Right - Payment Methods */}
        <div className="rzp-page-right">
          <div className="rzp-methods-nav">
            <button className={payMethod === "card" ? "active" : ""} onClick={() => setPayMethod("card")}>
              <CreditCard size={18} /> Card
            </button>
            <button className={payMethod === "upi" ? "active" : ""} onClick={() => setPayMethod("upi")}>
              <IndianRupee size={18} /> UPI / QR
            </button>
            <button className={payMethod === "netbanking" ? "active" : ""} onClick={() => setPayMethod("netbanking")}>
              <Building2 size={18} /> Netbanking
            </button>
            <button className={payMethod === "wallet" ? "active" : ""} onClick={() => setPayMethod("wallet")}>
              <Wallet size={18} /> Wallet
            </button>
          </div>

          <div className="rzp-method-body">
            {payMethod === "card" && (
              <div className="rzp-card-form">
                <div className="rzp-field">
                  <label>Card Number</label>
                  <input placeholder="4111 1111 1111 1111" value={cardNum} onChange={(e) => setCardNum(e.target.value)} />
                  <small className="rzp-hint">Use any test card number</small>
                </div>
                <div className="rzp-field-row">
                  <div className="rzp-field">
                    <label>Expiry Date</label>
                    <input placeholder="12/29" value={expiry} onChange={(e) => setExpiry(e.target.value)} />
                  </div>
                  <div className="rzp-field">
                    <label>CVV</label>
                    <input type="password" placeholder="123" maxLength={4} value={cvv} onChange={(e) => setCvv(e.target.value)} />
                  </div>
                </div>
                <div className="rzp-field">
                  <input placeholder="Name on card" />
                </div>
              </div>
            )}
            {payMethod === "upi" && (
              <div className="rzp-card-form">
                <div className="rzp-field">
                  <label>UPI ID</label>
                  <input placeholder="yourname@upi" value={upiId} onChange={(e) => setUpiId(e.target.value)} />
                  <small className="rzp-hint">e.g. success@razorpay (test)</small>
                </div>
                <div className="rzp-upi-apps">
                  <p>Or pay using</p>
                  <div className="rzp-app-row">
                    <button className="rzp-app-btn">GPay</button>
                    <button className="rzp-app-btn">PhonePe</button>
                    <button className="rzp-app-btn">Paytm</button>
                    <button className="rzp-app-btn">BHIM</button>
                  </div>
                </div>
              </div>
            )}
            {payMethod === "netbanking" && (
              <div className="rzp-card-form">
                <p className="rzp-nb-title">Popular Banks</p>
                <div className="rzp-bank-grid">
                  {["HDFC","SBI","ICICI","Axis","Kotak","Yes Bank","PNB","BOB"].map(b => (
                    <button key={b} className="rzp-bank-btn">{b}</button>
                  ))}
                </div>
              </div>
            )}
            {payMethod === "wallet" && (
              <div className="rzp-card-form">
                <p className="rzp-nb-title">Select Wallet</p>
                <div className="rzp-bank-grid">
                  {["Paytm","PhonePe","Amazon Pay","Freecharge","MobiKwik","Ola Money"].map(w => (
                    <button key={w} className="rzp-bank-btn">{w}</button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="rzp-pay-section">
            <button className="rzp-pay-btn" onClick={handlePay} disabled={processing}>
              {processing ? (
                <><span className="rzp-spinner" /> Processing...</>
              ) : (
                <>Pay ₹{currency(amount)}</>
              )}
            </button>
            <button className="rzp-cancel-btn" onClick={() => navigate(-1)}>Cancel and return to website</button>
          </div>
        </div>
      </div>
    </div>
  );
}
