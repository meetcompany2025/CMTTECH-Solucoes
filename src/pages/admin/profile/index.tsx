import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { UserRepository } from '@/data/repositories/user.repository.impl';
import { User, UserUpdate } from '@/domain/entities/user.entity';
import { Loader2, Upload } from 'lucide-react';

const userRepository = new UserRepository();

export default function UserProfile() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    const form = useForm<UserUpdate>({
        defaultValues: {
            username: '',
            email: '',
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
            });
        } catch (error) {
            toast.error('Falha ao carregar perfil');
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data: UserUpdate) => {
        if (!user) return;
        try {
            setSaving(true);
            const updatedUser = await userRepository.updateUser(user.id, data);
            setUser(updatedUser);
            toast.success('Perfil atualizado');
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
            // Refresh profile to get new URL (or update manually if response returned partial)
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

    if (loading) {
        return <div className="flex h-full items-center justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    if (!user) return <div>Incapaz de carregar perfil.</div>;

    return (
        <div className="space-y-6 max-w-2xl px-4 md:px-0">
            <div>
                <h1 className="text-3xl font-bold">O Meu Perfil</h1>
                <p className="text-muted-foreground">Gerir informações da conta</p>
            </div>

            <div className="flex flex-col md:flex-row gap-6">

                {/* Avatar Section */}
                <Card className="w-full md:w-1/3 h-fit">
                    <CardHeader>
                        <CardTitle>Avatar</CardTitle>
                        <CardDescription>Clique na imagem para alterar</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-4">
                        <div className="relative group cursor-pointer">
                            <Avatar className="h-32 w-32 border-4 border-muted">
                                <AvatarImage src={user.avatar_url || ''} className="object-cover" />
                                <AvatarFallback className="text-4xl">{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <label
                                htmlFor="avatar-upload"
                                className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 rounded-full transition-opacity cursor-pointer"
                            >
                                {uploading ? <Loader2 className="animate-spin" /> : <Upload />}
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
                        <div className="text-center text-sm text-muted-foreground">
                            <p className="font-medium text-foreground">{user.role}</p>
                            <p>ID: {user.id.slice(0, 8)}...</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Form Section */}
                <Card className="w-full md:w-2/3">
                    <CardHeader>
                        <CardTitle>Informações Básicas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Username</FormLabel>
                                            <FormControl>
                                                <Input {...field} value={field.value || ''} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input {...field} value={field.value || ''} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button type="submit" disabled={saving}>
                                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Salvar Alterações
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
