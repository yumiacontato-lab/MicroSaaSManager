import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  MoreVertical,
  Edit,
  Trash2,
} from "lucide-react";
import { useState, useEffect } from "react";
import type { Subscription } from "@shared/schema";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AddEditSubscriptionDialog } from "@/components/AddEditSubscriptionDialog";
import { format, isPast, differenceInDays, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function Dashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | undefined>();

  // Redirect if not authenticated
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

  const { data: subscriptions = [], isLoading } = useQuery<Subscription[]>({
    queryKey: ["/api/subscriptions"],
    enabled: !!user,
  });

  if (authLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Calculate metrics
  const activeSubscriptions = subscriptions.filter(s => s.status === 'active');
  const totalMonthly = activeSubscriptions.reduce((sum, sub) => {
    const cost = sub.billingCycle === 'monthly'
      ? parseFloat(sub.monthlyCost || '0')
      : parseFloat(sub.annualCost || '0') / 12;
    return sum + cost;
  }, 0);

  const totalAnnual = totalMonthly * 12;

  // Expiring soon (within 7 days)
  const expiringSoon = activeSubscriptions.filter(sub => {
    const days = differenceInDays(new Date(sub.renewalDate), new Date());
    return days >= 0 && days <= 7;
  });

  // Spending by category for pie chart
  const categorySpending = activeSubscriptions.reduce((acc, sub) => {
    const cost = sub.billingCycle === 'monthly'
      ? parseFloat(sub.monthlyCost || '0')
      : parseFloat(sub.annualCost || '0') / 12;

    if (!acc[sub.category]) {
      acc[sub.category] = 0;
    }
    acc[sub.category] += cost;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(categorySpending).map(([name, value]) => ({
    name,
    value: parseFloat(value.toFixed(2)),
  }));

  // Monthly trend data (mock for now, would come from backend)
  const monthlyTrendData = [
    { month: 'Jan', spending: totalMonthly * 0.85 },
    { month: 'Fev', spending: totalMonthly * 0.90 },
    { month: 'Mar', spending: totalMonthly * 0.95 },
    { month: 'Abr', spending: totalMonthly },
  ];

  const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-chart-2/10 text-chart-2 border-chart-2/20';
      case 'trial': return 'bg-primary/10 text-primary border-primary/20';
      case 'cancelled': return 'bg-muted text-muted-foreground border-muted';
      default: return 'bg-muted text-muted-foreground border-muted';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Ativa';
      case 'trial': return 'Teste';
      case 'cancelled': return 'Cancelada';
      default: return status;
    }
  };

  const getCurrencySymbol = (currency: string | undefined) => {
    switch (currency) {
      case 'BRL': return 'R$';
      case 'USD':
      default: return '$';
    }
  };

  const handleEdit = (subscription: Subscription) => {
    setEditingSubscription(subscription);
    setDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingSubscription(undefined);
    setDialogOpen(true);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-3xl md:text-4xl">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Visão geral das suas assinaturas
          </p>
        </div>
        <Button onClick={handleAddNew} data-testid="button-add-subscription">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Assinatura
        </Button>
      </div>

      {/* Alert Banner for expiring subscriptions */}
      {expiringSoon.length > 0 && (
        <Card className="bg-amber-500/10 border-amber-500/20">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-amber-900 dark:text-amber-100">
                {expiringSoon.length} {expiringSoon.length === 1 ? 'assinatura' : 'assinaturas'} renovando em 7 dias
              </p>
              <p className="text-sm text-amber-800 dark:text-amber-200 mt-1">
                {expiringSoon.map(s => s.appName).join(', ')}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Mensal</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-mono text-2xl font-bold" data-testid="stat-monthly-total">
              ${totalMonthly.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {activeSubscriptions.length} assinaturas ativas
            </p>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Previsão Anual</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-mono text-2xl font-bold" data-testid="stat-annual-projection">
              ${totalAnnual.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Projeção para 12 meses
            </p>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assinaturas Ativas</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="stat-active-count">
              {activeSubscriptions.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              de {subscriptions.length} total
            </p>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expirando em Breve</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="stat-expiring-count">
              {expiringSoon.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Próximos 7 dias
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      {activeSubscriptions.length > 0 && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Gastos por Categoria</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${value}`} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tendência Mensal</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip formatter={(value) => `$${value}`} />
                  <Bar dataKey="spending" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Subscriptions Grid */}
      <div>
        <h2 className="font-heading font-semibold text-2xl mb-4">Suas Assinaturas</h2>
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        ) : subscriptions.length === 0 ? (
          <Card className="p-12">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-muted mx-auto flex items-center justify-center">
                <Plus className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Nenhuma assinatura ainda</h3>
                <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                  Comece adicionando sua primeira assinatura para acompanhar gastos e receber alertas
                </p>
              </div>
              <Button onClick={handleAddNew} data-testid="button-add-first-subscription">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Primeira Assinatura
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {subscriptions.map((subscription) => {
              const daysUntilRenewal = differenceInDays(new Date(subscription.renewalDate), new Date());
              const isExpiringSoon = daysUntilRenewal >= 0 && daysUntilRenewal <= 7;

              return (
                <Card key={subscription.id} className="hover-elevate relative" data-testid={`card-subscription-${subscription.id}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {subscription.logoUrl ? (
                          <img
                            src={subscription.logoUrl}
                            alt={subscription.appName}
                            className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                            onError={(e) => {
                              // Hide broken image and show fallback
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center flex-shrink-0 ${subscription.logoUrl ? 'hidden' : ''}`}>
                          <span className="text-base font-bold text-primary-foreground">
                            {subscription.appName[0].toUpperCase()}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <CardTitle className="text-base font-semibold truncate">
                            {subscription.appName}
                          </CardTitle>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(subscription)} data-testid={`button-edit-${subscription.id}`}>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" data-testid={`button-delete-${subscription.id}`}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="font-mono font-bold text-2xl">
                        {getCurrencySymbol(subscription.currency)}{subscription.billingCycle === 'monthly'
                          ? parseFloat(subscription.monthlyCost || '0').toFixed(2)
                          : (parseFloat(subscription.annualCost || '0') / 12).toFixed(2)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        por {subscription.billingCycle === 'monthly' ? 'mês' : 'mês (anual)'}
                      </p>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Renovação</span>
                        <span className={isExpiringSoon ? 'font-medium text-amber-600 dark:text-amber-500' : ''}>
                          {format(new Date(subscription.renewalDate), "dd MMM yyyy", { locale: ptBR })}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Categoria</span>
                        <span className="font-medium">{subscription.category}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Status</span>
                        <Badge className={getStatusColor(subscription.status)}>
                          {getStatusLabel(subscription.status)}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <AddEditSubscriptionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        subscription={editingSubscription}
      />
    </div>
  );
}
