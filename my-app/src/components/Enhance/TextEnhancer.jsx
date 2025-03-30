import React, { useState } from "react";
import axios from "axios";
import "./TextEnhancer.css";
import { useNavigate } from "react-router-dom";




const TextEnhancer = () => {
    const [text, setText] = useState("");
    const [enhancedText, setEnhancedText] = useState("");
    const [translatedText, setTranslatedText] = useState("");
    const [tone, setTone] = useState("neutral");
    const [selectedLanguage, setSelectedLanguage] = useState("en");
    // const [loading, setLoading] = useState(false);
    const [loadingEnhance, setLoadingEnhance] = useState(false);
    const [loadingTranslate, setLoadingTranslate] = useState(false);
    const [listening, setListening] = useState(false);

    const navigate = useNavigate();

    // const [text, setText] = useState("");
    // const [tone, setTone] = useState("formal");
    // const [enhancedText, setEnhancedText] = useState("");
    // const [translatedText, setTranslatedText] = useState("");
    // const [selectedLanguage, setSelectedLanguage] = useState("en");
    // 

    const tones = ["neutral", "sarcastic", "poetic", "happy", "sad", "angry", "formal", "casual"];
    const languages = [
        { code: "en", name: "English" },
        { code: "hi", name: "Hindi" },
        { code: "te", name: "Telugu" },
        { code: "ta", name: "Tamil" },
        { code: "kn", name: "Kannada" },
        { code: "mr", name: "Marathi" },
    ];

    // const [text, setText] = useState("");
    // const [listening, setListening] = useState(false);

    // const startListening = () => {
    //     setListening(true);
    //     console.log("Listening started...");
    // };

    // const stopListening = () => {
    //     setListening(false);
    //     console.log("Listening stopped...");
    // };

    const startListening = () => {
        setText("");
        setListening(true);

        // Initialize the Web Speech API
        const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.continuous = true; // Keep listening even after pauses
        recognition.interimResults = true; // Get interim results

        recognition.onresult = (event) => {
            let interimTranscript = "";
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcriptPart = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    setText((prevTranscript) => prevTranscript + transcriptPart + " ");
                } else {
                    interimTranscript += transcriptPart;
                }
            }
            // Update the text box with interim results
            setText((prevTranscript) => prevTranscript + interimTranscript);
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
            setListening(false);
        };

        recognition.onend = () => {
            setListening(false);
        };

        recognition.start();
    };

    const stopListening = () => {
        setListening(false);
        // Stop the recognition explicitly
        if (window.SpeechRecognition || window.webkitSpeechRecognition) {
            const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
            recognition.stop();
        }
    };


    const handleEnhance = async () => {
        if (!text.trim()) {
            alert("Please enter text before enhancing.");
            return;
        }

        try {
            setLoadingEnhance(true);
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/enhance`, { text, tone });

            if (response.data?.enhanced_text) {
                setEnhancedText(response.data.enhanced_text);
            } else {
                throw new Error("Unexpected API response format.");
            }
        } catch (error) {
            console.error("Error enhancing text:", error);
            alert(error.response?.data?.detail || "An error occurred while enhancing the text.");
        } finally {
            setLoadingEnhance(false);
        }
    };

    const handleTranslate = async () => {
        if (!enhancedText.trim()) {
            alert("Please enhance the text before translating.");
            return;
        }

        try {
            setLoadingTranslate(true);
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/translate`, {
                text: enhancedText,
                language: selectedLanguage
            });
            setTranslatedText(response.data.translated_text);
        } catch (error) {
            console.error("Error translating text:", error);
            alert("An error occurred while translating.");
        } finally {
            setLoadingTranslate(false);
        }
    };

    const handleSpeak = (text, lang) => {
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        synth.speak(utterance);
    };

    // const handleServerSpeak = async (text, lang) => {
    //     try {
    //         const response = await axios.post("http://127.0.0.1:8000/speak", { text, language: lang }, { responseType: "blob" });
    //         const audioUrl = URL.createObjectURL(response.data);
    //         const audio = new Audio(audioUrl);
    //         audio.play();
    //     } catch (error) {
    //         console.error("Error generating speech:", error);
    //         alert("Failed to generate speech.");
    //     }
    // };



    return (
        <div className="container">

            <button className="back-button" onClick={() => navigate("/")}>
                ← Back to Home
            </button>

            <h1>AI-Powered Text Enhancer</h1>

            <button onClick={listening ? stopListening : startListening}>
                {listening ? "Stop Listening" : "Start Listening"}
            </button>

            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Start speaking or type here..."
            />
            <br />

            <label>Select Tone:</label>
            <select value={tone} onChange={(e) => setTone(e.target.value)}>
                {tones.map((tone) => (
                    <option key={tone} value={tone}>{tone.charAt(0).toUpperCase() + tone.slice(1)}</option>
                ))}
            </select>

            <button className="enhance-btn" onClick={handleEnhance}>Enhance</button>

            <h2>Enhanced Text:</h2>
            <p>{loadingEnhance ? "Generating..." : enhancedText}</p>
            {enhancedText && (
                <button onClick={() => handleSpeak(enhancedText, "en")}>🔊 Speak</button>
            )}

            {/* Translation section appears only after enhanced text is available */}
            {enhancedText && (
                <>
                    <label>Select Language for Translation:</label>
                    <select value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)}>
                        {languages.map((lang) => (
                            <option key={lang.code} value={lang.code}>{lang.name}</option>
                        ))}
                    </select>

                    <button className="translate-btn" onClick={handleTranslate}>Translate</button>

                    <h2>Translated Text:</h2>
                    <p>{loadingTranslate ? "Translating..." : translatedText}</p>
                    {translatedText && (
                        <button onClick={() => handleSpeak(translatedText, selectedLanguage)}>🔊 Speak</button>
                    )}
                </>
            )}
        </div>
    );
};

