export default function ReturnPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Return & Refund Policy</h1>
        <p className="text-gray-600 mb-8">Last updated: January 2026</p>

        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Return Eligibility</h2>
            <p>
              At Glacia Labs, we ensure all electronics are tested before shipping. 
              We accept returns <strong>only for defective items</strong> or items damaged during transit. 
              We do not accept returns for "change of mind" once the electronic seal is broken, due to the sensitive nature of these components.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Timeframe</h2>
            <p>
              You must report a defective item within <strong>15 days</strong> of receiving your order. 
              Please verify your components (sensors, boards, motors) immediately upon arrival.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Exchange Process</h2>
            <p>
              If you ordered the wrong component by mistake (e.g., wrong voltage rating), we accept exchanges within 15 days, provided the item is:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Unused and unopened.</li>
              <li>In its original packaging.</li>
              <li>Customer covers the shipping cost for the exchange.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. How to Request a Return</h2>
            <p>
              To initiate a return or exchange, please contact our support team at <strong>glacialabs@gmail.com</strong> or WhatsApp us with:+92-3169030178
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Your Order ID.</li>
              <li>A photo/video clearly showing the defect.</li>
            </ul>
          </section>

          <div className="mt-8 p-4 bg-blue-50 rounded-md text-sm text-blue-800">
            <strong>Note on Microcontrollers:</strong> We cannot accept returns on burnt microcontrollers (Arduino, ESP32) caused by improper wiring or over-voltage by the user.
          </div>
        </div>
      </div>
    </div>
  );
}