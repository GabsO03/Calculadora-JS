let inputContenido = '';
let operacionPendiente = '';
let historial = 'Historial:\n';
let decimalesDisponibles = 2;

//Para verificar doble
const esNumeroUOperador = /^\s*(-?\d+([.,]\d+)?(\s*[+\-*/%]\s*-?\d+([.,]\d+)?)*)|([+\-*/%])\s*$/;
const esOperador = /^(?!.*(.).*\1)[+\-*/%]+$/;
const esNumero = /^\d+(\.\d+)?$/;

window.addEventListener('load', () => {
    inputContenido = document.getElementById('numbersScreen');

    let numeros = document.querySelectorAll('.numero');



    //Añadir número por botón
    numeros.forEach((numero) => {
        numero.addEventListener('click', () => {
        
            if(inputContenido.value.startsWith('Sin definir')) {
                inputContenido.value = '';
            }
            if(esNumero.test(numero.value)) {

                if(inputContenido.value === '0' && numero.value === '0') {
                    inputContenido.value = 0; 
                }
                else if(!(inputContenido.value + numero.value).endsWith('/00')) {

                    if((inputContenido.value.endsWith('/0')) && (numero.value !== '0')){
                        inputContenido.value = inputContenido.value.substring(0, inputContenido.value.length-1);
                    }
                    else {
                        if(inputContenido.value.startsWith('0')) {
                            inputContenido.value = inputContenido.value.substring(0, inputContenido.value.length-1);
                        }
                    }
                    inputContenido.value += numero.value;
                    historial += numero.value;
                }
                
                numero.blur();
            }
            else {
                window.alert('No modifiques el html plisito');
            }
        })
    })

    //Controlar entradas por teclado
    inputContenido.addEventListener('input', (input) => {
        if(esNumeroUOperador.test(input.data)) {
            if(esOperador.test(input.data)) {
                activarOperador(input.data, true, historial);
            }
            else {
                if(inputContenido.value === '0' && input.data === '0') {
                    inputContenido.value = 0; 
                }
                else {
                    if(inputContenido.value.startsWith('0')) {
                        inputContenido.value = inputContenido.value.substring(1, inputContenido.value.length);
                    }
                    if(input.data !== null) {
                        historial += input.data;
                    }
                }
            }
        }
        else if(input.data === null) {
            let lastChar = inputContenido.value.charAt(inputContenido.value.length-1);
            if(!esOperador.test(lastChar) && operacionPendiente.length === 1) operacionPendiente = '';
        }
        else if(typeof(input.data) === 'string') {
            inputContenido.value = inputContenido.value.substring(1, inputContenido.value.length);
        }
    })

    //Mostrar historial
    document.getElementById('historial').addEventListener('click', () => {
        if(historial.length > 0) window.alert(historial);
        else window.alert('El historial está vacío');
        document.getElementById('historial').blur();
    })

    //Borrar historial
    document.getElementById('clearHistory').addEventListener('click', () => {
        historial = '';
        window.alert('Borrando el historial');
        document.getElementById('clearHistory').blur();
    });

    //Botón para el borrado de un solo caracter
    document.getElementById('del').addEventListener('click', () => {
        let lastIndex = inputContenido.value.length-1;
        let lastChar = inputContenido.value.charAt(lastIndex);
        if(esOperador.test(lastChar)) {
            operacionPendiente = '';
        }
        inputContenido.value = inputContenido.value.substring(0, lastIndex);
        document.getElementById('del').blur();
    })

    //Botón para el borrado de todo el input
    document.getElementById('clear').addEventListener('click', () => {
        inputContenido.value = '';
        operacionPendiente = '';
        document.getElementById('clear').blur();
    })

    //Si es enviado por submit (=)
    document.getElementById('form').addEventListener('submit', (event) => {
        event.preventDefault();
        if(inputContenido.value.length > 0 && operacionPendiente.length === 1) {
            let lastIndex = inputContenido.value.length-1;
            let lastChar = inputContenido.value.charAt(lastIndex);
            if(esNumero.test(lastChar)) {
                mostrarResultado();
            }
            else {
                inputContenido.value = inputContenido.value.substring(0, lastIndex);
                operacionPendiente = '';
            }
        }
    })
})

function cambiaSigno () {
    //Lo multiplicaría por -1 pero es una cadena así que no se puede
    let value = inputContenido.value;
    if(value.length > 0 ) {
        let esNegativo = value.startsWith('-');
        value = esNegativo?'' + value.substring(1):'-' + value;
    }
    inputContenido.value = value;
}


