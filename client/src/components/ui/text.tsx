import { cn } from '@/lib/utils'
import { cva, VariantProps } from 'class-variance-authority'
import { ComponentProps } from 'react'

export const text = cva(['w-fit'], {
  variants: {
    variant: {
      heading1: ['font-primary', 'text-3xl'],
      heading1bold: ['font-primary', 'text-3xl', 'font-bold'],
      heading1semibold: ['font-primary', 'text-3xl', 'font-semibold'],
      heading2: ['font-primary', 'text-2xl'],
      heading2bold: ['font-primary', 'text-2xl', 'font-bold'],
      heading2ghost: ['font-primary', 'text-2xl', 'opacity-50'],
      heading2semibold: ['font-primary', 'text-2xl', 'font-semibold'],
      heading3bold: ['font-primary', 'text-xl', 'font-bold'],
      heading3ghost: ['font-primary', 'text-xl', 'opacity-80'],
      heading4bold: ['font-primary', 'text-lg', 'font-bold'],
      heading4ghost: ['font-primary', 'text-lg', 'opacity-50'],
      body: ['font-secondary', 'text-lg', 'font-light'],
      bodybold: ['font-secondary', 'text-lg', 'font-semibold'],
      label: ['font-secondary', 'text-lg', 'opacity-70', 'font-light'],
      footer: ['font-primary', 'font-bold', 'text-xs'],
    },
    style: {
      underline: [
        'relative',
        'after:absolute',
        'after:bottom-0',
        'after:left-0',
        "after:content-['']",
        'after:border-b-2',
        'after:border-rose-300',
        'after:w-0',
        'after:duration-300',
        'hover:after:w-full',
        'hover:cursor-pointer',
      ],
    },
    defaultVariants: {
      variant: 'body',
    },
  },
})

export type TextProps = ComponentProps<'div'> & VariantProps<typeof text>

export const Text = ({
  className,
  variant,
  style,
  children,
  ...props
}: TextProps) => {
  return (
    <div className={cn(text({ variant, className, style }))} {...props}>
      {children}
    </div>
  )
}
