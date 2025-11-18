
import React from 'react';

interface CheckboxProps {
    id: string;
    label: string;
    checked: boolean;
    onChange: () => void;
}

const Checkbox: React.FC<CheckboxProps> = ({ id, label, checked, onChange }) => {
    return (
        <label htmlFor={id} className="flex items-center space-x-3 cursor-pointer text-sm">
            <div className="relative">
                <input
                    type="checkbox"
                    id={id}
                    checked={checked}
                    onChange={onChange}
                    className="sr-only"
                />
                <div className={`w-5 h-5 rounded border-2 transition-all duration-200 ${checked ? 'bg-[var(--primary-color)] border-[var(--primary-color)]' : 'bg-transparent border-[var(--border-color)]'}`}></div>
                {checked && (
                    <svg className="absolute w-5 h-5 top-0 left-0 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                )}
            </div>
            <span>{label}</span>
        </label>
    );
};

export default Checkbox;
