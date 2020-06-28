import { CestaBasica } from './cesta-basica';

export interface FamiliaEmergencial {
    codfamilia?: number,
    nome?: string,
    datanasc2?: string,
    cpf?: string,
    Telefone?: string,
    quadra?: string,
    cidade?: string,
    quantcriancas?: number,
    quantidade?: number,
    Conjuge?: string,
    data?: string,
    referencia_endereco?: string,
    cpf_conjuge?: string,
    data_nasc_conjuge?: string,
    tipo_moradia?: string,
    status_emprego?: string,
    nis?: string,
    deseja_msg?: boolean,
    deseja_aux_espiritual?: boolean,
    descricao?: string,
    status?: number,
    recebe_aux_governo?: string, 
    dataAtualizacao?: string,
    voluntario?: string,
    cestasBasicasDaFamilia?: CestaBasica[]
}
