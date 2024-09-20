let ruler;
let weightInput;

console.log('Script is running');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded');
    const rulerContainer = document.getElementById('weight-ruler-container');
    ruler = document.getElementById('weight-ruler');
    weightInput = document.getElementById('weight');
    console.log('Ruler container:', rulerContainer);
    console.log('Ruler:', ruler);
    console.log('Weight input:', weightInput);
    init();
});

// 初始化图表
const ctx = document.getElementById('weightChart').getContext('2d');
const weightChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: '体重（Kg）',
            data: [],
            borderColor: 'rgb(70, 130, 180)',
            backgroundColor: (context) => {
                const chart = context.chart;
                const {ctx, chartArea} = chart;
                if (!chartArea) {
                    return null;
                }
                const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
                gradient.addColorStop(0, 'rgba(135, 206, 235, 0)');  // 天空蓝色，完全透明
                gradient.addColorStop(1, 'rgba(135, 206, 235, 0.05)');  // 天空蓝色，5%不透明度
                return gradient;
            },
            tension: 0.4,
            fill: true,
            pointBackgroundColor: 'white',
            pointBorderColor: 'rgb(70, 130, 180)',
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 7
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                callbacks: {
                    title: function(tooltipItems) {
                        const date = new Date(tooltipItems[0].label);
                        return `日期${formatDate(date)}`;
                    },
                    label: function(context) {
                        return `体重: ${context.parsed.y.toFixed(1)} Kg`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: false,
                title: {
                    display: false // 删除纵坐标轴标题
                },
                grid: {
                    display: false // 删除横向网格线
                },
                ticks: {
                    font: {
                        size: 12
                    }
                }
            },
            x: {
                title: {
                    display: false // 删除横坐标轴标题
                },
                grid: {
                    display: false // 删除纵向网格线
                },
                ticks: {
                    font: {
                        size: 12
                    },
                    callback: function(value, index, values) {
                        // 修改日期格式为 MM/DD
                        const date = new Date(this.getLabelForValue(value));
                        return (date.getMonth() + 1).toString().padStart(2, '0') + '/' + date.getDate().toString().padStart(2, '0');
                    }
                }
            }
        }
    }
});

// 停止获取DOM元素
const weightForm = document.getElementById('weight-form');
const dateInput = document.getElementById('date');
const weightData = document.getElementById('weight-data');

// 设置日期输入默认值为今天
function setDefaultDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    dateInput.value = `${year}-${month}-${day}`;
}

// 从localStorage加载体重数据
let weights = JSON.parse(localStorage.getItem('weightData')) || [];

// 体重记录
function addWeight(event) {
    event.preventDefault();
    const weight = parseFloat(weightInput.value);
    const date = dateInput.value;

    console.log('添加体重记录:', { date, weight }); // 调试信息

    if (isNaN(weight) || !date) {
        alert('请输入有效的体重日期');
        return;
    }

    weights.push({ date, weight: parseFloat(weight.toFixed(1)) });
    weights.sort((a, b) => new Date(a.date) - new Date(b.date));

    console.log('更新后的体重数据:', weights); // 调试信息

    updateChart();
    updateTable();
    saveData();
    updateRuler(weight); // 新增：更新体重选择尺

    weightInput.value = '';
    setDefaultDate(); // 重置日期为今天
}

// 更新图表
function updateChart() {
    console.log('更新图表'); // 调试信息
    weightChart.data.labels = weights.map(w => new Date(w.date)); // 将日期字符串转换为 Date 对象
    weightChart.data.datasets[0].data = weights.map(w => w.weight);
    weightChart.update();
}

// 更新表格
function updateTable() {
    console.log('更新表格'); // 试信息
    weightData.innerHTML = '';
    weights.forEach((w, index) => {
        const row = weightData.insertRow();
        row.insertCell(0).textContent = w.date;
        row.insertCell(1).textContent = w.weight.toFixed(1);
        const actionsCell = row.insertCell(2);
        actionsCell.innerHTML = `
            <button onclick="editWeight(${index})">编辑</button>
            <button onclick="deleteWeight(${index})">删除</button>
        `;
    });
}

// 编辑体重记录
function editWeight(index) {
    const newWeight = prompt('输入新的体重（Kg）', weights[index].weight.toFixed(1));
    if (newWeight !== null && !isNaN(newWeight)) {
        weights[index].weight = parseFloat(newWeight);
        updateChart();
        updateTable();
        saveData();
    }
}

// 删除体重录
function deleteWeight(index) {
    if (confirm('确定要删除这条记录吗')) {
        weights.splice(index, 1);
        updateChart();
        updateTable();
        saveData();
    }
}

// 保存数据到localStorage
function saveData() {
    console.log('保存数据到localStorage'); // 调试信息
    localStorage.setItem('weightData', JSON.stringify(weights));
}

// 添加事件监听器
weightForm.addEventListener('submit', addWeight);

// 初始化
setDefaultDate();
console.log('初始化时的体重数:', weights); // 调试信息
updateChart();
updateTable();

