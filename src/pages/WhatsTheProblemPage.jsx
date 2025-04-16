import React from 'react';

function WhatsTheProblemPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-white">
      <h1 className="text-4xl font-bold mb-6">What’s the Problem?</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Education Shouldn't Depend on Your Internet Speed</h2>
        <p className="text-lg">
          Millions of students in rural areas face an invisible barrier to online education: slow, unreliable internet.
          While most platforms are designed for fiber-optic speeds and powerful laptops, many students are learning on
          decade-old Chromebooks and school bus Wi-Fi.
        </p>
        <p className="mt-2">BrainBridge is built differently.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Why We Optimized for Low Bandwidth</h2>
        <ul className="list-disc pl-6 text-lg">
          <li>Smart preloading — lessons load before you need them</li>
          <li>Adaptive rendering — adjusts content to your connection</li>
          <li>No login required — no friction for first-time users</li>
          <li>Ultra-lightweight pages — average page size under 200kb</li>
        </ul>
        <p className="mt-2">Because educational equity starts with delivery — not just content.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Equal Access Starts with Infrastructure</h2>
        <p className="text-lg">
          Most educational tools assume prerequisites: fast internet, modern tech, and uninterrupted access.
          But for students in rural towns, that’s not the norm. So we removed those assumptions.
          BrainBridge was engineered for the margins — to ensure students without privilege aren't left behind.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Why It Matters</h2>
        <p className="text-lg">
          When access is throttled by bandwidth, opportunity is, too. We’re working to fix that.
          Whether you're on a school bus in Idaho or a dorm in NYC, your ability to learn shouldn't be dictated by how fast your Wi-Fi is.
        </p>
        <div className="mt-4 space-y-2 text-lg">
          <p>• Over 23% of rural U.S. households lack access to high-speed broadband (FCC).</p>
          <p>• Students without reliable internet score significantly lower on standardized tests and are less likely to attend college (Pew Research).</p>
          <p>• In some counties, 1 in 4 students rely on mobile hotspots or shared community connections just to complete homework.</p>
        </div>
      </section>
    </div>
  );
}

export default WhatsTheProblemPage;