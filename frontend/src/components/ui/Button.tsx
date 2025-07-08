import * as React from "react";

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "outline";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className = "", variant = "default", ...props }, ref) => {
        const base =
            "px-4 py-2 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2";
        const variants = {
            default: "bg-brand text-white hover:bg-indigo-700",
            outline:
                "border border-brand text-brand border-[1.5px] hover:bg-gray-100",
        };

        return (
            <button
                ref={ref}
                className={`${base} ${variants[variant]} ${className}`}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";
