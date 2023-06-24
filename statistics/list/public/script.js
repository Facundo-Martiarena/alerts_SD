document.addEventListener('DOMContentLoaded', () => {
    const itemsList = document.getElementById('data-list');
    const filterForm = document.getElementById('filter-form');

    fetch('http://localhost:4000/data')
        .then(response => response.json())
        .then(items => {
            showItems(items);

            filterForm.addEventListener('change', event => {
                event.preventDefault();
                const selectedDepartment = filterForm.department.value;
                const filteredItems = selectedDepartment === "Todos"
                    ? items
                    : items.filter(item => item.department === selectedDepartment);
                showItems(filteredItems);
            });
        })
        .catch(error => console.error('Error al obtener los elementos:', error));

    function showItems(items) {
        itemsList.innerHTML = '';

        items.forEach(item => {
            const listItem = document.createElement('li');

            const itemLocation = document.createElement('div');
            itemLocation.textContent = `Ubicación: ${item.location}`;

            const itemPressure = document.createElement('div');
            itemPressure.textContent = `Presión: ${item.pressure}`;

            const buttonContainer = document.createElement('div');
            buttonContainer.style.marginTop = '10px';

            const doneButton = document.createElement('button');
            doneButton.textContent = 'Arreglado';
            doneButton.addEventListener('click', () => {
                fetch(`http://localhost:4000/data/${item.sensor_id}`, { method: 'PUT' })
                    .then(response => response.text())
                    .then(message => {
                        console.log(message);
                        listItem.innerHTML = `Cañería ubicada en dirección ${item.location} REPARADA`;
                    })
                    .catch(error => console.error('Error al actualizar el estado:', error));
            });

            buttonContainer.appendChild(doneButton);

            listItem.appendChild(itemLocation);
            listItem.appendChild(itemPressure);
            listItem.appendChild(buttonContainer);
            itemsList.appendChild(listItem);
        });
    }

});
