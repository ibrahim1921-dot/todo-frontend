import React from "react";
import "./InputField.css";

const InputField = ({
  label,
  type,
  name,
  value,
  onChange,
  error,
  placeholder,
  icon,
  showPasswordToggle,
  showPassword,
  onTogglePassword,
  disabled,
}) => {
  return (
    <div className="input-field">
      <label htmlFor={name}>{label}</label>
      <div className="input-wrapper">
        {icon && <span className="input-icon">{icon}</span>}
        <input
          id={name}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={error ? "input-error" : ""}
          disabled={disabled}
        />
        {showPasswordToggle && (
          <button
            type="button"
            className="password-toggle"
            onClick={onTogglePassword}
            tabIndex={-1}
          >
            {showPassword ? "👁️" : "👁️‍🗨️"}
          </button>
        )}
      </div>
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};

export default InputField;
