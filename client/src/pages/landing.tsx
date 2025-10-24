import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  BarChart3,
  Bell,
  FileText,
  Lock,
  MessageSquare,
  Users,
  Zap,
  CheckCircle2,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-primary" />
            <span className="font-heading font-bold text-xl">Gerente de SaaS</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button asChild data-testid="button-login">
              <a href="/api/login">Entrar</a>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl leading-tight">
                Você sabe quanto gasta com softwares por mês?
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                O Gerente de SaaS organiza suas assinaturas, envia alertas — inclusive no WhatsApp — e ajuda você a cortar desperdícios.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" asChild data-testid="button-start-trial">
                  <a href="/api/login">
                    Comece grátis por 14 dias
                  </a>
                </Button>
                <Button size="lg" variant="outline" data-testid="button-see-demo">
                  Ver demonstração
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                ✓ Não precisa cartão de crédito • ✓ 14 dias de teste grátis
              </p>
            </div>
            <div className="relative">
              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Total mensal</span>
                      <span className="font-mono font-bold text-2xl text-primary">$1,247</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Card className="p-4 space-y-2 hover-elevate">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
                            <BarChart3 className="h-4 w-4 text-primary" />
                          </div>
                          <span className="text-xs font-medium">Slack</span>
                        </div>
                        <p className="font-mono font-semibold">$129/mês</p>
                      </Card>
                      <Card className="p-4 space-y-2 hover-elevate">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-md bg-chart-2/10 flex items-center justify-center">
                            <FileText className="h-4 w-4 text-chart-2" />
                          </div>
                          <span className="text-xs font-medium">Notion</span>
                        </div>
                        <p className="font-mono font-semibold">$80/mês</p>
                      </Card>
                    </div>
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 flex items-start gap-2">
                      <Bell className="h-4 w-4 text-amber-600 dark:text-amber-500 mt-0.5 flex-shrink-0" />
                      <p className="text-xs">
                        <span className="font-semibold">3 renovações</span> nos próximos 7 dias
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="font-heading font-semibold text-3xl md:text-4xl">
              Tudo que você precisa para gerenciar assinaturas
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Funcionalidades pensadas para startups, agências e pequenas empresas
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6 space-y-4 hover-elevate">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Alertas no WhatsApp</h3>
              <p className="text-muted-foreground text-sm">
                Receba lembretes automáticos 7 dias antes de cada renovação direto no seu WhatsApp
              </p>
            </Card>
            <Card className="p-6 space-y-4 hover-elevate">
              <div className="w-12 h-12 rounded-lg bg-chart-2/10 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-chart-2" />
              </div>
              <h3 className="font-semibold text-lg">Análise Visual</h3>
              <p className="text-muted-foreground text-sm">
                Gráficos intuitivos mostram seus gastos por categoria e tendências mensais
              </p>
            </Card>
            <Card className="p-6 space-y-4 hover-elevate">
              <div className="w-12 h-12 rounded-lg bg-chart-3/10 flex items-center justify-center">
                <Bell className="h-6 w-6 text-chart-3" />
              </div>
              <h3 className="font-semibold text-lg">Alertas Inteligentes</h3>
              <p className="text-muted-foreground text-sm">
                Nunca mais perca um prazo de renovação ou pague por ferramentas esquecidas
              </p>
            </Card>
            <Card className="p-6 space-y-4 hover-elevate">
              <div className="w-12 h-12 rounded-lg bg-chart-4/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-chart-4" />
              </div>
              <h3 className="font-semibold text-lg">Gestão de Equipe</h3>
              <p className="text-muted-foreground text-sm">
                Controle quem tem acesso ao quê com perfis Admin, Financeiro e Usuário
              </p>
            </Card>
            <Card className="p-6 space-y-4 hover-elevate">
              <div className="w-12 h-12 rounded-lg bg-chart-5/10 flex items-center justify-center">
                <FileText className="h-6 w-6 text-chart-5" />
              </div>
              <h3 className="font-semibold text-lg">Gestão de Notas</h3>
              <p className="text-muted-foreground text-sm">
                Anexe e organize todas as suas faturas e recibos em um só lugar
              </p>
            </Card>
            <Card className="p-6 space-y-4 hover-elevate">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Lock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Pagamento Seguro</h3>
              <p className="text-muted-foreground text-sm">
                Integração com Stripe para cobrança recorrente segura e confiável
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="font-heading font-semibold text-3xl md:text-4xl">
              Planos simples e transparentes
            </h2>
            <p className="text-muted-foreground text-lg">
              Comece grátis e escale conforme sua equipe cresce
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="p-8 space-y-6">
              <div>
                <h3 className="font-heading font-semibold text-2xl mb-2">Teste Grátis</h3>
                <p className="text-muted-foreground">Experimente todas as funcionalidades</p>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-mono font-bold text-5xl">$0</span>
                <span className="text-muted-foreground">/14 dias</span>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-chart-2 flex-shrink-0" />
                  <span className="text-sm">Até 10 assinaturas</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-chart-2 flex-shrink-0" />
                  <span className="text-sm">Alertas WhatsApp</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-chart-2 flex-shrink-0" />
                  <span className="text-sm">Dashboard e gráficos</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-chart-2 flex-shrink-0" />
                  <span className="text-sm">Até 3 membros</span>
                </li>
              </ul>
              <Button variant="outline" className="w-full" asChild data-testid="button-start-free">
                <a href="/api/login">Começar teste grátis</a>
              </Button>
            </Card>
            <Card className="p-8 space-y-6 border-primary relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-semibold rounded-bl-lg">
                Mais Popular
              </div>
              <div>
                <h3 className="font-heading font-semibold text-2xl mb-2">Plano Pro</h3>
                <p className="text-muted-foreground">Para equipes em crescimento</p>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-mono font-bold text-5xl">$19</span>
                <span className="text-muted-foreground">/mês</span>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-chart-2 flex-shrink-0" />
                  <span className="text-sm">Assinaturas ilimitadas</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-chart-2 flex-shrink-0" />
                  <span className="text-sm">Alertas WhatsApp ilimitados</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-chart-2 flex-shrink-0" />
                  <span className="text-sm">Dashboard completo</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-chart-2 flex-shrink-0" />
                  <span className="text-sm">Membros ilimitados</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-chart-2 flex-shrink-0" />
                  <span className="text-sm">Suporte prioritário</span>
                </li>
              </ul>
              <Button className="w-full" asChild data-testid="button-get-started">
                <a href="/api/login">Começar agora</a>
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary/5">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center space-y-8">
          <h2 className="font-heading font-bold text-3xl md:text-4xl">
            Pronto para controlar seus gastos com SaaS?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Junte-se a centenas de empresas que economizam tempo e dinheiro com o Gerente de SaaS
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" asChild data-testid="button-cta-start">
              <a href="/api/login">
                Começar teste grátis
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              <span className="font-heading font-semibold">Gerente de SaaS</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 Gerente de SaaS. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
