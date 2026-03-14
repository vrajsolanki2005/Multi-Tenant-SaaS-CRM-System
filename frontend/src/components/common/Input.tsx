import React, { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className="form-group">
        {label && <label className="label">{label}</label>}
        <input
          ref={ref}
          className={`input ${error ? 'input-error' : ''} ${className}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${props.id}-error` : undefined}
          {...props}
        />
        {error && (
          <span id={`${props.id}-error`} className="input-error-text" style={{ color: 'var(--red)', fontSize: 12, marginTop: 4 }}>
            {error}
          </span>
        )}
        {helperText && !error && (
          <span className="input-helper-text" style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 4 }}>
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
