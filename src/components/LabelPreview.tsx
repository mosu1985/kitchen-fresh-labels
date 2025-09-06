import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EyeIcon, CalendarIcon, ThermometerIcon } from "lucide-react";

interface LabelData {
  name: string;
  category: string;
  shelfLifeDays: number;
  temperature: string;
  productionDate: Date;
  expiryDate: Date;
}

interface LabelPreviewProps {
  labelData: LabelData | null;
}

export function LabelPreview({ labelData }: LabelPreviewProps) {
  if (!labelData) {
    return (
      <Card className="w-full max-w-md card-gradient fade-in border-0">
        <CardHeader className="bg-accent/50 border-b border-accent">
          <CardTitle className="flex items-center gap-3 text-lg font-semibold text-primary">
            <EyeIcon className="h-6 w-6" />
            Предварительный просмотр
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="text-center text-muted-foreground flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <EyeIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <p>Заполните форму для предварительного просмотра этикетки</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isExpiringSoon = (): boolean => {
    const today = new Date();
    const daysUntilExpiry = Math.ceil((labelData.expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 2;
  };

  return (
    <Card className="w-full max-w-md card-gradient fade-in border-0">
      <CardHeader className="bg-accent/50 border-b border-accent">
        <CardTitle className="flex items-center gap-3 text-lg font-semibold text-primary">
          <EyeIcon className="h-6 w-6" />
          Предварительный просмотр
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {/* Имитация термо-этикетки */}
        <div className="border-2 border-dashed border-primary/30 p-6 bg-white rounded-xl shadow-lg pulse-glow">
          <div className="space-y-3 text-center">
            {/* Название продукта */}
            <div className="font-bold text-lg border-b border-gray-300 pb-2">
              {labelData.name.toUpperCase()}
            </div>
            
            {/* Категория */}
            <div className="flex justify-center">
              <Badge variant="secondary">{labelData.category}</Badge>
            </div>
            
            {/* Даты */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="font-medium">Изготовлено:</span>
                <span>{formatDate(labelData.productionDate)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Время:</span>
                <span>{formatTime(labelData.productionDate)}</span>
              </div>
              <div className={`flex items-center justify-between font-bold ${isExpiringSoon() ? 'text-destructive' : 'text-foreground'}`}>
                <span>Годен до:</span>
                <span>{formatDate(labelData.expiryDate)}</span>
              </div>
            </div>
            
            {/* Условия хранения */}
            <div className="border-t border-gray-300 pt-2">
              <div className="flex items-center justify-center gap-1 text-xs">
                <ThermometerIcon className="h-3 w-3" />
                <span>Хранить при {labelData.temperature}</span>
              </div>
            </div>
            
            {/* Штрих-код имитация */}
            <div className="border-t border-gray-300 pt-2">
              <div className="flex justify-center space-x-1">
                {Array.from({ length: 8 }, (_, i) => (
                  <div key={i} className="w-1 h-6 bg-black" style={{ width: Math.random() > 0.5 ? '2px' : '1px' }} />
                ))}
              </div>
              <div className="text-xs mt-1 font-mono">
                {Math.random().toString().slice(2, 14)}
              </div>
            </div>
          </div>
        </div>
        
        {isExpiringSoon() && (
          <div className="mt-4 p-3 bg-warning/10 border border-warning/30 rounded-xl slide-up">
            <div className="text-warning text-sm font-semibold text-center flex items-center justify-center gap-2">
              <span className="text-lg">⚠️</span>
              Срок годности истекает через {Math.ceil((labelData.expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} дн.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}