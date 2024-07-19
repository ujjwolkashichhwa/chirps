import React from 'react';

export default function SelectField({ value, multiple, onChange, items, className, ...props }) {
    return (
        <select 
            {...props}
            multiple={multiple}
            value={multiple ? value : value[0]}
            onChange={onChange}  
            className={`mt-2 block w-full border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm ${className}`}
        >
            {items.map(item => (
                <option key={item.id} value={item.id}>{item.name}</option>
            ))}
        </select>
    );
}