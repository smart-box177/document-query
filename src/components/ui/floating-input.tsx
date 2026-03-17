import * as React from "react"
import { cn } from "@/lib/utils"

export interface FloatingInputProps extends React.ComponentProps<"input"> {
    label: string;
}

const FloatingInput = React.forwardRef<HTMLInputElement, FloatingInputProps>(
    ({ className, type, label, id, ...props }, ref) => {
        // Generate a unique ID if none is provided to link input and label
        const inputId = id || React.useId()

        return (
            <div className="relative w-full">
                <input
                    id={inputId}
                    type={type}
                    className={cn(
                        "peer file:text-foreground placeholder:text-transparent selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-12 w-full min-w-0 rounded-md border bg-transparent px-3 pt-5 pb-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                        className
                    )}
                    placeholder={label}
                    ref={ref}
                    {...props}
                />
                <label
                    htmlFor={inputId}
                    className={cn(
                        "absolute text-sm text-muted-foreground duration-300 transform -translate-y-3 scale-75 top-[14px] z-10 origin-[0] left-3 pointer-events-none",
                        "peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0",
                        "peer-focus:scale-75 peer-focus:-translate-y-3",
                        "peer-focus:text-foreground",
                        "bg-background/80 px-1 -ml-1 backdrop-blur-sm rounded peer-focus:bg-transparent peer-focus:px-0 peer-focus:ml-0 peer-placeholder-shown:bg-transparent"
                    )}
                >
                    {label}
                </label>
            </div>
        )
    }
)
FloatingInput.displayName = "FloatingInput"

export { FloatingInput }
