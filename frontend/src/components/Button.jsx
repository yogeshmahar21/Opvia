// src/components/Button.jsx
import React from "react";

export default function Button({ children, onClick, type="button", disabled }) {
  return (
    <button type={type} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
