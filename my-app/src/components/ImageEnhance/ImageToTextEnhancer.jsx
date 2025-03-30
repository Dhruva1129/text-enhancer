import React, { useState } from "react";
import axios from "axios";
import "./ImageToTextEnhancer.css"; // <-- Import the CSS file
import { useNavigate } from "react-router-dom";

const ImageToTextEnhancer = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [extractedText, setExtractedText] = useState("");
    const [enhancedText, setEnhancedText] = useState("");
    const [loading, setLoading] = useState(false);
    const [tone, setTone] = useState("formal");

    const navigate = useNavigate();

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedImage(file);
            setExtractedText("");
            setEnhancedText("");
        }
    };

    const handleExtractAndEnhance = async () => {
        if (!selectedImage) return;

        const formData = new FormData();
        formData.append("file", selectedImage);
        formData.append("tone", tone);

        try {
            setLoading(true);
            const response = await axios.post("http://127.0.0.1:8000/image/image-to-enhanced-text", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            setExtractedText(response.data.raw_text);
            setEnhancedText(response.data.enhanced_text);
        } catch (error) {
            console.error("Error processing image:", error);
            alert("Failed to extract and enhance text.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="image-enhancer-container">
            <button className="back-button" onClick={() => navigate("/")}> ← Back to Home</button>
            <h2 className="title">🖼️ Image to Enhanced Text</h2>

            <input type="file" accept="image/*" onChange={handleImageChange} className="file-input" />

            <div className="tone-select-group">
                <label>Select Tone:</label>
                <select value={tone} onChange={(e) => setTone(e.target.value)} className="tone-select">
                    <option value="formal">Formal</option>
                    <option value="casual">Casual</option>
                    <option value="poetic">Poetic</option>
                    <option value="sarcastic">Sarcastic</option>
                    <option value="friendly">Friendly</option>
                    <option value="motivational">Motivational</option>
                </select>
            </div>

            {selectedImage && (
                <div className="image-preview-section">
                    <img src={URL.createObjectURL(selectedImage)} alt="Preview" className="image-preview" />
                    <button onClick={handleExtractAndEnhance} disabled={loading} className="action-button">
                        {loading ? "Processing..." : "Extract & Enhance Text"}
                    </button>
                </div>
            )}

            {extractedText && (
                <div className="text-section">
                    <h3>Extracted Text:</h3>
                    <p className="extracted-text">{extractedText}</p>
                </div>
            )}

            {enhancedText && (
                <div className="text-section">
                    <h3>Enhanced Text:</h3>
                    <p className="enhanced-text">{enhancedText}</p>
                </div>
            )}
        </div>
    );
};

export default ImageToTextEnhancer;
