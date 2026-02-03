export interface PaymentInitiateRequest {
    encomenda_id: string;
    metodo: string;
    moeda?: string;
    tipo_pagamento?: string;
    ip_cliente?: string;
    user_agent?: string;
    url_retorno?: string;
}

export interface PaymentInitiateResponse {
    pagamento_id: string;
    estado: string;
    url_pagamento?: string;
    tempo_expiracao?: number;
    dados_adicionais?: any;
}

export interface PaymentConfirmRequest {
    pagamento_id: string;
    codigo_confirmacao?: string;
    gateway_transacao_id?: string;
    dados_adicionais?: any;
}

export interface PaymentConfirmResponse {
    pagamento_id: string;
    estado: string;
    mensagem?: string;
    data_confirmacao?: string;
    referencia_pagamento?: string;
}

export interface PaymentRefundRequest {
    pagamento_id: string;
    valor?: number;
    motivo: string;
    referencia_cliente?: string;
}

export interface PaymentRefundResponse {
    pagamento_id: string;
    estado: string;
    valor_reembolsado: number;
    data_reembolso: string;
    referencia_reembolso: string;
    mensagem: string;
}

export interface PaymentStatistics {
    total_pagamentos: number;
    total_sucesso: number;
    total_falha: number;
    total_pendente: number;
    total_reembolsado: number;
    valor_total_processado: number;
    valor_em_pendente: number;
    valor_reembolsado: number;
    taxa_sucesso_percentual: number;
    metodo_mais_usado?: string | null;
    gateway_mais_usado?: string | null;
}