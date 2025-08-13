'use client';
import { ComponentProps, forwardRef } from 'react';
import clsx from 'clsx';

export const Button = forwardRef<HTMLButtonElement, ComponentProps<'button'> & { variant?: 'primary'|'ghost' }>(
  ({ className, variant='primary', ...props }, ref) => (
    <button
      ref={ref}
      className={clsx(variant === 'primary' ? 'btn' : 'btn-ghost', className)}
      {...props}
    />
  )
);
Button.displayName = 'Button';

export const Input = forwardRef<HTMLInputElement, ComponentProps<'input'>>(
  ({ className, ...props }, ref) => (
    <input ref={ref} className={clsx('input', className)} {...props} />
  )
);
Input.displayName = 'Input';

export function Card(props: ComponentProps<'div'>) {
  return <div {...props} className={clsx('card', props.className)} />;
}
export function CardHeader(props: ComponentProps<'div'>) {
  return <div {...props} className={clsx('card-header', props.className)} />;
}
export function CardBody(props: ComponentProps<'div'>) {
  return <div {...props} className={clsx('card-body', props.className)} />;
}
