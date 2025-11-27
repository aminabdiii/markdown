"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";

export const ContactUsFormSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(30, "First name cannot be longer than 30 characters"),

  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(30, "Last name cannot be longer than 30 characters"),

  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username cannot be longer than 20 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and _"
    ),

  email: z.string().email("Invalid email address"),

  phoneNumber: z
    .string() // string to preserve leading zeros
    .regex(/^\+?\d{10,15}$/, "Invalid phone number"),

  message: z
    .string()
    .min(5, "Message must be at least 5 characters")
    .max(500, "Message cannot be longer than 500 characters"),
});
type FormType = z.infer<typeof ContactUsFormSchema>;

function FormComponent() {
  const form = useForm<FormType>({
    resolver: zodResolver(ContactUsFormSchema),
  });

  const onSubmit = (formValues: FieldValues) => {
    console.log(formValues);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-2 gap-4 items-start w-sm [&_p[data-slot=form-message]]:line-clamp-1">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="firstName">firstName</FormLabel>
              <FormControl>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="firstName"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="lastName">lastName</FormLabel>
              <FormControl>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="lastName"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel htmlFor="username">username</FormLabel>
              <FormControl>
                <Input
                  id="username"
                  type="text"
                  placeholder="username"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="email">email</FormLabel>
              <FormControl>
                <Input id="email" type="email" placeholder="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="phoneNumber">phoneNumber</FormLabel>
              <FormControl>
                <Input
                  id="phoneNumber"
                  type="text"
                  placeholder="phoneNumber"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="message">message</FormLabel>
              <FormControl>
                <Input
                  id="message"
                  type="text"
                  placeholder="message"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="cursor-pointer col-span-full" type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
}

export default FormComponent;
