const criptomonedasSelect = document.querySelector('#criptomonedas');
const monedaSelect = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');

const objBusqueda = {
    moneda: '',
    criptomoneda: ''
}

//Crear un Promise
const obteenerCriptomonedas = criptomonedas => new Promise(resolve =>{
    resolve(criptomonedas);
});

document.addEventListener('DOMContentLoaded',() =>{
    consultarCriptomonedas();

    formulario.addEventListener('submit', submitFormulario);

    criptomonedasSelect.addEventListener('change', leerValor);
    monedaSelect.addEventListener('change', leerValor);
})

//API URL
function consultarCriptomonedas(){
    //limit=10, trae las diez criptos mas actualizdas, si queremos mas hay que cambiar el valor
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

    fetch(url)
        .then(respuesta => respuesta.json() )
        .then(resultado => obteenerCriptomonedas(resultado.Data))
        .then(criptomonedas => selectCriptomonedas(criptomonedas))
}
//Selector de cripto, select
function selectCriptomonedas(criptomonedas){
    criptomonedas.forEach(cripto => {
        const {FullName, Name} = cripto.CoinInfo;

        const option = document.createElement('option');
        option.value = Name;
        option.textContent = FullName;
        criptomonedasSelect.appendChild(option);
    });
}

function leerValor(e){
    objBusqueda[e.target.name] = e.target.value;   

    console.log(objBusqueda);
}

function submitFormulario(e){
    e.preventDefault();
    
    //validar
    const {moneda, criptomoneda} = objBusqueda;
    if(moneda === '' || criptomoneda === ''){
        mostrarAlerta('Debe seleccionar una opción');
        return;
    }

    //Consultar la API con resultados
    consultarAPI();
}

function mostrarAlerta(mensaje){
    const existeError = document.querySelector('.error');

    if(!existeError){
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('error');
    
        //Mensaje de error
        divMensaje.textContent = mensaje;
    
        formulario.appendChild(divMensaje);
    
        setTimeout(()=>{
            divMensaje.remove()
        },3000)
    }
   
}

function consultarAPI(){
    const {moneda, criptomoneda} = objBusqueda;

    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;  

    mostrarSpinner();

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(cotizacion => {
            mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda]);
        })
}

function mostrarCotizacionHTML(cotizacion){
    limpiarHTML();
    const  {PRICE, HIGHDAY, LOWDAY,CHANGEPCT24HOUR, LASTUPDATE} = cotizacion;

    const precio = document.createElement('p');
    precio.classList.add('precio');
    precio.innerHTML = `El Precio es: <span>${PRICE}</span>`;

    const precioAlto = document.createElement('p');
    precioAlto.innerHTML = `<p>Precio más alto del día <span>${HIGHDAY} </span>`;

    const precioBajo = document.createElement('p');
    precioBajo.innerHTML = `<p>Precio más bajo del día <span>${LOWDAY} </span>`;

    
    const ultimasHoras = document.createElement('p');
    ultimasHoras.innerHTML = `<p>Variación de las últimas 24 horas de <span>${CHANGEPCT24HOUR}% </span>`;

    const ultimasActualizacion = document.createElement('p');
    ultimasActualizacion.innerHTML = `<p>últimas Actualización <span>${LASTUPDATE}</span>`;


    resultado.appendChild(precio);
    resultado.appendChild(precioAlto); 
    resultado.appendChild(precioBajo);    
    resultado.appendChild(ultimasHoras);    
    resultado.appendChild(ultimasActualizacion);    
}

function limpiarHTML(){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }
}

function mostrarSpinner(){
    limpiarHTML();

    const spinner = document.createElement('div');
    spinner.classList.add('spinner');

    spinner.innerHTML=`
        <div class="cube1"></div>
        <div class="cube2"></div>
    `;

    resultado.appendChild(spinner);
}