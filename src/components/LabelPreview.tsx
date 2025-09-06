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
      <Card className="w-full max-w-md card-gradient fade-in">
        <CardHeader className="glass-effect relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary-glow/10"></div>
          <CardTitle className="flex items-center gap-3 text-lg font-semibold relative z-10">
            <div className="p-2 rounded-lg bg-primary/20 glass-effect">
              <EyeIcon className="h-5 w-5 text-primary" />
            </div>
            Предварительный просмотр
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="text-center text-muted-foreground flex flex-col items-center gap-6">
            <div className="w-20 h-20 rounded-2xl surface-tech flex items-center justify-center pulse-glow">
              <EyeIcon className="h-10 w-10 text-primary" />
            </div>
            <p className="text-foreground/70">Заполните форму для предварительного просмотра этикетки</p>
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
    <Card className="w-full max-w-md card-gradient fade-in">
      <CardHeader className="glass-effect relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary-glow/10"></div>
        <CardTitle className="flex items-center gap-3 text-lg font-semibold relative z-10">
          <div className="p-2 rounded-lg bg-primary/20 glass-effect">
            <EyeIcon className="h-5 w-5 text-primary" />
          </div>
          Предварительный просмотр
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {/* Имитация термо-этикетки с современным дизайном */}
        <div className="relative p-6 surface-tech rounded-2xl border-2 border-primary/30 pulse-glow overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-card to-card/80"></div>
          <div className="relative z-10 space-y-4 text-center">
            {/* Название продукта */}
            <div className="font-bold text-xl text-primary border-b border-primary/20 pb-3">
              {labelData.name.toUpperCase()}
            </div>
            
            {/* Категория */}
            <div className="flex justify-center">
              <Badge className="glass-effect bg-primary/20 text-primary border-primary/30 font-semibold">
                {labelData.category}
              </Badge>
            </div>
            
            {/* Даты в современном стиле */}
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between p-2 glass-effect rounded-lg">
                <span className="font-medium text-foreground/80">Изготовлено:</span>
                <span className="font-semibold text-primary">{formatDate(labelData.productionDate)}</span>
              </div>
              <div className="flex items-center justify-between p-2 glass-effect rounded-lg">
                <span className="font-medium text-foreground/80">Время:</span>
                <span className="font-semibold text-primary">{formatTime(labelData.productionDate)}</span>
              </div>
              <div className={`flex items-center justify-between p-2 glass-effect rounded-lg ${isExpiringSoon() ? 'border border-destructive/30' : ''}`}>
                <span className="font-bold text-foreground">Годен до:</span>
                <span className={`font-bold ${isExpiringSoon() ? 'text-destructive' : 'text-success'}`}>
                  {formatDate(labelData.expiryDate)}
                </span>
              </div>
            </div>
            
            {/* Условия хранения */}
            <div className="border-t border-primary/20 pt-3">
              <div className="flex items-center justify-center gap-2 p-2 glass-effect rounded-lg">
                <ThermometerIcon className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Хранить при {labelData.temperature}</span>
              </div>
            </div>
            
            {/* Штрих-код в стиле tech */}
            <div className="border-t border-primary/20 pt-3">
              <div className="flex justify-center space-x-1 mb-2">
                {Array.from({ length: 12 }, (_, i) => (
                  <div 
                    key={i} 
                    className="bg-foreground rounded-sm" 
                    style={{ 
                      width: Math.random() > 0.5 ? '3px' : '2px',
                      height: '24px'
                    }} 
                  />
                ))}
              </div>
              <div className="text-xs font-mono text-muted-foreground bg-muted/20 px-2 py-1 rounded">
                {Math.random().toString().slice(2, 14)}
              </div>
            </div>
          </div>
        </div>
        
        {isExpiringSoon() && (
          <div className="mt-4 p-4 glass-effect border border-warning/50 rounded-xl slide-up bg-warning/10">
            <div className="text-warning text-sm font-semibold text-center flex items-center justify-center gap-3">
              <span className="text-2xl">⚠️</span>
              <span>Срок годности истекает через {Math.ceil((labelData.expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} дн.</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}