function activarOperador (operador, entraPorTeclado = false) {
    let ultimoChar = inputContenido.value.charAt(inputContenido.value.length-(entraPorTeclado?2:1));
    if(operador === '.') {
        if(decimalesDisponibles > 0) {
            if(esNumero.test(ultimoChar) && decimalesDisponibles===2) {
                inputContenido.value += '.';
                decimalesDisponibles--;
            }
            else if(operacionPendiente) {
                inputContenido.value += '.';
                decimalesDisponibles--;
            }
        }
    }
    else {

        //Verificamos que no se repite un signo dos veces seguidas
        let tieneUnNumeroAntes = esNumero.test(ultimoChar);

        
        if(tieneUnNumeroAntes) {

            //Si termina en \n es porque hizo un salto de lìnea después de un resultado
            let operacionNueva = historial.endsWith('\n') && operacionPendiente.length === 0;

            if(operacionNueva) historial += inputContenido.value + '' + operador;
            
            else historial += operador;
            
            //Si tiene un número y ya hay una operación pendiente, hacemos la operación
            if(operacionPendiente.length === 1) {
                mostrarResultado(operador === '√');
                if(operador !== '√') inputContenido.value += operador;
                operacionPendiente = operador;
            }
            //Si es una nueva
            else {
                if(operador === '√') {
                    inputContenido.value = operador + inputContenido.value;
                }
                else {
                    if(!entraPorTeclado) inputContenido.value += operador;
                }
                operacionPendiente = operador;
            }
        }
        else {
            if(operador==='√') {
                inputContenido.value = '√';
                operacionPendiente = '√';
            }

            let auxIndexOperator = inputContenido.value.indexOf(operador);
            if(entraPorTeclado) {
                if(operador === '-') {
                    inputContenido.value += operador;
                }
                else {
                    inputContenido.value = inputContenido.value.substring(0, auxIndexOperator)
                }
            }
            else {
                if(operador === '-' && !['.', '-'].includes(ultimoChar)) {
                    inputContenido.value += operador;
                }
                else if(ultimoChar === '.') {
                    //Borramos el punto si no hay nada después de este
                    inputContenido.value = inputContenido.value.substring(0, inputContenido.value.indexOf(ultimoChar));

                    inputContenido.value += operador;
                    decimalesDisponibles++;
                    operacionPendiente = operador;

                }
                else {
                    inputContenido.value = inputContenido.value.substring(0, auxIndexOperator+1)
                }
            }
        }
    }
    if(inputContenido.value.endsWith('Sin definir' + operador)) {
        let lastIndex = inputContenido.value.length-1;
        inputContenido.value = inputContenido.value.substring(0, lastIndex);
        operacionPendiente = '';
    }
};

function mostrarResultado (esRaiz = false) {
    let resultado = calcularResultado();
    if(esRaiz) {
        inputContenido.value = '√' + resultado;
    }
    else inputContenido.value = resultado;
    operacionPendiente = '';

    historial += ' = ' + resultado + '\n';
}

function calcularResultado() {
    let resultado;
    if(operacionPendiente==='√') {
        let numeroParaCalcular = inputContenido.value.substring(1);
        resultado = operaciones(numeroParaCalcular, 0, operacionPendiente);
    }
    else {
        let operacion = inputContenido.value.split(operacionPendiente);
        let num1 = parseFloat(operacion[0]);
        let num2 = parseFloat(operacion[1]);
        resultado = operaciones(num1, num2, operacionPendiente);
    }

    if(resultado !== Math.floor(resultado)) decimalesDisponibles = 1;
    else decimalesDisponibles = 2;
    return resultado;
}

function operaciones(num1, num2=0, tipoOperacion) {
    switch(tipoOperacion) {
        case '+':
            return num1 + num2;
            break;
        case '-':
            return num1 - num2;
            break;
        case '*':
            let producto = 0;
            let hayUnNegativo = false;

            //Controlamos los signos para no caer en un bucle infinito
            if(num1<0 && num2 <0) {
                //Según la ley de signos -/- = +
                num1 *= -1;
                num2 *= -1;
            }
            else if(num1<0 || num2<0) {
                //Aquí igual así que convertimos ambos pero tenemos en cuenta que el resultado tiene que ser negativo
                hayUnNegativo = true;
                num1 *= -1;
                num2 *= -1;
            }

            for (let index = 0; index < num2; index++) {
                producto += num1;
            }
            
            if(hayUnNegativo) {
                return producto *= -1;
            }
            return producto;
            
            break;
        case '/':
            if(num2 === 0) return 'Sin definir';
            else {
                let cociente = 0;
                let hayUnNegativo = false;

                //Hacemos lo mismo que en la multiplicación
                if(num1<0 && num2 <0) {
                    num1 *= -1;
                    num2 *= -1;
                }
                else if(num1<0 || num2<0) {
                    hayUnNegativo = true;
                    num1 *= -1;
                    num2 *= -1;
                }


                while(num1 >= num2) {
                    num1 -= num2;
                    cociente++;
                }
                
                if(hayUnNegativo) {
                    return cociente *= -1;
                }
                return cociente;
            }
            break;
        case '^':
            return Math.pow(num1, num2);
            break;
        case '√':
            if(num1 > 0) {
                return Math.sqrt(num1);
            }
            else return 'Sin definir';
            break;
        case '%':
            return num1 % num2;
            break;
    }
}