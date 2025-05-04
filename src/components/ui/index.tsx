// src/components/ui/index.tsx
import React from 'react'

type Props = React.HTMLAttributes<HTMLElement>

// Кнопка
export const Button: React.FC<Props> = props => <button {...props} />

// Карточка
export const Card: React.FC<Props> = props => <div {...props} />
export const CardHeader: React.FC<Props> = props => <div {...props} />
export const CardTitle: React.FC<Props> = props => <h3 {...props} />
export const CardDescription: React.FC<Props> = props => <p {...props} />
export const CardContent: React.FC<Props> = props => <div {...props} />
export const CardFooter: React.FC<Props> = props => <div {...props} />

// Формы
export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = props => <input {...props} />
export const Label: React.FC<React.LabelHTMLAttributes<HTMLLabelElement>> = props => <label {...props} />
export const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = props => <textarea {...props} />

// Диалог
export const Dialog: React.FC<{ open?: boolean; onOpenChange?: (open: boolean) => void }> = ({ children }) => <>{children}</>
export const DialogTrigger = (props: Props) => <button {...props} />
export const DialogContent: React.FC<Props> = props => <div {...props} />
export const DialogHeader: React.FC<Props> = props => <header {...props} />
export const DialogTitle: React.FC<Props> = props => <h2 {...props} />
export const DialogDescription: React.FC<Props> = props => <p {...props} />
export const DialogFooter: React.FC<Props> = props => <footer {...props} />

// Вкладки
export const Tabs: React.FC<Props> = props => <div {...props} />
export const TabsList: React.FC<Props> = props => <div {...props} />
export const TabsTrigger: React.FC<Props> = props => <button {...props} />
export const TabsContent: React.FC<Props> = props => <div {...props} />

// Select
export const Select: React.FC<{ value?: string; onValueChange?: (val: string) => void }> = props => <select {...(props as any)} />
export const SelectTrigger: React.FC<Props> = props => <span {...props} />
export const SelectValue: React.FC<Props> = props => <span {...props} />
export const SelectContent: React.FC<Props> = props => <div {...props} />
export const SelectItem: React.FC<{ value: string }> = props => <div {...props} />

// Остальное
export const Badge: React.FC<Props> = props => <span {...props} />
export const Skeleton: React.FC<Props> = props => <div {...props} />
