import React from 'react';
import { Controller } from 'react-hook-form';
import {
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface FormFieldComponentProps {
  name: string;
  control: any;
  label: string;
  placeholder: string;
  type: string;
}

const FormFieldComponent: React.FC<FormFieldComponentProps> = ({
  name,
  control,
  label,
  placeholder,
  type,
}) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input placeholder={placeholder} type={type} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormFieldComponent;
