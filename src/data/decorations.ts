export interface DecorationConfig {
  src: string;
  width: string;
  corner: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  offsetX: string;
  offsetY: string;
}

export const heroPin: DecorationConfig = {
  src: "/assets/icons/icon1.png",
  width: "clamp(3rem, 5vw, 4.5rem)",
  corner: "top-right",
  offsetX: "-0.75rem",
  offsetY: "-1rem",
};

export const leftDecoration = {
  src: "/assets/icons/icon3.png",
  width: "clamp(12rem, 18vw, 20rem)",
  top: "0",
  offset: "0.75rem",
};