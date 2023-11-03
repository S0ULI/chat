import { ButtonHTMLAttributes, FC } from 'react';

import { cva, type VariantProps } from 'class-variance-authority';
import Spinner from '@ui/Spinner';
import { cn } from '@/app/lib/utils';

const buttonVariants = cva(
  'active:scale-95 inline-flex items-center justify-center rounded-md text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'bg-slate-900 text-white hover:bg-slate-800',
        ghost: 'bg-transparent hover:text-slate-900 hover:bg-slate-200',
      },
      size: {
        default: 'h-10 py-2 px-4 ',
        sm: 'h-9 px-2',
        lg: 'h-11 px-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

const Button: FC<ButtonProps> = ({
  variant,
  size,
  className,
  isLoading,
  children,
  ...rest
}) => {
  return (
    <button
      className={cn(buttonVariants({variant, size, className}))}
      {...rest}
      disabled={isLoading}
    >
      {isLoading ? <Spinner /> : null}
      {children}
    </button>
  );
};

export default Button;
