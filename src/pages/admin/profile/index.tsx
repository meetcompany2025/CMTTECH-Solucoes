import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { UserRepository } from '@/data/repositories/user.repository.impl';
import { User, UserUpdate } from '@/domain/entities/user.entity';
import {
    Loader2,
    User as UserIcon,
    Mail,
    Shield,
    Bell,
    Settings,
    Heart,
    Save,
    Camera,
    CheckCircle2,
    X
} from 'lucide-react';

const userRepository = new UserRepository();

export default function UserProfile() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [interestInput, setInterestInput] = useState('');

    const form = useForm<UserUpdate & { confirmPassword?: string }>({
        defaultValues: {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            preferences: {},
            interests: {},
        },
    });

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            setLoading(true);
            const data = await userRepository.getMe();
            setUser(data);
            form.reset({
                username: data.username,
                email: data.email,
                password: '',
                confirmPassword: '',
                preferences: data.preferences || {},
                interests: data.interests || {},
            });
        } catch (error) {
            toast.error('Falha ao carregar perfil');
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (values: UserUpdate & { confirmPassword?: string }) => {
        if (!user) return;

        // Password matching validation
        if (values.password && values.password !== values.confirmPassword) {
            toast.error('As palavras-passe não coincidem');
            return;
        }

        try {
            setSaving(true);
            const { confirmPassword, ...updateData } = values;

            // Only send password if it's not empty
            if (!updateData.password) {
                delete updateData.password;
            }

            const updatedUser = await userRepository.updateUser(user.id, updateData);
            setUser(updatedUser);

            // Reset password fields
            form.setValue('password', '');
            form.setValue('confirmPassword', '');

            toast.success('Perfil atualizado com sucesso');
        } catch (error) {
            toast.error('Falha ao atualizar perfil');
        } finally {
            setSaving(false);
        }
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        try {
            setUploading(true);
            await userRepository.uploadAvatar(user.id, file);
            const updatedUser = await userRepository.getMe();
            setUser(updatedUser);
            toast.success('Avatar atualizado');
        } catch (error) {
            console.error(error);
            toast.error('Falha ao carregar avatar');
        } finally {
            setUploading(false);
        }
    };

    const addInterest = () => {
        if (!interestInput.trim()) return;
        const currentInterests = form.getValues('interests') || {};
        if (currentInterests[interestInput.trim()]) return;

        const newInterests = { ...currentInterests, [interestInput.trim()]: true };
        form.setValue('interests', newInterests, { shouldDirty: true });
        setInterestInput('');
    };

    const removeInterest = (key: string) => {
        const currentInterests = { ...(form.getValues('interests') || {}) };
        delete currentInterests[key];
        form.setValue('interests', currentInterests, { shouldDirty: true });
    };

    if (loading) {
        return <LoadingSpinner className="h-[80vh]" />;
    }

    if (!user) return <div className="p-8 text-center text-destructive">Incapaz de carregar perfil. Por favor tente novamente.</div>;

    const currentInterests = form.watch('interests') || {};
    const interestKeys = Object.keys(currentInterests);

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-12">
            {/* Header / Hero Section */}
            <div className="relative h-48 md:h-64 rounded-xl overflow-hidden shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-accent" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20" />
                <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row items-center md:items-end gap-6 text-white">
                    <div className="relative group p-1 bg-white/20 backdrop-blur-md rounded-full">
                        <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-white shadow-xl">
                            <AvatarImage src={user.avatar_url || ''} className="object-cover" />
                            <AvatarFallback className="text-4xl bg-primary text-white">
                                {user.username.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <label
                            htmlFor="avatar-upload"
                            className="absolute inset-1 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 rounded-full transition-all duration-300 cursor-pointer backdrop-blur-sm"
                        >
                            {uploading ? <Loader2 className="animate-spin" /> : <Camera className="w-8 h-8" />}
                        </label>
                        <input
                            id="avatar-upload"
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                            disabled={uploading}
                        />
                    </div>
                    <div className="flex-1 text-center md:text-left space-y-1 mb-2">
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{user.username}</h1>
                            <Badge variant="secondary" className="bg-white/20 text-white border-white/40 backdrop-blur-md px-3 py-1 text-sm font-semibold">
                                <Shield className="w-3 h-3 mr-1" /> {user.role}
                            </Badge>
                        </div>
                        <p className="text-white/80 flex items-center justify-center md:justify-start gap-2">
                            <Mail className="w-4 h-4" /> {user.email}
                        </p>
                    </div>
                    <div className="mb-2 hidden md:block">
                        <Button
                            onClick={form.handleSubmit(onSubmit)}
                            disabled={saving || !form.formState.isDirty}
                            className="bg-white text-primary hover:bg-white/90 shadow-lg px-6"
                        >
                            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Salvar Alterações
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Save Button */}
            <div className="md:hidden px-4">
                <Button
                    onClick={form.handleSubmit(onSubmit)}
                    disabled={saving || !form.formState.isDirty}
                    className="w-full h-12 text-lg shadow-md"
                >
                    {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Salvar Alterações
                </Button>
            </div>

            <Tabs defaultValue="account" className="w-full">
                <TabsList className="grid grid-cols-3 md:w-[600px] h-12 bg-muted/50 p-1 mb-8">
                    <TabsTrigger value="account" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        <UserIcon className="w-4 h-4 mr-2" /> Conta
                    </TabsTrigger>
                    <TabsTrigger value="interests" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        <Heart className="w-4 h-4 mr-2" /> Interesses
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        <Settings className="w-4 h-4 mr-2" /> Preferências
                    </TabsTrigger>
                </TabsList>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        {/* Account Tab */}
                        <TabsContent value="account">
                            <div className="grid gap-6 md:grid-cols-2">
                                <Card className="border-none shadow-md overflow-hidden transition-all hover:shadow-lg">
                                    <CardHeader className="bg-muted/30 border-b">
                                        <CardTitle className="text-xl flex items-center gap-2">
                                            <UserIcon className="w-5 h-5 text-primary" /> Informações Pessoais
                                        </CardTitle>
                                        <CardDescription>Atualize os seus dados de identificação base</CardDescription>
                                    </CardHeader>
                                    <CardContent className="pt-6 space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="username"
                                            rules={{ required: 'Username é obrigatório' }}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="font-semibold text-muted-foreground">Nome de Utilizador</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} value={field.value || ''} placeholder="Insira o seu username" className="h-11 focus-visible:ring-primary/50" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="email"
                                            rules={{ required: 'Email é obrigatório', pattern: { value: /^\S+@\S+$/i, message: 'Email inválido' } }}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="font-semibold text-muted-foreground">Endereço de Email</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} value={field.value || ''} placeholder="exemplo@cmttech.com" className="h-11 focus-visible:ring-primary/50" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <div className="pt-2">
                                            <Label className="font-semibold text-muted-foreground mb-2 block">Cargo Administrativo</Label>
                                            <div className="p-3 bg-muted/50 rounded-lg flex items-center justify-between border">
                                                <span className="font-medium text-foreground">{user.role}</span>
                                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                            </div>
                                            <p className="text-[11px] text-muted-foreground mt-2 px-1">O seu cargo é definido pelo administrador global e não pode ser editado pelo utilizador.</p>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-none shadow-md overflow-hidden transition-all hover:shadow-lg h-fit">
                                    <CardHeader className="bg-muted/30 border-b">
                                        <CardTitle className="text-xl flex items-center gap-2">
                                            <Shield className="w-5 h-5 text-primary" /> Segurança
                                        </CardTitle>
                                        <CardDescription>Mantenha a sua conta protegida</CardDescription>
                                    </CardHeader>
                                    <CardContent className="pt-6 space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="password"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="font-semibold text-muted-foreground">Nova Palavra-passe</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            type="password"
                                                            placeholder="Deixe em branco para manter"
                                                            className="h-11 focus-visible:ring-primary/50"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="confirmPassword"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="font-semibold text-muted-foreground">Confirmar Nova Palavra-passe</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            type="password"
                                                            placeholder="Repita a nova palavra-passe"
                                                            className="h-11 focus-visible:ring-primary/50"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 text-xs text-amber-700 mt-2">
                                            A palavra-passe deve ter pelo menos 8 caracteres.
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        {/* Interests Tab Content */}
                        <TabsContent value="interests">
                            <Card className="border-none shadow-md overflow-hidden max-w-3xl mx-auto">
                                <CardHeader className="bg-muted/30 border-b">
                                    <CardTitle className="text-xl flex items-center gap-2">
                                        <Heart className="w-5 h-5 text-primary" /> Áreas de Interesse
                                    </CardTitle>
                                    <CardDescription>Selecione tópicos relevantes para personalizar a sua experiência no painel</CardDescription>
                                </CardHeader>
                                <CardContent className="pt-6 space-y-6">
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Ex: Logística, Tecnologia, Vendas..."
                                            value={interestInput}
                                            onChange={(e) => setInterestInput(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
                                            className="h-11"
                                        />
                                        <Button type="button" onClick={addInterest} className="h-11">Adicionar</Button>
                                    </div>

                                    <div className="flex flex-wrap gap-2 pt-2 min-h-[100px] items-start">
                                        {interestKeys.length > 0 ? (
                                            interestKeys.map((interest) => (
                                                <div
                                                    key={interest}
                                                    className="transition-all duration-200"
                                                >
                                                    <Badge
                                                        variant="secondary"
                                                        className="px-4 py-2 text-sm bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 flex items-center gap-2 rounded-full cursor-default"
                                                    >
                                                        {interest}
                                                        <X
                                                            className="w-3 h-3 cursor-pointer hover:text-destructive transition-colors"
                                                            onClick={() => removeInterest(interest)}
                                                        />
                                                    </Badge>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-muted-foreground italic py-4 text-center w-full">Ainda não adicionou interesses. Comece a digitar acima!</p>
                                        )}
                                    </div>

                                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-700 flex gap-3">
                                        <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                                        Os seus interesses ajudam a IA a destacar produtos e encomendas que possam necessitar da sua atenção prioritária.
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Preferences Tab Content */}
                        <TabsContent value="settings">
                            <Card className="border-none shadow-md overflow-hidden max-w-3xl mx-auto">
                                <CardHeader className="bg-muted/30 border-b">
                                    <CardTitle className="text-xl flex items-center gap-2">
                                        <Bell className="w-5 h-5 text-primary" /> Notificações e Preferências
                                    </CardTitle>
                                    <CardDescription>Personalize como o sistema interage consigo</CardDescription>
                                </CardHeader>
                                <CardContent className="pt-6 space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 bg-muted/20 rounded-xl border border-transparent hover:border-border transition-all">
                                            <div className="space-y-1">
                                                <Label className="text-base font-semibold">Notificações por Email</Label>
                                                <p className="text-sm text-muted-foreground">Receba alertas de novas encomendas diretamente no seu email</p>
                                            </div>
                                            <Switch
                                                checked={!!form.watch('preferences')?.email_notifications}
                                                onCheckedChange={(val) => form.setValue('preferences', { ...form.getValues('preferences'), email_notifications: val }, { shouldDirty: true })}
                                            />
                                        </div>

                                        <div className="flex items-center justify-between p-4 bg-muted/20 rounded-xl border border-transparent hover:border-border transition-all">
                                            <div className="space-y-1">
                                                <Label className="text-base font-semibold">Alertas de Stock Baixo</Label>
                                                <p className="text-sm text-muted-foreground">Ser notificado quando produtos importantes atingirem o limite mínimo</p>
                                            </div>
                                            <Switch
                                                checked={!!form.watch('preferences')?.stock_alerts}
                                                onCheckedChange={(val) => form.setValue('preferences', { ...form.getValues('preferences'), stock_alerts: val }, { shouldDirty: true })}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </form>
                </Form>
            </Tabs>
        </div>
    );
}

