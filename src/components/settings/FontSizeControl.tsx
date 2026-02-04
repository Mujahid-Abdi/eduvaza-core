import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFontSize, FontSize } from '@/hooks/useFontSize';
import { Type } from 'lucide-react';

export const FontSizeControl = () => {
  const { fontSize, setFontSize } = useFontSize();

  return (
    <div className="space-y-2">
      <Label htmlFor="fontSize" className="flex items-center gap-2">
        <Type className="h-4 w-4" />
        Font Size
      </Label>
      <Select value={fontSize} onValueChange={(value: FontSize) => setFontSize(value)}>
        <SelectTrigger id="fontSize">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="small">Small</SelectItem>
          <SelectItem value="medium">Medium (Default)</SelectItem>
          <SelectItem value="large">Large</SelectItem>
          <SelectItem value="extra-large">Extra Large</SelectItem>
        </SelectContent>
      </Select>
      <p className="text-xs text-muted-foreground">
        Adjust the font size across the entire website
      </p>
    </div>
  );
};
