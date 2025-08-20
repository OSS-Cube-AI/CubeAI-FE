import { forwardRef, InputHTMLAttributes } from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { mergeClassNames } from '../../../utils/mergeClassNames';

export const InputVariants = cva(
  `
  flex items-center outline-none
  w-full min-w-0 h-9 rounded-[3px] px-3 py-1 transition-colors bg-transparent ring-1 ring-gray-300
  disabled:pointer-events-none disabled:cursor-not-allowed
  `,
  {
    variants: {
      variant: {
        default: 'focus:ring-black',
        error: 'ring-red-500 bg-red-50 focus:ring-red-500',
        readOnly: 'pointer-events-none ring-0 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

interface InputProps
  extends VariantProps<typeof InputVariants>,
    InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  errorMessage?: string;
  className?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, description, errorMessage, variant, className, ...props }, ref) => {
    const isError = !!errorMessage?.trim();
    const displayInputType = isError ? 'error' : variant;

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label
            className={`text-sm ${variant === 'readOnly' ? 'text-gray-400' : 'text-gray-700'}`}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={mergeClassNames(InputVariants({ variant: displayInputType }), className)}
          {...props}
        />
        <p className={`text-sm ${isError ? 'text-red-500' : 'text-gray-400'}`}>
          {isError ? errorMessage : description}
        </p>
      </div>
    );
  },
);
