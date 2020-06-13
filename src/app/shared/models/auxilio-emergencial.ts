export interface AuxilioEmergencial {
    mesDisponibilizacao: string;
    beneficiario: Beneficiario;
    responsavelAuxilioEmergencial: ResponsavelAuxilioEmergencial;
    municipio: Municipio;
    valor: number
}

export interface Beneficiario {
    nis: string;
    nome: string;
    multiploCadastro: boolean;
    cpfFormatado: string;
}

export interface ResponsavelAuxilioEmergencial {
    nis: string;
    nome: string;
    nomeSemAcento: string;
    cpfFormatado: string;
}

export interface Municipio {
    codigoIbge: string;
    nomeIbge: string;
    nomeIbgeSemAcento: string;
    pais: string;
    uf: UF;
}

export interface UF {
    sigla: string;
    nome: string;
}
