export default function Input({ type = "text", className = '', ...props }) {
  return (
    <input type={type} className={`form-input ${className}`} {...props} />
  );
}
