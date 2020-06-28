import { environment } from '../../../environments/environment';

export function validaCpf(inputCPF: string): boolean {
    if (!inputCPF) return true;
    let soma = 0;
    let resto;
    if (!inputCPF || inputCPF === '00000000000') { return false; }

    for (let i = 1; i <= 9; i++) {
        soma = soma + parseInt(inputCPF.substring(i - 1, i), 10) * (11 - i);
    }
    resto = (soma * 10) % 11;

    if ((resto === 10) || (resto === 11)) { resto = 0; }
    if (resto !== parseInt(inputCPF.substring(9, 10), 10)) { return false; }

    soma = 0;
    for (let i = 1; i <= 10; i++) {
        soma = soma + parseInt(inputCPF.substring(i - 1, i), 10) * (12 - i);
    }
    resto = (soma * 10) % 11;

    if ((resto === 10) || (resto === 11)) { resto = 0; }
    if (resto !== parseInt(inputCPF.substring(10, 11), 10)) { return false; }

    return true;
}

export function validaNis(inputNis: string): boolean {
    if (!inputNis) return true;
    let soma = 0;
    let resto;
    const PESO = [3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    if (!inputNis || inputNis === '00000000000') { return false; }

    for (let i = 0; i <= 9; i++) {
        soma = soma + parseInt(inputNis.substring(i, i + 1), 10) * PESO[i];
    }
    resto = 11 - soma % 11;

    if ((resto === 10) || (resto === 11)) { resto = 0; }
    if (resto !== parseInt(inputNis.substring(10, 11), 10)) { return false; }

    return true;
}

export function dateTimeTZToDate(dateTz: string) {
    if (dateTz == '') { return '' }
    return dateTz.slice(0, 10);
}

export function dateIntltoDateBrString(data: any): string {
    return (data.substring(8,10) + '/' + data.substring(5,7) + '/' + data.substring(0,4));
  }

  /*
   * recebe data no format dd/mm/aaaa ou ddmmaaaa e retorna no formato aaaa-mm-dd
   * para atender formatação do backend - se aplica ao tipo date e não se aplica
   * aos tipos datetime e timestamp 
   * @param data 
   */
export function dataBrtoDateString(data: any): string {
    if (!data) {return '0000-01-01'; };
    let datas: string;
    if (data.length === 8){
        datas = data.substring(4,8) + '-' + data.substring(2,4) + '-' + data.substring(0,2);
    } else {
        datas = (data.substring(6,10)|| '0000' ) + '-' + (data.substring(3,5) || '00') + '-' + (data.substring(0,2) || '00');
    }
    console.log( 'mylibs data: ', data, '  datas: ', datas);
    return datas;
    // return datas == '0000/00/00' ? '' : new Date(datas).toISOString();
  }

export function novaDataString(dataForm: string): string {
    consolelog('data: ', dataForm);
    if (!dataForm || dataForm == '' || dataForm == '0000-00-00') { return dataForm; };
    return new Date(dataForm).toISOString();
}

export function consolelog( ...args){
    if (!environment.production) {
        console.log( ...args );
    }
}