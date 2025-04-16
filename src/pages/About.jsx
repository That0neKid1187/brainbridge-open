// src/pages/About.jsx
import React from 'react';
import { Helmet } from 'react-helmet';

const About = () => {
  return (
    <>
      <Helmet>
        <title>About | BrainBridge</title>
        <meta
          name="description"
          content="Meet the creators of BrainBridge — a WiFi-optimized, open-source education platform built to bridge the gap for underserved students."
        />
        <meta name="robots" content="index, follow" />
        <meta name="keywords" content="About BrainBridge, rural education, Jacob Brashear, Lincoln, free learning platform, equitable access" />
        <link rel="canonical" href="https://www.brainbridge.education/about" />

        {/* Open Graph for social sharing */}
        <meta property="og:title" content="About | BrainBridge" />
        <meta
          property="og:description"
          content="BrainBridge is a student-led platform providing free, accessible education for rural communities. Meet its founders Jacob and Lincoln."
        />
        <meta property="og:image" content="https://www.brainbridge.education/og-preview.png" />
        <meta property="og:url" content="https://www.brainbridge.education/about" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <div className="max-w-3xl mx-auto p-6 text-center text-base leading-relaxed text-zinc-200">
        <h1 className="text-4xl font-bold mb-6 text-white">About BrainBridge</h1>

        <p className="text-lg mb-4 text-white">
          Hi — we’re Jacob and Lincoln, co-founders of <strong>BrainBridge</strong>.
        </p>

        <p className="mb-4">
          I’m Jacob. I grew up in Indiana and later moved to New York City. The educational disparities I saw firsthand pushed me to build something that could level the playing field.
        </p>
        <p className="mb-4">
          BrainBridge is a project built to make high-quality, accessible education available to every student — especially those in rural or underserved areas. It’s open-source, fast on any connection, and built for scale.
        </p>

        <hr className="my-6 border-zinc-700" />

        <p className="mb-4">
          I’m Lincoln. I joined the project because I saw the same problem growing up in Northern Idaho.
        </p>
        <p className="mb-4">
          I moved to New York in my freshman year to seek better educational opportunities. Back in Idaho, I watched older students struggle — not from a lack of ambition, but from a lack of access. Many only knew of their state school and weren’t exposed to broader options.
        </p>
        <p className="mb-4">
          BrainBridge is our way of opening up those options — from career exploration to philosophy, we want students to discover more than what’s just in their hometown.
        </p>

        <hr className="my-6 border-zinc-700" />

        <p className="mb-4">
          Whether you're here to learn, teach, or support the mission, welcome to the movement.
        </p>
        <p className="italic text-sm mt-6 text-zinc-400">Let’s bridge the gap — together.</p>
      </div>
    </>
  );
};

export default About;