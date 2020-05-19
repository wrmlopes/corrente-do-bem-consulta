import { BeneficioDFDisponibilizado } from './beneficios-df-disponibilizado.model';

export interface DataBeneficioDF{
    content:BeneficioDFDisponibilizado[];
    last: boolean;
    totalPages: number;
    totalElements: number;
    sort: string;
    first: boolean;
    numberOfElements: number;
    size: number;
    number: number;
}