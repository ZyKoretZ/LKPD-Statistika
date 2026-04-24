// Data Default Penjualan Kopi
let dataValues = [25, 30, 22, 40, 28];
let statChart;

function renderSliders() {
    const container = document.getElementById('sliders');
    container.innerHTML = '';

    dataValues.forEach((val, i) => {
        container.innerHTML += `
            <div class="slider-group">
                <label>Hari ${i + 1}</label><br>
                <input type="range" min="0" max="120" value="${val}" oninput="updateData(${i}, this.value)">
                <span class="slider-value" id="val-${i}">${val}</span>
            </div>
        `;
    });
}

function initChart() {
    const ctx = document.getElementById('statChart').getContext('2d');
    statChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dataValues.map((_, i) => `Hari ${i + 1}`),
            datasets: [{
                label: 'Gelas Terjual',
                data: dataValues,
                backgroundColor: 'rgba(59, 130, 246, 0.8)',
                hoverBackgroundColor: 'rgba(37, 99, 235, 1)',
                borderRadius: 8, // Membuat ujung bar melengkung
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 120,
                    grid: { color: 'rgba(0,0,0,0.05)' }
                },
                x: { grid: { display: false } }
            },
            animation: {
                duration: 400, // Animasi transisi 400ms
                easing: 'easeOutQuart'
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
}

function calculateStats(arr) {
    let sum = arr.reduce((a, b) => a + b, 0);
    let mean = (sum / arr.length).toFixed(1);

    let sorted = [...arr].sort((a, b) => a - b);
    let mid = Math.floor(sorted.length / 2);
    let median = sorted.length % 2 !== 0
        ? sorted[mid]
        : ((sorted[mid - 1] + sorted[mid]) / 2).toFixed(1);

    let freq = {};
    let maxFreq = 0;
    let modes = [];

    for (let num of arr) {
        freq[num] = (freq[num] || 0) + 1;
        if (freq[num] > maxFreq) maxFreq = freq[num];
    }

    for (let key in freq) {
        if (freq[key] === maxFreq) modes.push(key);
    }

    let modus = (maxFreq === 1) ? "-" : modes.join(', ');

    return { mean, median, modus };
}

function updateData(index, value) {
    let numValue = parseInt(value);
    dataValues[index] = numValue;
    document.getElementById(`val-${index}`).innerText = numValue;
    updateUI();
}

function addData() {
    if (dataValues.length >= 10) {
        alert("Batas maksimal 10 hari simulasi.");
        return;
    }
    dataValues.push(30);
    renderSliders();
    updateUI(true);
}

function removeData() {
    if (dataValues.length <= 3) {
        alert("Minimal 3 hari untuk perbandingan data.");
        return;
    }
    dataValues.pop();
    renderSliders();
    updateUI(true);
}

// Fungsi untuk memberi efek animasi saat angka berubah
function animateValue(id, newValue) {
    const obj = document.getElementById(id);
    obj.style.transform = 'scale(1.2)';
    obj.innerText = newValue;
    setTimeout(() => {
        obj.style.transform = 'scale(1)';
    }, 150);
    obj.style.transition = 'transform 0.15s ease-out';
}

function updateUI(labelsChanged = false) {
    if (labelsChanged) {
        statChart.data.labels = dataValues.map((_, i) => `Hari ${i + 1}`);
    }
    statChart.data.datasets[0].data = dataValues;
    statChart.update();

    let stats = calculateStats(dataValues);
    animateValue('mean-display', stats.mean);
    animateValue('median-display', stats.median);
    animateValue('modus-display', stats.modus);
}

// Menjalankan inisialisasi awal
renderSliders();
initChart();
updateUI();