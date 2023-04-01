import { useState, useEffect } from "react";

function getWindowDimensions() {
  let currentHeight = 0;
  let currentWidth = 0;
  if (typeof window !== "undefined") {
    const { innerWidth: width, innerHeight: height } = window;
    currentHeight = height;
    currentWidth = width;
  }

  return {
    currentHeight,
    currentWidth,
  };
}

export default function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getScreen = (screenWidth: number) => {
    if (screenWidth >= 1536) {
      return "2xl";
    } else if (screenWidth >= 1280) {
      return "xl";
    } else if (screenWidth >= 1024) {
      return "lg";
    } else if (screenWidth >= 768) {
      return "md";
    } else if (screenWidth >= 640) {
      return "sm";
    } else {
      return "sm";
    }
  };

  return getScreen(windowDimensions.currentWidth);
}
