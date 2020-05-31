import { TitularBolsaFamilia } from './titular-bolsa-familia.model';
import { Municipio } from './municipio.model';

export interface BfDisponibilizado {
    id?: number;
    dataMesCOmpetencia?: string;
    dataMesReferencia?: string;
    titularBolsaFamilia?: TitularBolsaFamilia;
    municipio?: Municipio;
    valor?: number;
    quantidadeDependentes?: number;
}