export default TextEnhancer;









// // import React, { useState } from "react";
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "./TextEnhancer.css";

// const TextEnhancer = () => {
//     const [text, setText] = useState("");
//     const [tone, setTone] = useState("formal");
//     const [enhancedText, setEnhancedText] = useState("");
//     const [translatedText, setTranslatedText] = useState("");
//     const [selectedLanguage, setSelectedLanguage] = useState("en");
//     const [loading, setLoading] = useState(false);

//     // const [text, setText] = useState(""); // Stores text from speech or manual typing
//     const [isListening, setIsListening] = useState(false);
//     let recognition = null;

//     const tones = ["formal", "casual", "sarcastic", "poetic", "happy", "sad"];
//     const languages = [
//         { code: "en", name: "English" },
//         { code: "hi", name: "Hindi" },
//         { code: "te", name: "Telugu" },
//         { code: "ta", name: "Tamil" },
//         { code: "kn", name: "Kannada" },
//         { code: "mr", name: "Marathi" },
//     ];

//     // const handleEnhance = async () => {
//     //     try {
//     //         setLoading(true);
//     //         const response = await axios.post("http://127.0.0.1:8000/enhance", { text, tone });
//     //         setEnhancedText(response.data.enhanced_text);
//     //     } catch (error) {
//     //         console.error("Error enhancing text:", error);
//     //     } finally {
//     //         setLoading(false);
//     //     }
//     // };

//     useEffect(() => {
//         if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
//             recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
//             recognition.continuous = true;
//             recognition.interimResults = true;
//             recognition.lang = "en-US";

//             recognition.onresult = (event) => {
//                 let finalText = "";
//                 for (let i = 0; i < event.results.length; i++) {
//                     finalText += event.results[i][0].transcript + " ";
//                 }
//                 setText(finalText.trim()); // Update textarea with spoken words
//             };

//             recognition.onerror = (event) => {
//                 console.error("Speech recognition error", event.error);
//             };
//         } else {
//             alert("Your browser does not support Speech Recognition. Try Chrome!");
//         }
//     }, []);

//     // Start Listening
//     const startListening = () => {
//         if (recognition) {
//             recognition.start();
//             setIsListening(true);
//         }
//     };

//     // Stop Listening
//     const stopListening = () => {
//         if (recognition) {
//             recognition.stop();
//             setIsListening(false);
//         }
//     };

