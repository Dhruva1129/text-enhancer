import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";


const Home = () => {
  const navigate = useNavigate();

  const featuresList = [
    {
      title: "AI-Powered Text Enhancement",
      description: "Fix grammar, improve clarity, and refine tone in seconds.",
      icon: "📝",
    },
    {
      title: "Image to Text Conversion",
      description: "Extract text from images and enhance it instantly.",
      icon: "📸",
    },
    {
      title: "Multilingual Translation",
      description: "Translate enhanced text into various languages effortlessly.",
      icon: "🌍",
    },
    {
      title: "Custom Tone Adjustments",
      description: "Convert text into formal, casual, poetic, sarcastic styles.",
      icon: "🎭",
    },
    {
      title: "Text-to-Speech",
      description: "Listen to your enhanced text with AI-powered speech synthesis.",
      icon: "🔊",
    },
    {
      title: "Handwriting Recognition",
      description: "Extract and enhance handwritten text with AI.",
      icon: "✍️",
    },
  ];

  return (
    <>
      <div id="home" className="home-container">
        <h1>Welcome to AI <span>Text Enhancer</span></h1>
        <h2><span>Write Smarter</span>, Sound Better!</h2>
        <h4>Fix grammar, adjust tone, and <span>enhance</span> your text in seconds.</h4>
        <h4>Extract text from <span>images</span> and refine it instantly!</h4>
        <p className="home-para">Choose an option below:</p>
        <div className="button-container">
          <button onClick={() => navigate("/text-enhancer")}>Enhance Text</button>
          <button onClick={() => navigate("/image-to-text-enhancer")}>Image to Text Enhance</button>
          <button onClick={() => navigate("/summarizer")}>Summarizer</button>
        </div>
      </div>


      <section className="about-section" id="about">
        <div className="about-container">
          <h1 className="about-title">About <span>AI Text Enhancer</span></h1>
          <p className="about-description">
            AI Text Enhancer helps you refine your writing by improving grammar, adjusting tone, and
            making your text clearer and more professional. It also converts images to text and enhances
            extracted content for better readability.
          </p>

          <div className="cards-container">
            <div className="about-card">
              <h2>Text Enhancement</h2>
              <p>Fix grammatical mistakes, improve readability, and adjust tone with AI-powered suggestions.</p>
            </div>

            <div className="about-card">
              <h2>Image to Text</h2>
              <p>Extract text from images and refine it for clarity using advanced OCR and AI processing.</p>
            </div>

            <div className="about-card">
              <h2>Tone Adjustment</h2>
              <p>Choose from different tones like formal, casual, professional, or creative to match your style.</p>
            </div>

            <div className="about-card">
              <h2>Multilingual Support</h2>
              <p>Translate and enhance text in multiple languages for a global audience.</p>
            </div>
          </div>

          <p className="about-footer">
            AI Text Enhancer is designed for students, professionals, and content creators to elevate their writing
            effortlessly. Try it today and transform your text like never before!
          </p>
        </div>
      </section>

      <section id="features" className="features-section">
      <h2>Key Features of <span>AI Text Enhancer</span></h2>
      <div className="features-container">
        {featuresList.map((feature, index) => (
          <div key={index} className="feature-card">
            <span className="feature-icon">{feature.icon}</span>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>

    <footer className="footer">
      <div className="footer-container">
        {/* Left - About Section */}
        <div className="footer-section about">
          <h2>AI Text Enhancer</h2>
          <p>Enhance text, fix grammar, adjust tone, and extract text from images effortlessly.</p>
        </div>

        {/* Center - Quick Links */}
        <div className="footer-section links">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#features">Features</a></li>
            <li><a href="/text-enhancer">Enhance Text</a></li>
            <li><a href="/image-to-text-enhancer">Image Enhancer</a></li>
          </ul>
        </div>

        {/* Right - Contact & Social Media */}
        <div className="footer-section contact">
          <h3>Contact Us</h3>
          <p>Email: support@aitextenhancer.com</p>
          <p>Phone: +91 70757 90874</p>
          <div className="social-icons">
            <a href="#"><i className="fab fa-facebook"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-linkedin"></i></a>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="footer-bottom">
        <p>&copy; 2025 AI Text Enhancer | All Rights Reserved</p>
      </div>
    </footer>

      

    </>


  );
};

export default Home;
