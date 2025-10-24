import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Team() {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

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

  if (authLoading || !user) {
    return null;
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'finance':
        return 'bg-chart-3/10 text-chart-3 border-chart-3/20';
      case 'user':
        return 'bg-muted text-muted-foreground border-muted';
      default:
        return 'bg-muted text-muted-foreground border-muted';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'finance':
        return 'Financeiro';
      case 'user':
        return 'Usuário';
      default:
        return role;
    }
  };

  const getUserInitials = (email?: string | null, firstName?: string | null, lastName?: string | null) => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    if (email) {
      return email[0].toUpperCase();
    }
    return "U";
  };

  // For now showing just the current user - team management will be implemented in backend
  const teamMembers = [user];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="font-heading font-bold text-3xl md:text-4xl">Equipe</h1>
        <p className="text-muted-foreground mt-1">
          Gerencie os membros da sua equipe e permissões
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Membros da Equipe</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-4 p-4 rounded-lg hover-elevate border"
                data-testid={`team-member-${member.id}`}
              >
                <Avatar className="h-12 w-12">
                  <AvatarImage src={member.profileImageUrl || undefined} className="object-cover" />
                  <AvatarFallback>
                    {getUserInitials(member.email, member.firstName, member.lastName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">
                    {member.firstName && member.lastName
                      ? `${member.firstName} ${member.lastName}`
                      : member.firstName || member.email || "Usuário"}
                  </h3>
                  <p className="text-sm text-muted-foreground truncate">
                    {member.email}
                  </p>
                </div>
                <Badge className={getRoleColor(member.role || 'user')}>
                  {getRoleLabel(member.role || 'user')}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-muted/50">
        <CardContent className="p-6">
          <div className="space-y-3">
            <h3 className="font-semibold">Permissões por Função</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <Badge className="bg-primary/10 text-primary border-primary/20 flex-shrink-0 mt-0.5">
                  Administrador
                </Badge>
                <p className="text-muted-foreground">
                  Controle total: gerenciar assinaturas, equipe, configurações e alertas
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Badge className="bg-chart-3/10 text-chart-3 border-chart-3/20 flex-shrink-0 mt-0.5">
                  Financeiro
                </Badge>
                <p className="text-muted-foreground">
                  Acesso a custos, relatórios financeiros e aprovação de pagamentos
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Badge className="bg-muted text-muted-foreground border-muted flex-shrink-0 mt-0.5">
                  Usuário
                </Badge>
                <p className="text-muted-foreground">
                  Visualizar e gerenciar apenas suas próprias assinaturas
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
