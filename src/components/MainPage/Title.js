import { useState, useEffect, useRef } from "react";
import "./Title.css";

const Title = () => {
  const texts = ["Welcome", "Welcome to IEZ", "Welcome to IEZ Website"];
  const [currentText, setCurrentText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const typingTimeout = useRef(null);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // On mobile, just show the final text without animation
    if (isMobile) {
      setCurrentText("Welcome to IEZ Website");
      return;
    }

    const currentWord = texts[textIndex];
    const isWordComplete = charIndex === currentWord.length;
    const isWordEmpty = charIndex === 0;
    
    let typingSpeed = isDeleting ? 50 : 100;
    let delay = isWordComplete ? 1000 : isWordEmpty ? 500 : typingSpeed;

    typingTimeout.current = setTimeout(() => {
      setCurrentText(currentWord.substring(0, charIndex + (isDeleting ? -1 : 1)));
      setCharIndex((prev) => prev + (isDeleting ? -1 : 1));

      if (isWordComplete && !isDeleting) {
        setIsDeleting(true);
      } else if (isWordEmpty && isDeleting) {
        setIsDeleting(false);
        setTextIndex((prev) => (prev + 1) % texts.length);
      }
    }, delay);

    return () => clearTimeout(typingTimeout.current);
  }, [charIndex, isDeleting, textIndex, texts, isMobile]);

  return <h1 className="typing-title">{currentText}<span className="cursor">|</span></h1>;
};

export default Title;
