import React from 'react';

export default function InputField({ value, type, onChange, placeholder, className = '', ...props }) {
    return (
        <input
            {...props}
            className={`block w-full border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm ${className}`}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
        />
    );
}