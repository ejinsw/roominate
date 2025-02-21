import { useState, useEffect } from "react";

interface Props {
  words: string[];
  className?: string;
}

export function TypeWriter({ words, className }: Props) {
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[index];
    const speed = isDeleting ? 50 : 100; // Typing speed

    if (!isDeleting && charIndex === currentWord.length) {
      setTimeout(() => setIsDeleting(true), 1000); // Pause before deleting
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setIndex((prev) => (prev + 1) % words.length);
    }

    const timeout = setTimeout(() => {
      setText(currentWord.substring(0, charIndex + (isDeleting ? -1 : 1)));
      setCharIndex((prev) => prev + (isDeleting ? -1 : 1));
    }, speed);

    return () => clearTimeout(timeout);
  }, [charIndex, index, isDeleting, words]);

  return (
    <>
      <span className={className}>
        {text}
        <span
          className="text-yellow-500 font-light font-sans"
          style={{
            animation: "blink 1s step-start infinite",
          }}
        >
          |
        </span>
      </span>
      <style>
        {`
      @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
      }
    `}
      </style>
    </>
  );
}
