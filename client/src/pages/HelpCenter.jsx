function HelpCenter() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black text-black dark:text-white p-10">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-900 p-10 rounded-3xl shadow-xl">
        <h1 className="text-5xl font-bold mb-10">Help Center</h1>

        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-2">How to book a car?</h2>

            <p className="text-gray-500">
              Browse available cars, select your preferred vehicle, and complete
              the booking process.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-2">Can I cancel a booking?</h2>

            <p className="text-gray-500">
              Yes, bookings can be cancelled before confirmation.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-2">Payment Support</h2>

            <p className="text-gray-500">
              We support secure online payments and booking confirmations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HelpCenter;
