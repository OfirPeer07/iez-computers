import React, { useState, useCallback } from "react";
import "./MainPage.css";
import cyberImage from "./Cyber.mp4";
import itImage from "./IT.mp4";
import backgroundVideo from "./background.mp4";
import Title from "./Title";
import CTFGame from "../CTFGame/CTFGame"; // ✅ Import CTFGame

const MainPage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isMoving, setIsMoving] = useState(false);
  const [gameStarted, setGameStarted] = useState(false); // ✅ Track if the game has started

  const navigateTo = (path) => {
    window.location.href = path;
  };

  const handleImageClick = useCallback(
    (imageType) => {
      if (isMoving) return;

      setIsMoving(true);
      setSelectedImage(imageType);

      setTimeout(() => {
        navigateTo(imageType === "IT" ? "/information-technology" : "/cyber");
        setIsMoving(false);
      }, 1000);
    },
    [isMoving]
  );

  const startCTFGame = () => {
    setGameStarted(true); // Hide content and show the game
  };

  const closeCTFGame = () => {
    setGameStarted(false); // Hide the game and show previous content
  };

  return (
    <div className="main-page">
      <video
        className="background-video"
        src={backgroundVideo}
        autoPlay
        loop
        muted
      />
      <Title />

      {/* Show the CTF button only when the game has not started */}
      {!gameStarted && (
        <button className="play-ctf-button" onClick={startCTFGame}>
          Play CTF Challenge
        </button>
      )}

      {/* Show the Close Game button when the game starts */}
      {gameStarted && (
        <button className="close-ctf-button" onClick={closeCTFGame}>
          Close Game
        </button>
      )}

      {/* Hide other content when the game has started */}
      {!gameStarted && (
        <main className="cyber-it-navigation">
          <section
            className={`image-container-wrapper-it ${
              selectedImage === "IT" ? "selected" : ""
            }`}
          >
            <div
              className={`image-container ${
                selectedImage === "IT" ? "move-right no-hover" : ""
              } ${selectedImage && selectedImage !== "IT" ? "blackout" : ""}`}
              role="button"
              aria-label="Navigate to IT Main Page"
              aria-live="polite"
              onClick={() => handleImageClick("IT")}
            >
              <video
                className="navigation-video"
                src={itImage}
                autoPlay
                loop
                muted
                style={{
                  maxWidth: "100%",
                  maxHeight: "125%",
                  objectFit: "contain",
                  width: "auto",
                  height: "auto",
                }}
              />
            </div>
            <div
              className={`title-box ${
                selectedImage === "IT"
                  ? "move-right"
                  : selectedImage === "Cyber"
                  ? "move-left"
                  : "reset"
              }`}
            >
              <h2 className="photo-title">IT</h2>
              <p className="photo-subtitle">
                Innovate with cutting-edge IT solutions.
              </p>
            </div>
          </section>

          <section
            className={`image-container-wrapper-cyber ${
              selectedImage === "Cyber" ? "selected" : ""
            }`}
          >
            <div
              className={`image-container ${
                selectedImage === "Cyber" ? "move-left no-hover" : ""
              } ${selectedImage && selectedImage !== "Cyber" ? "blackout" : ""}`}
              role="button"
              aria-label="Navigate to Cyber Main Page"
              aria-live="polite"
              onClick={() => handleImageClick("Cyber")}
            >
              <video
                className="navigation-video"
                src={cyberImage}
                autoPlay
                loop
                muted
                style={{
                  maxWidth: "100%",
                  maxHeight: "125%",
                  objectFit: "contain",
                  width: "auto",
                  height: "auto",
                }}
              />
            </div>
            <div
              className={`title-box ${
                selectedImage === "Cyber"
                  ? "move-left"
                  : selectedImage === "IT"
                  ? "move-right"
                  : "reset"
              }`}
            >
              <h2 className="photo-title">Cyber</h2>
              <p className="photo-subtitle">
                Secure the future with advanced cybersecurity.
              </p>
            </div>
          </section>
        </main>
      )}

      {/* Show the CTF game when the game starts */}
      {gameStarted && (
        <div className="ctf-game-container">
          <CTFGame />
        </div>
      )}
    </div>
  );
};

export default MainPage;
