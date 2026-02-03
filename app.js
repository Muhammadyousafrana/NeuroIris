// Global variables
let model = null;
let lossChart = null;
let accuracyChart = null;
let isModelTrained = false;

// Class names
const classNames = ['Setosa', 'Versicolor', 'Virginica'];

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initializeCharts();
    setupEventListeners();
    checkGPUSupport();
});

// Check GPU/WebGL support
async function checkGPUSupport() {
    const backend = tf.getBackend();
    console.log('TensorFlow.js backend:', backend);
    
    if (backend === 'webgl') {
        console.log('GPU acceleration is available!');
    } else {
        console.log('Running on CPU');
    }
}

// Setup event listeners
function setupEventListeners() {
    document.getElementById('trainBtn').addEventListener('click', trainModel);
    document.getElementById('classifyBtn').addEventListener('click', classifyIris);
}

// Initialize Chart.js charts
function initializeCharts() {
    const lossCtx = document.getElementById('lossChart').getContext('2d');
    const accuracyCtx = document.getElementById('accuracyChart').getContext('2d');
    
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 0
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Epoch'
                }
            },
            y: {
                beginAtZero: true
            }
        }
    };
    
    lossChart = new Chart(lossCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Training Loss',
                data: [],
                borderColor: 'rgb(220, 38, 38)',
                backgroundColor: 'rgba(220, 38, 38, 0.1)',
                tension: 0.1
            }]
        },
        options: {
            ...chartOptions,
            scales: {
                ...chartOptions.scales,
                y: {
                    ...chartOptions.scales.y,
                    title: {
                        display: true,
                        text: 'Loss'
                    }
                }
            }
        }
    });
    
    accuracyChart = new Chart(accuracyCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Training Accuracy',
                data: [],
                borderColor: 'rgb(34, 197, 94)',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                tension: 0.1
            }]
        },
        options: {
            ...chartOptions,
            scales: {
                ...chartOptions.scales,
                y: {
                    ...chartOptions.scales.y,
                    title: {
                        display: true,
                        text: 'Accuracy'
                    },
                    max: 1.0
                }
            }
        }
    });
}

// Create and compile the model
function createModel() {
    const model = tf.sequential();
    
    // Input layer with 4 features
    model.add(tf.layers.dense({
        inputShape: [4],
        units: 10,
        activation: 'relu'
    }));
    
    // Hidden layer
    model.add(tf.layers.dense({
        units: 10,
        activation: 'relu'
    }));
    
    // Output layer with 3 classes
    model.add(tf.layers.dense({
        units: 3,
        activation: 'softmax'
    }));
    
    return model;
}

