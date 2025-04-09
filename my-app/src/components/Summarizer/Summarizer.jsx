import React, { useState } from "react";
import axios from "axios";
import "./Summarizer.css";

const API_URL = import.meta.env.VITE_API_URL;

const Summarizer = () => {
    const [text, setText] = useState("");
    const [file, setFile] = useState(null);
    const [summary, setSummary] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSummarize = async () => {
        const formData = new FormData();
        if (file) formData.append("file", file);
        if (text) formData.append("text", text);

        try {
            setLoading(true);
            const response = await axios.post(
                `${API_URL}/summarizer/summarize`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            setSummary(response.data.summary);
        } catch (error) {
            alert("Error summarizing");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="summarizer-container">
            <h2 className="summarizer-title">Summarize Text or Upload File</h2>

            <textarea
                className="summarizer-textarea"
                placeholder="Paste long text..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={8}
            />

            <input
                className="summarizer-file-input"
                type="file"
                accept=".pdf,.docx"
                onChange={(e) => setFile(e.target.files[0])}
            />

            <button className="summarizer-button" onClick={handleSummarize} disabled={loading}>
                {loading ? "Summarizing..." : "Summarize"}
            </button>

            {summary && (
                <div className="summarizer-output">
                    <h3>Summary:</h3>
                    <p>{summary}</p>
                </div>
            )}
        </div>
    );
};

export default Summarizer;
