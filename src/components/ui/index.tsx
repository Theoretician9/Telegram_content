// src/components/ui/index.tsx
import React from 'react';

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = (props) => (
  <button {...props} />
);

export const Card: React.FC = ({ children, ...props }) => <div {...props}>{children}</div>;
export const CardHeader = Card;
export const CardTitle = Card;
export const CardDescription = Card;
export const CardContent = Card;
export const CardFooter = Card;

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input {...props} />
);
export const Label: React.FC<React.LabelHTMLAttributes<HTMLLabelElement>> = (props) => (
  <label {...props} />
);
export const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
  <textarea {...props} />
);

// Диалоги и вкладки можно заглушить так же:
export const Dialog: any = ({ children }: any) => <>{children}</>;
export const DialogTrigger = Dialog;
export const DialogContent = Dialog;
export const DialogHeader = Dialog;
export const DialogTitle = Dialog;
export const DialogDescription = Dialog;
export const DialogFooter = Dialog;

export const Tabs: any = ({ children }: any) => <>{children}</>;
export const TabsList = Tabs;
export const TabsTrigger = Tabs;
export const TabsContent = Tabs;

// селекты, бейджи, скелетоны и т.п.
export const Select: any = ({ children }: any) => <>{children}</>;
export const SelectTrigger = Select;
export const SelectValue = Select;
export const SelectContent = Select;
export const SelectItem = Select;

export const Badge: React.FC = (props) => <span {...props} />;
export const Skeleton: React.FC = () => <span className="animate-pulse">Loading...</span>;