// 获取弹窗元素
const privacyModal = document.getElementById("privacy-modal");
const contactModal = document.getElementById("contact-modal");
const privacyLink = document.getElementById("privacy-policy");
const contactLink = document.getElementById("contact-us");
const closeBtns = document.getElementsByClassName("close");

// 点击隐私政策链接时显示弹窗
privacyLink.onclick = function(event) {
    event.preventDefault();
    privacyModal.style.display = "block";
}

// 点击联系我们链接时显示弹窗
contactLink.onclick = function(event) {
    event.preventDefault();
    contactModal.style.display = "block";
}

// 点击关闭按时隐藏弹窗
for (let closeBtn of closeBtns) {
    closeBtn.onclick = function() {
        privacyModal.style.display = "none";
        contactModal.style.display = "none";
    }
}

// 点击弹窗外部时隐藏弹窗
window.onclick = function(event) {
    if (event.target == privacyModal) {
        privacyModal.style.display = "none";
    }
    if (event.target == contactModal) {
        contactModal.style.display = "none";
    }
}

// 修改数据存储和加载函数
function saveData() {
    localStorage.setItem('weightData', JSON.stringify(weights));
}

function loadUserData() {
    weights = JSON.parse(localStorage.getItem('weightData')) || [];
    updateChart();
    updateTable();
}

// 修改初始化函数
function init() {
    setDefaultDate();
    loadUserData();
    const latestWeight = weights.length > 0 ? weights[weights.length - 1].weight : 70;
    initWeightRuler(latestWeight);
}

// 新增的日期格式化函数
function formatDate(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 体重选择尺相关变量
const rulerContainer = document.getElementById('weight-ruler-container');
let isDragging = false;
let startX, startScrollLeft;

// 初始化体重选择尺
function initWeightRuler(defaultWeight = 70) {
    console.log('Initializing weight ruler');
    if (!ruler) {
        ruler = document.getElementById('weight-ruler');
    }
    if (!ruler) {
        console.error('Weight ruler element not found');
        return;
    }
    
    const minWeight = 0;
    const maxWeight = 150;
    const step = 1;
    const pixelsPerKg = 10;

    ruler.innerHTML = '';

    const totalWidth = (maxWeight - minWeight) * pixelsPerKg;
    ruler.style.width = `${totalWidth}px`;

    for (let i = minWeight; i <= maxWeight; i += step) {
        const mark = document.createElement('div');
        mark.classList.add('ruler-mark');
        
        if (i % 10 === 0) {
            mark.classList.add('big');
            const number = document.createElement('div');
            number.classList.add('ruler-number');
            number.textContent = i;
            mark.appendChild(number);
        } else {
            mark.classList.add('small');
        }
        
        mark.style.left = `${i * pixelsPerKg}px`;
        ruler.appendChild(mark);
    }

    console.log('Ruler marks created:', ruler.children.length);

    if (!document.getElementById('weight-cursor')) {
        const cursor = document.createElement('div');
        cursor.id = 'weight-cursor';
        rulerContainer.appendChild(cursor);
    }

    updateRuler(defaultWeight); // 使用传入的默认体重

    ruler.addEventListener('mousedown', startDragging);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDragging);
    document.addEventListener('mouseleave', stopDragging);

    ruler.addEventListener('touchstart', startDragging);
    document.addEventListener('touchmove', drag);
    document.addEventListener('touchend', stopDragging);
}

function startDragging(e) {
    isDragging = true;
    startX = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
    const transform = ruler.style.transform;
    const translateX = transform ? parseFloat(transform.replace('translateX(', '').replace('px)', '')) : 0;
    const containerWidth = rulerContainer.clientWidth;
    const pixelsPerKg = 10;
    startScrollLeft = (containerWidth / 2 - translateX) / pixelsPerKg;
    ruler.style.cursor = 'grabbing';
    e.preventDefault();
}

function drag(e) {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
    const walk = (startX - x) * 0.5; // 增加灵敏度
    const containerWidth = rulerContainer.clientWidth;
    const pixelsPerKg = 10;
    const newPosition = Math.max(0, Math.min(150, startScrollLeft + walk / pixelsPerKg));
    updateRuler(newPosition);
    console.log('Dragging', newPosition);
}

function stopDragging() {
    isDragging = false;
    ruler.style.cursor = 'grab';
}

function updateWeight(position) {
    const weight = Math.round(position * 10) / 10;
    const formattedWeight = weight.toFixed(1);
    weightInput.value = formattedWeight;
    document.getElementById('weight-display').textContent = formattedWeight;
    console.log('Updated weight:', formattedWeight, 'Position:', position);
}

function updateRuler(weight) {
    const minWeight = 0;
    const maxWeight = 150;
    const position = Math.max(minWeight, Math.min(maxWeight, weight));
    const containerWidth = rulerContainer.clientWidth;
    const pixelsPerKg = 10;
    const offset = containerWidth / 2;
    const translateX = offset - position * pixelsPerKg;
    ruler.style.transform = `translateX(${translateX}px)`;
    updateWeight(position);
    console.log('Ruler updated', { weight, position, translateX });
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded');
    init();
});