import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquare, Check, CheckCheck, Eye, AlertCircle, Send, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { WhatsappAlert } from "@shared/schema";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function Alerts() {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!authLoading && !user) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [user, authLoading, toast]);

  const { data: alerts = [], isLoading } = useQuery<WhatsappAlert[]>({
    queryKey: ["/api/alerts"],
    enabled: !!user,
  });

  const sendTestMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/alerts/send-test", {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/alerts"] });
      toast({
        title: "Alerta de teste enviado",
        description: "Verifique seu WhatsApp para confirmar o recebimento.",
      });
    },
    onError: (error: any) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Não autenticado",
          description: "Você foi desconectado. Redirecionando...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Erro ao enviar alerta",
        description: error.message || "Verifique se seu número de telefone está configurado.",
        variant: "destructive",
      });
    },
  });

  if (authLoading || !user) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <Check className="h-4 w-4 text-muted-foreground" />;
      case 'delivered':
        return <CheckCheck className="h-4 w-4 text-chart-2" />;
      case 'read':
        return <Eye className="h-4 w-4 text-primary" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return <MessageSquare className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-muted text-muted-foreground border-muted';
      case 'delivered':
        return 'bg-chart-2/10 text-chart-2 border-chart-2/20';
      case 'read':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'failed':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      default:
        return 'bg-muted text-muted-foreground border-muted';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'sent':
        return 'Enviado';
      case 'delivered':
        return 'Entregue';
      case 'read':
        return 'Lido';
      case 'failed':
        return 'Falhou';
      default:
        return status;
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-3xl md:text-4xl">Alertas WhatsApp</h1>
          <p className="text-muted-foreground mt-1">
            Histórico de notificações enviadas
          </p>
        </div>
        <Button
          onClick={() => sendTestMutation.mutate()}
          disabled={sendTestMutation.isPending}
          data-testid="button-send-test-alert"
        >
          {sendTestMutation.isPending ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Send className="h-4 w-4 mr-2" />
          )}
          Enviar Alerta de Teste
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Registro de Alertas</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24" />
              ))}
            </div>
          ) : alerts.length === 0 ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-full bg-muted mx-auto flex items-center justify-center">
                <MessageSquare className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Nenhum alerta enviado ainda</h3>
                <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                  Quando enviamos alertas de renovação via WhatsApp, eles aparecerão aqui
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr className="text-left text-sm text-muted-foreground">
                    <th className="pb-3 font-medium">Assinatura</th>
                    <th className="pb-3 font-medium">Destinatário</th>
                    <th className="pb-3 font-medium">Mensagem</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Enviado em</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {alerts.map((alert) => (
                    <tr key={alert.id} className="hover-elevate" data-testid={`row-alert-${alert.id}`}>
                      <td className="py-4">
                        <span className="font-medium" data-testid={`text-alert-subscription-${alert.id}`}>
                          {alert.subscriptionId}
                        </span>
                      </td>
                      <td className="py-4">
                        <span className="text-sm" data-testid={`text-alert-phone-${alert.id}`}>{alert.phoneNumber}</span>
                      </td>
                      <td className="py-4">
                        <div className="text-sm text-muted-foreground max-w-md truncate" data-testid={`text-alert-message-${alert.id}`}>
                          {alert.message}
                        </div>
                      </td>
                      <td className="py-4">
                        <Badge className={getStatusColor(alert.status)} data-testid={`badge-alert-status-${alert.id}`}>
                          <span className="flex items-center gap-1.5">
                            {getStatusIcon(alert.status)}
                            {getStatusLabel(alert.status)}
                          </span>
                        </Badge>
                      </td>
                      <td className="py-4">
                        {alert.sentAt ? (
                          <span className="text-sm" data-testid={`text-alert-date-${alert.id}`}>
                            {format(new Date(alert.sentAt), "dd MMM yyyy HH:mm", { locale: ptBR })}
                          </span>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
