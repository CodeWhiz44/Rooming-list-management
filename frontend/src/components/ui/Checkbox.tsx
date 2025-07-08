import * as React from "react";

export interface CheckboxProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    checked: boolean;
    onCheckedChange: () => void;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
    ({ checked, onCheckedChange, className = "", ...props }, ref) => {
        return (
            <input
                type="checkbox"
                ref={ref}
                checked={checked}
                onChange={onCheckedChange}
                className={`w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 ${className}`}
                {...props}
            />
        );
    }
);
Checkbox.displayName = "Checkbox";
