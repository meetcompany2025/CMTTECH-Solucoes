export interface EmailNotification {
    id: string;
    destinatario_email: string;
    assunto: string;
    corpo_html: string;
    tipo: string;
    relacionado_tipo?: string | null;
    relacionado_id?: string | null;
    estado: string;
    tentativas: number;
    erro_mensagem?: string | null;
    enviado_at?: string | null;
    created_at?: string | null;
}

export interface TestEmailRequest {
    to_email: string;
    to_name?: string;
}
