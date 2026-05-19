function Terms() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black text-black dark:text-white p-10">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-900 p-10 rounded-3xl shadow-xl">
        <h1 className="text-5xl font-bold mb-10">Terms & Conditions</h1>

        <div className="space-y-6 text-gray-500 text-lg leading-relaxed">
          <p>Users must provide valid information while booking vehicles.</p>

          <p>The company reserves the right to cancel suspicious bookings.</p>

          <p>
            Users are responsible for vehicle safety during rental duration.
          </p>

          <p>Late returns may result in additional charges.</p>
        </div>
      </div>
    </div>
  );
}

export default Terms;
