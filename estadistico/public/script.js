document.addEventListener('DOMContentLoaded', () => {
    const itemsList = document.getElementById('data-list');
    const filterForm = document.getElementById('filter-form');


    fetch('http://localhost:4000/data')
        .then(response => response.json())
        .then(items => {

            mostrarElementos(items);


            filterForm.addEventListener('submit', event => {
                event.preventDefault(); // Evitar el envío del formulario
                const departamentoSeleccionado = filterForm.departamento.value;


                const elementosFiltrados = items.filter(item => item.departamento === departamentoSeleccionado);


                mostrarElementos(elementosFiltrados);
            });
        })
        .catch(error => console.error('Error al obtener los elementos:', error));


    function mostrarElementos(elementos) {
        itemsList.innerHTML = '';

        elementos.forEach(item => {
            const listItem = document.createElement('li');

            const ubicacionElement = document.createElement('div');
            ubicacionElement.textContent = `Ubicación: ${item.ubicacion}`;

            const presionElement = document.createElement('div');
            presionElement.textContent = `Presión: ${item.presion}`;

            const buttonContainer = document.createElement('div');
            buttonContainer.style.marginTop = '10px';

            const doneButton = document.createElement('button');
            doneButton.textContent = 'Arreglado';
            doneButton.addEventListener('click', () => {

                fetch(`http://localhost:4000/data/${item._id}`, { method: 'PUT' })
                    .then(response => response.text())
                    .then(message => {
                        console.log(message);
                        listItem.innerHTML = `Cañería ubicada en dirección ${item.ubicacion} REPARADA`;

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
