import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Props = {
  title?: string
  options: {value:string, label?: string, disabled?: boolean}[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

export function ButtonGroup({ title, options, value, onChange, className }: Props) {
  return (
    <div className={`md:inline-flex space-x-2 items-center pr-2 ${className}`}>
      {title && <div className="text-primary text-sm">{title}</div>}
      <Tabs value={value} onValueChange={onChange}>
        <TabsList className="inline-flex rounded-md bg-muted p-1 shadow-sm">
          {options.map((option) => (
            <TabsTrigger key={option.value} value={option.value} disabled={option.disabled ?? false}>
              {option.label ?? option.value}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  )
}