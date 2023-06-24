document.addEventListener('DOMContentLoaded', () => {
    const selection = document.getElementById('department');
    let itemsData = [];

    fetch('http://localhost:4000/data')
        .then(response => response.json())
        .then(items => {
            itemsData = items;

            selection.addEventListener('change', event => {
                event.preventDefault();
                const selectedDepartment = selection.value;
                const filteredItems = itemsData.filter(item => item.department === selectedDepartment);
                barChart(filteredItems);
            });
            pieChart(itemsData);
        })
        .catch(error => console.error('Error al obtener los elementos:', error));

    function pieChart(items) {
        const pieChartCanvas = document.getElementById('pie-chart');
        const departments = items.reduce((acc, item) => {
            if (!acc.includes(item.department)) {
                acc.push(item.department);
            }
            return acc;
        }, []);

        const quantityOfDepartments = departments.map(dep => {
            return items.filter(item => item.department === dep).length;
        });

        new Chart(pieChartCanvas, {
            type: 'pie',
            data: {
                labels: departments,
                datasets: [{
                    data: quantityOfDepartments,
                    backgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#8A2BE2',
                        '#3CB371',
                        '#FFA07A',
                        '#FF4500',
                        '#9400D3',
                        '#00CED1',
                        '#D2691E',
                        '#00BFFF',
                        '#FFD700',
                        '#FF69B4',
                        '#00FA9A',
                        '#9932CC',
                        '#1E90FF',
                        '#FF7F50',
                        '#808080',
                        '#7B68EE',
                        '#20B2AA'
                    ]
                }]
            }
        });

        showElements(items);
    }


    function barChart(items) {
        const labels = items.map(item => item.location);
        const pressures = items.map(item => item.pressure);
        const barChartCanvas = document.getElementById('bar-chart');
        const barChartInstance = barChartCanvas.chart;

        if (barChartInstance) {
            barChartInstance.data.labels = labels;
            barChartInstance.data.datasets[0].data = pressures;
            barChartInstance.update();
        } else {
            const barChart = new Chart(barChartCanvas, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Presión',
                        data: pressures,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
            barChartCanvas.chart = barChart;
        }
    }
});
