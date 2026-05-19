function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black text-black dark:text-white p-10">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-900 p-10 rounded-3xl shadow-xl">
        <h1 className="text-5xl font-bold mb-10">Privacy Policy</h1>

        <div className="space-y-6 text-gray-500 text-lg leading-relaxed">
          <p>
            We collect user information for booking and authentication purposes
            only.
          </p>

          <p>
            Your personal data is securely stored and never shared with third
            parties.
          </p>

          <p>We use JWT authentication and secure database storage.</p>

          <p>Users may request account deletion anytime.</p>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
