document.addEventListener('DOMContentLoaded', () => {
    const itemsList = document.getElementById('data-list');
    const filterForm = document.getElementById('filter-form');

    // Obtener los elementos alertados del servidor
    fetch('http://localhost:4000/data')
        .then(response => response.json())
        .then(items => {
            // Mostrar todos los elementos en la lista inicialmente
            mostrarElementos(items);

            // Agregar evento al enviar el formulario de filtro
            filterForm.addEventListener('submit', event => {
                event.preventDefault(); // Evitar el envío del formulario
                const departamentoSeleccionado = filterForm.departamento.value;

                // Filtrar los elementos por departamento
                const elementosFiltrados = items.filter(item => item.departamento === departamentoSeleccionado);

                // Mostrar solo los elementos filtrados
                mostrarElementos(elementosFiltrados);
            });
        })
        .catch(error => console.error('Error al obtener los elementos:', error));

    // Función para mostrar los elementos en la lista
    function mostrarElementos(elementos) {
        itemsList.innerHTML = ''; // Limpiar la lista antes de mostrar los elementos

        elementos.forEach(item => {
            const listItem = document.createElement('li');

            const ubicacionElement = document.createElement('div');
            ubicacionElement.textContent = `Ubicación: ${item.ubicacion}`;

            const presionElement = document.createElement('div');
            presionElement.textContent = `Presión: ${item.presion}`;

            const buttonContainer = document.createElement('div');
            buttonContainer.style.marginTop = '10px'; // Agrega un margen superior entre los elementos y el botón

            const doneButton = document.createElement('button');
            doneButton.textContent = 'Arreglado';
            doneButton.addEventListener('click', () => {
                // Actualizar el estado del elemento en el servidor
                fetch(`http://localhost:4000/data/${item._id}`, { method: 'PUT' })
                    .then(response => response.text())
                    .then(message => {
                        console.log(message);
                        listItem.innerHTML = `Cañería ubicada en dirección ${item.ubicacion} REPARADA`;
                        // listItem.innerHTML = 'Cañería ubicada en dirección ' + ${item.ubicacion} + ' REPARADA';// Mostrar el mensaje de reparación
                    })
                    .catch(error => console.error('Error al actualizar el estado:', error));
            });

            buttonContainer.appendChild(doneButton);

            listItem.appendChild(ubicacionElement);
            listItem.appendChild(presionElement);
            listItem.appendChild(buttonContainer);
            itemsList.appendChild(listItem);
        });
    }

});
