// 初始化图表
const ctx = document.getElementById('weightChart').getContext('2d');
const weightChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: '体重（公斤）',
            data: [],
            borderColor: 'rgb(70, 130, 180)',
            backgroundColor: 'rgba(70, 130, 180, 0.1)',
            tension: 0.1,
            fill: true
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                display: false // 隐藏图例
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return `体重: ${context.parsed.y} 公斤`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: false,
                title: {
                    display: true,
                    text: '体重（公斤）'
                }
            },
            x: {
                title: {
                    display: true,
                    text: '日期'
                }
            }
        }
    }
});

// 获取DOM元素
const weightForm = document.getElementById('weight-form');
const weightInput = document.getElementById('weight');
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

// 添加体重记录
function addWeight(event) {
    event.preventDefault();
    const weight = parseFloat(weightInput.value);
    const date = dateInput.value;

    console.log('添加体重记录:', { date, weight }); // 调试信息

    if (isNaN(weight) || !date) {
        alert('请输入有效的体重和日期');
        return;
    }

    weights.push({ date, weight });
    weights.sort((a, b) => new Date(a.date) - new Date(b.date));

    console.log('更新后的体重数据:', weights); // 调试信息

    updateChart();
    updateTable();
    saveData();

    weightInput.value = '';
    setDefaultDate(); // 重置日期为今天
}

// 更新图表
function updateChart() {
    console.log('更新图表'); // 调试信息
    weightChart.data.labels = weights.map(w => w.date);
    weightChart.data.datasets[0].data = weights.map(w => w.weight);
    weightChart.update();
}

// 更新表格
function updateTable() {
    console.log('更新表格'); // 调试信息
    weightData.innerHTML = '';
    weights.forEach((w, index) => {
        const row = weightData.insertRow();
        row.insertCell(0).textContent = w.date;
        row.insertCell(1).textContent = w.weight;
        const actionsCell = row.insertCell(2);
        actionsCell.innerHTML = `
            <button onclick="editWeight(${index})">编辑</button>
            <button onclick="deleteWeight(${index})">删除</button>
        `;
    });
}

// 编辑体重记录
function editWeight(index) {
    const newWeight = prompt('输入新的体重：', weights[index].weight);
    if (newWeight !== null && !isNaN(newWeight)) {
        weights[index].weight = parseFloat(newWeight);
        updateChart();
        updateTable();
        saveData();
    }
}

// 删除体重记录
function deleteWeight(index) {
    if (confirm('确定要删除这条记录吗？')) {
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
console.log('初始化时的体重数据:', weights); // 调试信息
updateChart();
updateTable();