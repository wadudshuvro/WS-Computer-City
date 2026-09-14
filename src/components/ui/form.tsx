import * as React from 'react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

/**
 * Lightweight form layout primitives (no react-hook-form required).
 * Use with Input / Select / Textarea + Label for consistent CMS/storefront fields.
 */

const Form = React.forwardRef<HTMLFormElement, React.FormHTMLAttributes<HTMLFormElement>>(
  ({ className, ...props }, ref) => (
    <form ref={ref} className={cn('space-y-4', className)} {...props} />
  )
);
Form.displayName = 'Form';

const FormField = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('space-y-1.5', className)} {...props} />
  )
);
FormField.displayName = 'FormField';

const FormLabel = React.forwardRef<
  React.ElementRef<typeof Label>,
  React.ComponentPropsWithoutRef<typeof Label> & { required?: boolean }
>(({ className, children, required, ...props }, ref) => (
  <Label ref={ref} className={cn(className)} {...props}>
    {children}
    {required ? <span className="ml-0.5 text-destructive">*</span> : null}
  </Label>
));
FormLabel.displayName = 'FormLabel';

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-xs text-muted-foreground', className)} {...props} />
));
FormDescription.displayName = 'FormDescription';

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  if (!children) return null;
  return (
    <p ref={ref} className={cn('text-xs font-medium text-destructive', className)} {...props}>
      {children}
    </p>
  );
});
FormMessage.displayName = 'FormMessage';

const FormRow = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('grid grid-cols-1 gap-4 md:grid-cols-2', className)}
      {...props}
    />
  )
);
FormRow.displayName = 'FormRow';

export { Form, FormField, FormLabel, FormDescription, FormMessage, FormRow };
