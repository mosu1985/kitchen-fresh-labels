import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { HistoryIcon, PrinterIcon, TrashIcon } from "lucide-react";

interface PrintedLabel {
  id: string;
  name: string;
  category: string;
  productionDate: Date;
  expiryDate: Date;
  printedAt: Date;
}

interface RecentLabelsProps {
  labels: PrintedLabel[];
  onReprint: (label: PrintedLabel) => void;
  onDelete: (id: string) => void;
}

export function RecentLabels({ labels, onReprint, onDelete }: RecentLabelsProps) {
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isExpired = (expiryDate: Date): boolean => {
    return new Date() > expiryDate;
  };

  const isExpiringSoon = (expiryDate: Date): boolean => {
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 2 && daysUntilExpiry > 0;
  };

  const getStatusBadge = (expiryDate: Date) => {
    if (isExpired(expiryDate)) {
      return <Badge className="status-expired font-medium">Просрочен</Badge>;
    }
    if (isExpiringSoon(expiryDate)) {
      return <Badge className="status-warning font-medium">Скоро истечет</Badge>;
    }
    return <Badge className="status-fresh font-medium">Свежий</Badge>;
  };

  return (
    <Card className="w-full card-gradient fade-in border-0">
      <CardHeader className="bg-accent/50 border-b border-accent">
        <CardTitle className="flex items-center gap-3 text-lg font-semibold text-primary">
          <HistoryIcon className="h-6 w-6" />
          Недавно напечатанные этикетки
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {labels.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <HistoryIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <p>Этикетки еще не печатались</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Продукт</TableHead>
                <TableHead>Категория</TableHead>
                <TableHead>Годен до</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Напечатано</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {labels.map((label) => (
                <TableRow key={label.id}>
                  <TableCell className="font-medium">{label.name}</TableCell>
                  <TableCell>{label.category}</TableCell>
                  <TableCell>{formatDate(label.expiryDate)}</TableCell>
                  <TableCell>{getStatusBadge(label.expiryDate)}</TableCell>
                  <TableCell>{formatDate(label.printedAt)}</TableCell>
                   <TableCell className="text-right space-x-2">
                     <Button
                       size="sm"
                       variant="outline"
                       onClick={() => onReprint(label)}
                       className="hover:bg-primary/10 hover:text-primary hover:border-primary transition-all"
                     >
                       <PrinterIcon className="h-4 w-4 mr-2" />
                       Перепечатать
                     </Button>
                     <Button
                       size="sm"
                       variant="outline"
                       onClick={() => onDelete(label.id)}
                       className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive transition-all"
                     >
                       <TrashIcon className="h-4 w-4" />
                     </Button>
                   </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}