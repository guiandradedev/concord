import { useAuth } from "~/contexts/AuthContext";
import { useSocket } from "~/contexts/SocketContext";
import { Link } from "react-router";
import { Mail, Shield, Activity, ArrowLeft, LogOut, Circle } from "lucide-react";
import { Button, buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export default function ProfileScreen() {
    const { user, logout } = useAuth();
    const { isConnected } = useSocket();

    // Get initials for avatar (e.g. "John Doe" -> "JD")
    const getInitials = (name?: string) => {
        if (!name) return "US";
        const parts = name.trim().split(/\s+/);
        if (parts.length >= 2) {
            return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
        }
        return name.slice(0, 2).toUpperCase();
    };

    return (
        <div className="w-full max-w-md mx-auto my-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Main Premium Card */}
            <div className="relative bg-card text-card-foreground rounded-2xl shadow-xl border border-border overflow-hidden transition-all duration-300 hover:shadow-2xl">

                {/* Visual Gradient Banner */}
                <div className="h-32 bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-500 relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/10" />
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                    <div className="absolute -left-12 -bottom-12 w-32 h-32 bg-sky-400/20 rounded-full blur-xl" />
                </div>

                {/* Avatar overlapping the banner */}
                <div className="absolute top-16 left-6 size-24 rounded-full border-4 border-background bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-md flex items-center justify-center text-white text-3xl font-bold select-none transition-transform duration-300 hover:scale-105">
                    {getInitials(user?.name)}
                </div>

                {/* Content Area */}
                <div className="pt-12 px-6 pb-6 flex flex-col gap-6">
                    {/* Header info */}
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-foreground">{user?.name}</h2>
                        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary mt-1">
                            <Shield className="size-3" /> Conta Protegida
                        </span>
                    </div>

                    {/* Divider */}
                    <div className="h-[1px] w-full bg-border" />

                    {/* User details section */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors duration-200">
                            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-md">
                                <Mail className="size-5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-medium text-muted-foreground">E-mail</span>
                                <span className="text-sm font-semibold text-foreground">{user?.email}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors duration-200">
                            <div className="p-2 bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 rounded-md">
                                <Shield className="size-5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-medium text-muted-foreground">ID do Usuário</span>
                                <span className="text-xs font-mono text-foreground break-all">{user?.id}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors duration-200">
                            <div className="p-2 bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 rounded-md">
                                <Activity className="size-5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-medium text-muted-foreground">Status da Conexão</span>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <span className="relative flex h-2 w-2">
                                        {isConnected && (
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        )}
                                        <span className={`relative inline-flex rounded-full h-2 w-2 ${isConnected ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                                    </span>
                                    <span className="text-sm font-semibold text-foreground">
                                        {isConnected ? "Conectado ao Gateway" : "Desconectado"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="h-[1px] w-full bg-border" />

                    {/* Actions */}
                    <div className="flex items-center justify-between gap-3">
                        <Link
                            to="/app"
                            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-2 cursor-pointer")}
                        >
                            <ArrowLeft className="size-4" /> Voltar ao Chat
                        </Link>

                        <Button
                            variant="destructive"
                            size="sm"
                            className="gap-2 cursor-pointer"
                            onClick={logout}
                        >
                            <LogOut className="size-4" /> Sair
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}