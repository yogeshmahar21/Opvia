// src/components/Input.jsx
import React from "react";

export default function Input({ label, type="text", value, onChange, placeholder, ...rest }) {
  return (
    <div>
      {label && <label>{label}</label>}
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} {...rest} />
    </div>
  );
}
