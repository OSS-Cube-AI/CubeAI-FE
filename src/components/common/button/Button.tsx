import { ButtonHTMLAttributes } from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { mergeClassNames } from '../../../utils/mergeClassNames';
import ButtonLoader from './ButtonLoader';

export const ButtonVariants = cva(
  `
  flex items-center justify-center whitespace-nowrap transition-[color,box-shadow] [&_svg]:pointer-events-none shrink-0 [&_svg]:shrink-0
  disabled:cursor-not-allowed
  disabled:bg-gray-200
  disabled:text-gray-400
  `,
  {
    variants: {
      variant: {
        primary: 'bg-primary hover:bg-primary/90 rounded-md text-md',
      },
      size: {
        default: 'h-[3.4375rem] px-4 py-2 has-[>svg]:px-3',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  },
);

interface ButtonProps
  extends VariantProps<typeof ButtonVariants>,
    ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  className?: string;
  children: React.ReactNode;
}

export default function Button({
  variant,
  size,
  isLoading,
  className,
  children,
  onClick,
  disabled,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      type="button"
      className={mergeClassNames(ButtonVariants({ variant, size }), className)}
      onClick={onClick}
      disabled={isDisabled}
      aria-busy={isLoading}
      aria-disabled={isDisabled}
      {...props}
    >
      {isLoading ? <ButtonLoader /> : children}
    </button>
  );
}
