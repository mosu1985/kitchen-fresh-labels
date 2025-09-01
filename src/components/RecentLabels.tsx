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
      return <Badge variant="destructive">Просрочен</Badge>;
    }
    if (isExpiringSoon(expiryDate)) {
      return <Badge variant="secondary" className="bg-warning text-warning-foreground">Скоро истечет</Badge>;
    }
    return <Badge variant="secondary" className="bg-success text-success-foreground">Свежий</Badge>;
  };

  return (
    <Card className="w-full">
      <CardHeader className="bg-muted">
        <CardTitle className="flex items-center gap-2">
          <HistoryIcon className="h-5 w-5" />
          Недавно напечатанные этикетки
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {labels.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            Этикетки еще не печатались
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
                    >
                      <PrinterIcon className="h-3 w-3 mr-1" />
                      Перепечатать
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onDelete(label.id)}
                    >
                      <TrashIcon className="h-3 w-3" />
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