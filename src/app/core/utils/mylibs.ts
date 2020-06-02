export function validaCpf(inputCPF: string): boolean {
    console.log(`input in cpf: [${inputCPF}]`);
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

export function dateTimeTZToDate(dateTz: string){
    return dateTz.slice(0,10);
}
