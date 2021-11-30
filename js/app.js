(() => {
    const letras = ['A', 'B', 'C', 'D', ,'E','F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'Ñ', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    let palabras;

    document.addEventListener('DOMContentLoaded', cargarGlosario);

    async function cargarGlosario() {
        const menu = document.querySelector('#menu');
        const lista = document.createElement('ul');
        let indice = 1;

        limpiarHTML(menu);

        await cargarPalabras();

        letras.forEach(letra => {
            const menuLetra = document.createElement('li');
            
            const listaPalabras = document.createElement('ul');
            let arrayPalabras;

            menuLetra.appendChild(generarBotonLetra(letra));

            listaPalabras.classList.add('lista-opciones');

            arrayPalabras = obtenerPalabrasLetra(letra);

            if (arrayPalabras.length > 0) {
                arrayPalabras.forEach((palabra) => {
                    listaPalabras.appendChild(generarElementoListaPalabra(palabra, indice));

                    indice++;
                });

                menuLetra.appendChild(listaPalabras);
            }

            lista.appendChild(menuLetra);
        });

        menu.appendChild(lista);
    }

    function generarBotonLetra(letra) {
        const botonLetra = document.createElement('button');

        botonLetra.innerHTML = `
            ${letra}
            <svg class="icono-boton-letra w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>            
        `;

        botonLetra.classList.add('boton-letra');
        botonLetra.dataset['letra'] = letra
        botonLetra.addEventListener('click', colapsarLista);

        return botonLetra;
    }

    function generarElementoListaPalabra(palabra, indice) {
        const palabraLi = document.createElement('li');                    
        const botonPalabra = document.createElement('button');
                    
        botonPalabra.classList.add('boton-termino');
        botonPalabra.textContent = (indice < 10 ? '0' + indice : indice) + '. ' + palabra.titulo;
        botonPalabra.dataset['id'] = palabra.id;
        botonPalabra.addEventListener('click', mostrarTermino);

        palabraLi.appendChild(botonPalabra);

        return palabraLi;
    }

    async function cargarPalabras() {
        const resultado = await fetch('data/db.json');

        palabras = await resultado.json();       
        palabras = palabras.glosario;

        palabras = palabras.sort((a,b) => {
            if (a.titulo > b.titulo) {
                return 1;
            }
            if (a.titulo < b.titulo) {
                return -1;
            }
            
            return 0;
        });
    }

    function obtenerPalabrasLetra(letra) {
        return palabras.filter(palabra => palabra.letra == letra);
    }

    function obtenerTermino(id) {
        let elemento;
        
        palabras.forEach(palabra => {
            if (palabra.id == id) {
                elemento = palabra;   
            }
        });

        return elemento;
    }

    function colapsarLista(e) {
        const lista = document.querySelector(`button[data-letra='${e.target.dataset['letra']}']~ul`);

        if (lista) {
            lista.classList.toggle('lista-opciones');
        } else {
            mostrarSinContenido();
        }
    }

    function mostrarTermino(e) {        
        const seccionPrincipal = document.querySelector('#principal');
        const articulo = document.createElement('article');
        const id = Number(e.target.dataset['id']);
        const indice = e.target.innerHTML.split(' ')[0];
        const termino = obtenerTermino(id);

        limpiarHTML(seccionPrincipal);

        articulo.classList.add('termino','animate__animated','animate__fadeIn');
        articulo.innerHTML = `
            <h2>
                ${indice} ${termino.titulo}
            </h2>
            <div class="termino-cuerpo">
                <p>
                    <span class="termino-cuerpo-titulo">Definición:</span>
                    ${termino.definicion}
                </p>
            </div>
        `;

        seccionPrincipal.appendChild(articulo);
    }

    function limpiarHTML(menu) {
        while (menu.firstChild) {
            menu.removeChild(menu.firstChild);
        }
    }

    function mostrarSinContenido() {
        const seccionPrincipal = document.querySelector('#principal');
        limpiarHTML(seccionPrincipal);

        seccionPrincipal.innerHTML = `
            <div class='not-found animate__animated animate__fadeIn'>
                <svg class="icon-not-found animate__animated animate__headShake animate__delay-1s w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <p>
                    No hay contenido en esta secci&oacute;n...
                </p>
            </div>
        `;
    }
})();