document.addEventListener('DOMContentLoaded', function () { //si bien hay varias maneras de preparar un modo oscuro lo que hice fue definir dos archivos css con variables de colores
    const themeToggle = document.getElementById('theme-toggle');
    const themeStylesheet = document.getElementById('theme-stylesheet');

    themeToggle.addEventListener('change', function () {
        if (themeToggle.checked) {
            themeStylesheet.href = '../style/colors/dark-mode.css';
        } else {
            themeStylesheet.href = '../style/colors/light-mode.css';
        }
    });
});

let availableTable = null; //aquí defino que a la carga de la aplicación, no hay picadas definidas.
let storageReady = false; //esta variable se actualiza a true más adelante y evito la re-renderización de los productos infinitamente al presionar nuevamente el botón.

function readJsonFromLS() { 
    // Obtengo el contenido del localStorage. Aquí se lee el local storage y se almacena el objeto (en mi caso un array de objetos) en una variable válida para JS
    const jsonFromLS = localStorage.getItem('tables'); //tables son las picadas.

    if (jsonFromLS) {
        // Convierto el JSON a objeto JavaScript
        const data = JSON.parse(jsonFromLS);

        availableTable = data; // Aquí actualizo la variable para manipular los datos luego.
        return data;
    } else {
        console.error('No se encontró ningún JSON en el localStorage');
        return null;
    }
}

function showValues(objetArray, ...keysShow) {  //esta función tiene por parámetros un objeto que es un array de objetos, y debe recibir como argumentos los valores que quiere renderizar (máximo 3)
    if (!storageReady) { // analiza la condición para evitar la renderización duplicada.
        const table = document.getElementById('tableTr');
        const container = document.getElementById('contenedorTabla');

        objetArray.forEach(object => {
            const newRow = document.createElement('tr');

            keysShow.slice(0, 3).forEach((key) => { //acá establezco el máximo de values a renderizar (ver más abajo en la invocación de la función).
                const value = object[key];
                const newCell = document.createElement('td');
                newCell.textContent = value;
                newRow.appendChild(newCell);
            });

            // Agregar un botón "ver más" con un ID único que se extrae del archivo json
            const buttonPlus = document.createElement('button');
            buttonPlus.textContent = 'ver más';
            const id = `boton-${object.id}`; // Asigno el ID usando los template strings según la consigna.
            buttonPlus.id = id;
            buttonPlus.addEventListener('click', function () {
                showAditionalInfo(object);
            });
            const buttonCell = document.createElement('td');
            buttonCell.appendChild(buttonPlus);
            newRow.appendChild(buttonCell);

            table.appendChild(newRow);
        });

        container.appendChild(table);
        storageReady = true; // Actualizo la variable
    }
}

function showAditionalInfo(object) { //acá lo que se hace es tomas más info del array de objetos no renderizados de manera default
    const infoTitle = document.getElementById('infoTitulo');
    const infoText = document.getElementById('infoTexto');
    const infoImg = document.getElementById('infoImagen');
    const containerInfo = document.getElementById('infoAdicional');
    const infoPrice = document.getElementById('infoPrecio');

    infoTitle.textContent = object.name; // mostrar el nombre del producto
    infoText.textContent = object.ingredients; // Mostrar los ingredientes
    infoImg.src = object.image; // y así
    infoPrice.textContent = object.price;
    containerInfo.style.display = 'block';
}

const getJson = document.getElementById('getJson'); 
getJson.addEventListener('click', function () {
    function mountJSONLocalStorage() { //acá lo que hago es montar el objeto en el localstorage
        // Verifico si el JSON ya está en el lS
        const availableTable = JSON.parse(localStorage.getItem('tables'));

        if (availableTable == null) {
            // Leo el archivo JSON con una petición fetch, tal como indica la consigna.
            fetch('./data/productos.json')
                .then(response => response.json())
                .then(data => {
                    localStorage.setItem('tables', JSON.stringify(data));
                    console.log('Contenido del JSON almacenado en localStorage');
                    showValues(data, 'name', 'description'); //acá está la implementación del show. puede pedirse otro valor para renderizar, ejemplo (data, 'name', 'price') xon un máximo de3.
                })
                .catch(error => console.error('Error al cargar el JSON:', error));
        } else {
            // El JSON ya está en el localStorage, utilizarlo.
            console.log(availableTable);
            showValues(availableTable, 'name', 'description');
        }
    }

    // Llamar a la función para cargar el JSON en el localStorage
    mountJSONLocalStorage();
});
