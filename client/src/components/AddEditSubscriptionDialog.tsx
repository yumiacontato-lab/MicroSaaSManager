import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { Subscription, InsertSubscription } from "@shared/schema";
import { insertSubscriptionSchema } from "@shared/schema";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface AddEditSubscriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subscription?: Subscription;
}

const categories = [
  "Comunicação",
  "Produtividade",
  "Desenvolvimento",
  "Design",
  "Marketing",
  "Analytics",
  "CRM",
  "Pagamento",
  "Hospedagem",
  "Segurança",
  "Outros",
];

const paymentMethods = [
  { value: "credit_card", label: "Cartão de Crédito" },
  { value: "debit_card", label: "Cartão de Débito" },
  { value: "bank_transfer", label: "Transferência Bancária" },
  { value: "paypal", label: "PayPal" },
  { value: "other", label: "Outro" },
];

const statuses = [
  { value: "active", label: "Ativa" },
  { value: "trial", label: "Teste" },
  { value: "cancelled", label: "Cancelada" },
];

const currencies = [
  { value: "USD", label: "Dólar (USD)", symbol: "$" },
  { value: "BRL", label: "Real (BRL)", symbol: "R$" },
];

export function AddEditSubscriptionDialog({
  open,
  onOpenChange,
  subscription,
}: AddEditSubscriptionDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [calendarOpen, setCalendarOpen] = useState(false);

  const form = useForm<z.input<typeof insertSubscriptionSchema>>({
    resolver: zodResolver(insertSubscriptionSchema),
    defaultValues: subscription ? {
      appName: subscription.appName,
      category: subscription.category,
      monthlyCost: subscription.monthlyCost || "",
      annualCost: subscription.annualCost || "",
      billingCycle: subscription.billingCycle,
      currency: subscription.currency || "USD",
      renewalDate: subscription.renewalDate ? format(new Date(subscription.renewalDate), "yyyy-MM-dd") : "",
      paymentMethod: subscription.paymentMethod,
      responsibleUserId: subscription.responsibleUserId,
      status: subscription.status,
      logoUrl: subscription.logoUrl || "",
      invoiceUrl: subscription.invoiceUrl || "",
      notes: subscription.notes || "",
    } : {
      appName: "",
      category: categories[0],
      monthlyCost: "",
      annualCost: "",
      billingCycle: "monthly",
      currency: "USD",
      renewalDate: "",
      paymentMethod: "credit_card",
      responsibleUserId: "", // Will be set from current user
      status: "active",
      logoUrl: "",
      invoiceUrl: "",
      notes: "",
    },
  });

  // Reset form when subscription changes (for edit mode)
  useEffect(() => {
    if (subscription) {
      form.reset({
        appName: subscription.appName,
        category: subscription.category,
        monthlyCost: subscription.monthlyCost || "",
        annualCost: subscription.annualCost || "",
        billingCycle: subscription.billingCycle,
        currency: subscription.currency || "USD",
        renewalDate: subscription.renewalDate ? format(new Date(subscription.renewalDate), "yyyy-MM-dd") : "",
        paymentMethod: subscription.paymentMethod,
        responsibleUserId: subscription.responsibleUserId,
        status: subscription.status,
        logoUrl: subscription.logoUrl || "",
        invoiceUrl: subscription.invoiceUrl || "",
        notes: subscription.notes || "",
      });
    } else {
      form.reset({
        appName: "",
        category: categories[0],
        monthlyCost: "",
        annualCost: "",
        billingCycle: "monthly",
        currency: "USD",
        renewalDate: "",
        paymentMethod: "credit_card",
        responsibleUserId: "",
        status: "active",
        logoUrl: "",
        invoiceUrl: "",
        notes: "",
      });
    }
  }, [subscription, form]);


  const mutation = useMutation({
    mutationFn: async (data: z.input<typeof insertSubscriptionSchema>) => {
      const url = subscription ? `/api/subscriptions/${subscription.id}` : "/api/subscriptions";
      const method = subscription ? "PUT" : "POST";
      await apiRequest(method, url, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/subscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: subscription ? "Assinatura atualizada" : "Assinatura criada",
        description: subscription
          ? "As alterações foram salvas com sucesso."
          : "Sua assinatura foi adicionada ao painel.",
      });
      onOpenChange(false);
      form.reset();
    },
    onError: (error) => {
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
        title: "Erro",
        description: error.message || "Ocorreu um erro ao salvar a assinatura.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.input<typeof insertSubscriptionSchema>) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="dialog-add-edit-subscription">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl">
            {subscription ? "Editar Assinatura" : "Adicionar Nova Assinatura"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="appName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da Aplicação</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Slack, Notion..." {...field} value={field.value ?? ""} data-testid="input-app-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value ?? ""}>
                      <FormControl>
                        <SelectTrigger data-testid="select-category">
                          <SelectValue placeholder="Selecione a categoria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="billingCycle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ciclo de Cobrança</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value ?? ""}>
                      <FormControl>
                        <SelectTrigger data-testid="select-billing-cycle">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="monthly">Mensal</SelectItem>
                        <SelectItem value="annual">Anual</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Moeda</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value ?? "USD"}>
                      <FormControl>
                        <SelectTrigger data-testid="select-currency">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {currencies.map((currency) => (
                          <SelectItem key={currency.value} value={currency.value}>
                            {currency.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={form.watch("billingCycle") === "monthly" ? "monthlyCost" : "annualCost"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {form.watch("billingCycle") === "monthly" ? "Custo Mensal" : "Custo Anual"}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                        value={field.value ?? ""}
                        data-testid="input-cost"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="renewalDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data de Renovação</FormLabel>
                    <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                            data-testid="button-renewal-date"
                          >
                            {field.value ? (
                              format(new Date(field.value), "PPP", { locale: undefined })
                            ) : (
                              <span>Selecione a data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) => {
                            field.onChange(date ? format(date, "yyyy-MM-dd") : "");
                            setCalendarOpen(false);
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Método de Pagamento</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value ?? ""}>
                      <FormControl>
                        <SelectTrigger data-testid="select-payment-method">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {paymentMethods.map((method) => (
                          <SelectItem key={method.value} value={method.value}>
                            {method.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value ?? ""}>
                    <FormControl>
                      <SelectTrigger data-testid="select-status">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {statuses.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="logoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL do Logo (opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} value={field.value ?? ""} data-testid="input-logo-url" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="invoiceUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL da Nota Fiscal (opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} value={field.value ?? ""} data-testid="input-invoice-url" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas (opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Informações adicionais sobre esta assinatura..."
                      className="resize-none"
                      rows={3}
                      {...field}
                      value={field.value ?? ""}
                      data-testid="textarea-notes"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={mutation.isPending}
                data-testid="button-cancel"
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={mutation.isPending} data-testid="button-save">
                {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {subscription ? "Salvar Alterações" : "Adicionar Assinatura"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