// Train the model
async function trainModel() {
    const trainBtn = document.getElementById('trainBtn');
    const statusDiv = document.getElementById('trainingStatus');
    const epochs = parseInt(document.getElementById('epochs').value);
    const learningRate = parseFloat(document.getElementById('learningRate').value);
    
    // Disable training button
    trainBtn.disabled = true;
    trainBtn.textContent = 'Training...';
    
    // Reset charts
    lossChart.data.labels = [];
    lossChart.data.datasets[0].data = [];
    accuracyChart.data.labels = [];
    accuracyChart.data.datasets[0].data = [];
    
    try {
        // Show training status
        statusDiv.className = 'status training';
        statusDiv.textContent = 'Initializing model...';
        
        // Get data split
        const {trainData, trainLabels, testData, testLabels} = getTrainTestSplit(0.2);
        
        // Convert to tensors
        const xs = tf.tensor2d(trainData);
        const ys = tf.oneHot(tf.tensor1d(trainLabels, 'int32'), 3);
        
        // Create and compile model
        model = createModel();
        model.compile({
            optimizer: tf.train.adam(learningRate),
            loss: 'categoricalCrossentropy',
            metrics: ['accuracy']
        });
        
        statusDiv.textContent = `Training for ${epochs} epochs...`;
        
        // Train the model
        await model.fit(xs, ys, {
            epochs: epochs,
            batchSize: 16,
            shuffle: true,
            validationSplit: 0.2,
            callbacks: {
                onEpochEnd: async (epoch, logs) => {
                    // Update charts
                    lossChart.data.labels.push(epoch + 1);
                    lossChart.data.datasets[0].data.push(logs.loss);
                    lossChart.update();
                    
                    accuracyChart.data.labels.push(epoch + 1);
                    accuracyChart.data.datasets[0].data.push(logs.acc);
                    accuracyChart.update();
                    
                    // Update status
                    statusDiv.textContent = 
                        `Epoch ${epoch + 1}/${epochs} - ` +
                        `Loss: ${logs.loss.toFixed(4)}, ` +
                        `Accuracy: ${(logs.acc * 100).toFixed(2)}%`;
                    
                    // Allow UI to update
                    await tf.nextFrame();
                }
            }
        });
        
        // Evaluate on test set
        const testXs = tf.tensor2d(testData);
        const testYs = tf.oneHot(tf.tensor1d(testLabels, 'int32'), 3);
        const evalResult = model.evaluate(testXs, testYs);
        const testLoss = (await evalResult[0].data())[0];
        const testAcc = (await evalResult[1].data())[0];
        
        // Clean up test tensors
        testXs.dispose();
        testYs.dispose();
        evalResult[0].dispose();
        evalResult[1].dispose();
        
        // Show success message
        statusDiv.className = 'status success';
        statusDiv.innerHTML = 
            `<strong>Training Complete!</strong><br>` +
            `Test Accuracy: ${(testAcc * 100).toFixed(2)}%, ` +
            `Test Loss: ${testLoss.toFixed(4)}`;
        
        isModelTrained = true;
        document.getElementById('classifyBtn').disabled = false;
        
        // Clean up training tensors
        xs.dispose();
        ys.dispose();
        
    } catch (error) {
        statusDiv.className = 'status error';
        statusDiv.textContent = `Error: ${error.message}`;
        console.error(error);
    } finally {
        trainBtn.disabled = false;
        trainBtn.textContent = 'Start Training';
    }
}

// Classify a new iris sample
async function classifyIris() {
    if (!isModelTrained) {
        alert('Please train the model first!');
        return;
    }
    
    // Get input values
    const sepalLength = parseFloat(document.getElementById('sepalLength').value);
    const sepalWidth = parseFloat(document.getElementById('sepalWidth').value);
    const petalLength = parseFloat(document.getElementById('petalLength').value);
    const petalWidth = parseFloat(document.getElementById('petalWidth').value);
    
    // Validate inputs
    if (isNaN(sepalLength) || isNaN(sepalWidth) || isNaN(petalLength) || isNaN(petalWidth)) {
        alert('Please enter valid numbers for all measurements!');
        return;
    }
    
    // Create input tensor
    const input = tf.tensor2d([[sepalLength, sepalWidth, petalLength, petalWidth]]);
    
    // Make prediction
    const prediction = model.predict(input);
    const probabilities = await prediction.data();
    
    // Get predicted class
    const predictedClass = probabilities.indexOf(Math.max(...probabilities));
    const confidence = probabilities[predictedClass] * 100;
    
    // Display results
    const resultDiv = document.getElementById('result');
    resultDiv.className = 'result show';
    resultDiv.innerHTML = `
        <div class="species">${classNames[predictedClass]}</div>
        <div class="confidence">Confidence: ${confidence.toFixed(2)}%</div>
        <div class="probabilities">
            <strong>All Probabilities:</strong>
            ${classNames.map((name, i) => `
                <div class="prob-bar">
                    <div class="prob-label">
                        <span>${name}</span>
                        <span>${(probabilities[i] * 100).toFixed(2)}%</span>
                    </div>
                    <div class="prob-fill" style="width: ${probabilities[i] * 100}%"></div>
                </div>
            `).join('')}
        </div>
    `;
    
    // Clean up
    input.dispose();
    prediction.dispose();
}

// Helper function to fill sample data
function fillSample(sl, sw, pl, pw) {
    document.getElementById('sepalLength').value = sl;
    document.getElementById('sepalWidth').value = sw;
    document.getElementById('petalLength').value = pl;
    document.getElementById('petalWidth').value = pw;
}