//     const handleEnhance = async () => {
//         if (!text.trim()) {
//             alert("Please enter text before enhancing.");
//             return;
//         }

//         try {
//             setLoading(true);
//             const response = await axios.post("http://127.0.0.1:8000/enhance", { text, tone });

//             if (response.data && response.data.enhanced_text) {
//                 setEnhancedText(response.data.enhanced_text);
//             } else {
//                 throw new Error("Unexpected API response format.");
//             }
//         } catch (error) {
//             console.error("Error enhancing text:", error);
//             alert(error.response?.data?.detail || "An error occurred while enhancing the text.");
//         } finally {
//             setLoading(false);
//         }
//     };


//     const handleTranslate = async () => {
//         try {
//             setLoading(true);
//             const response = await axios.post("http://127.0.0.1:8000/translate", {
//                 text: enhancedText,
//                 language: selectedLanguage
//             });
//             setTranslatedText(response.data.translated_text);
//         } catch (error) {
//             console.error("Error translating text:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleSpeak = async (text, lang) => {
//         const synth = window.speechSynthesis;
//         const utterance = new SpeechSynthesisUtterance(text);
//         utterance.lang = lang;
//         synth.speak(utterance);
//     };

//     const handleServerSpeak = async (text, lang) => {
//         try {
//             const response = await axios.post("http://127.0.0.1:8000/speak", { text, language: lang }, { responseType: "blob" });
//             const audioUrl = URL.createObjectURL(response.data);
//             const audio = new Audio(audioUrl);
//             audio.play();
//         } catch (error) {
//             console.error("Error generating speech:", error);
//         }
//     };

//     const handleSpeechToText = async () => {
//         if (!file) {
//             alert("Please upload an audio file.");
//             return;
//         }

//         const formData = new FormData();
//         formData.append("file", file);

//         try {
//             const response = await axios.post(
//                 "http://127.0.0.1:5000/speech-to-text",
//                 formData
//             );
//             setConvertedText(response.data.text);
//         } catch (error) {
//             console.error("Error in Speech-to-Text:", error);
//         }
//     };


//     return (
//         <div className="container">
//             <h1>AI-Powered Text Enhancer</h1>
//             {/* <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter text..." /> */}

//             <textarea
//                 value={text}
//                 onChange={(e) => setText(e.target.value)} // Allow manual input
//                 placeholder="Start speaking or type here..."
//             />
//             <br />

//             {isListening ? (
//                 <button onClick={stopListening} style={{ background: "red", color: "white" }}>
//                     🛑 Stop Listening
//                 </button>
//             ) : (
//                 <button onClick={startListening} style={{ background: "green", color: "white" }}>
//                     🎙️ Start Speaking
//                 </button>
//             )}

//             <label>Select Tone:</label>
//             <select value={tone} onChange={(e) => setTone(e.target.value)}>
//                 {tones.map((tone) => (
//                     <option key={tone} value={tone}>{tone.charAt(0).toUpperCase() + tone.slice(1)}</option>
//                 ))}
//             </select>

//             <button className="enhance-btn" onClick={handleEnhance}>Enhance</button>

//             <h2>Enhanced Text:</h2>
//             <p>{loading ? "Generating..." : enhancedText}</p>
//             {enhancedText && (
//                 <button onClick={() => handleSpeak(enhancedText, "en")}>🔊 Speak</button>
//             )}

//             <label>Select Language for Translation:</label>
//             <select value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)}>
//                 {languages.map((lang) => (
//                     <option key={lang.code} value={lang.code}>{lang.name}</option>
//                 ))}
//             </select>

//             <button className="translate-btn" onClick={handleTranslate}>Translate</button>

//             <h2>Translated Text:</h2>
//             <p>{loading ? "Translating..." : translatedText}</p>
//             {/* {translatedText && (
//                 <button onClick={() => handleSpeak(translatedText, selectedLanguage)}>🔊 Speak (Local)</button>
//             )} */}
//             {translatedText && (
//                 <button onClick={() => handleServerSpeak(translatedText, selectedLanguage)}>🔊 Speak (Server)</button>
//             )}
//         </div>
//     );
// };

// export default TextEnhancer;
