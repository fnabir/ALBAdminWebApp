import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

type Props = {
  options: { value: string; label?: string; disabled?: boolean }[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  orientation?: "horizontal" | "vertical";
};

export function RadioButtonGroup({ options, orientation="horizontal", value, onChange, className }: Props) {
  return (
    <RadioGroup value={value} onValueChange={onChange} className={`flex ${orientation == "vertical" ? "flex-col" : "flex-wrap"} gap-2 items-center ${className}`}>
      {options.map((option, index) => (
        <div className="flex items-center space-x-1" key={index}>
          <RadioGroupItem
            value={option.value}
            id={`r${index}`}
            disabled={option.disabled}
          />
          <Label htmlFor={`r${index}`}>
            {option.label ?? option.value}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
}