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

export function novaDataString(dataForm: string): string {
    console.log('data: ', dataForm);
    if (!dataForm || dataForm == '' || dataForm == '0000-00-00') { return dataForm; };
    return new Date(dataForm).toISOString();
}

export function consolelog( ...args){
    if (!environment.production) {
        console.log( ...args );
    }
}