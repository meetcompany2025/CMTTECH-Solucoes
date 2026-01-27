export interface SystemSetting {
    id: string;
    chave: string;
    valor?: string | null;
    tipo: string; // 'string', 'boolean', 'number', 'json'
    grupo: string; // 'geral', 'pagamentos', 'email', etc.
    descricao?: string | null;
    editavel: boolean;
    updated_at?: string | null;
}

export interface SystemSettingUpdate {
    valor?: string | null;
    descricao?: string | null;
}
