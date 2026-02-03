// ============================================
// Enhanced Iris Classifier with Security & Reliability
// ============================================

class IrisClassifier {
  constructor() {
    this.model = null;
    this.isTraining = false;
    this.isTrained = false;
    this.trainingData = null;
    this.species = ['setosa', 'versicolor', 'virginica'];
    this.inputStats = null;
    this.trainingStartTime = null;
    this. chart = null;
    this.trainingHistory = { accuracy: [], loss: [] };

    // Security:  Input validation constraints
    this.constraints = {
      min:  0,
      max: 10,
      step: 0.1
    };

    this.initializeUI();
  }

  // ============================================
  // UI Initialization & Management
  // ============================================

  initializeUI() {
    this.elements = {
      trainBtn: document.getElementById('trainBtn'),
      trainBtnText:  document.getElementById('trainBtnText'),
      trainSpinner: document.getElementById('trainSpinner'),
      statusBadge: document.getElementById('statusBadge'),
      statusText: document.getElementById('statusText'),
      progressSection: document.getElementById('progressSection'),
      progressFill: document.getElementById('progressFill'),
      progressGlow: document.getElementById('progressGlow'),
      progressText: document.getElementById('progressText'),
      progressPercent: document.getElementById('progressPercent'),
      metrics: document. getElementById('metrics'),
      accuracyValue: document.getElementById('accuracyValue'),
      lossValue: document.getElementById('lossValue'),
      epochValue: document.getElementById('epochValue'),
      timeValue: document.getElementById('timeValue'),
      chartContainer: document.getElementById('chartContainer'),
      trainingChart: document.getElementById('trainingChart'),
      predictionCard: document.getElementById('predictionCard'),
      predictionForm: document.getElementById('predictionForm'),
      result: document.getElementById('result'),
      resultSpecies: document.getElementById('resultSpecies'),
      resultConfidence: document.getElementById('resultConfidence'),
      confidenceBars: document.getElementById('confidenceBars'),
      examplesCard: document.getElementById('examplesCard'),
      resetBtn: document.getElementById('resetBtn'),
      toastContainer: document.getElementById('toastContainer')
    };

    this.setupEventListeners();
    this.updateStatus('ready', 'Ready');
  }

  setupEventListeners() {
    this.elements.trainBtn.addEventListener('click', () => this.handleTrain());
    this.elements. predictionForm.addEventListener('submit', (e) => this.handlePredict(e));
    this.elements.resetBtn.addEventListener('click', () => this.resetForm());

    // Example buttons
    document.querySelectorAll('.example-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.loadExample(e. currentTarget.dataset.example));
    });

    // Input validation on change
    ['sepalLength', 'sepalWidth', 'petalLength', 'petalWidth']. forEach(id => {
      const input = document.getElementById(id);
      input.addEventListener('input', (e) => this.validateInput(e.target));
    });
  }

  // ============================================
  // Status & UI Updates
  // ============================================

  updateStatus(state, text) {
    this.elements. statusBadge.className = `status-badge ${state}`;
    this.elements.statusText.textContent = text;
  }

  updateProgress(epoch, totalEpochs, logs) {
    const percent = ((epoch / totalEpochs) * 100).toFixed(0);
    this.elements.progressFill.style.width = `${percent}%`;
    this.elements.progressPercent.textContent = `${percent}%`;
    this.elements.progressText.textContent = `Epoch ${epoch} of ${totalEpochs}`;

    if (logs) {
      const accuracy = (logs.acc * 100).toFixed(1);
      const loss = logs.loss.toFixed(4);

      this.elements.accuracyValue.textContent = `${accuracy}%`;
      this.elements.lossValue.textContent = loss;
      this.elements.epochValue.textContent = epoch;

      // Update training time
      const elapsed = ((Date.now() - this.trainingStartTime) / 1000).toFixed(1);
      this.elements.timeValue.textContent = `${elapsed}s`;

      // Store for chart
      this.trainingHistory. accuracy.push(logs.acc);
      this.trainingHistory.loss.push(logs.loss);

      // Update chart
      this. updateChart();
    }
  }

  // ============================================
  // Toast Notifications
  // ============================================

  showToast(message, type = 'info') {
    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    };

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${icons[type] || icons.info}</span>
      <div class="toast-content">
        <div class="toast-message">${this.escapeHtml(message)}</div>
      </div>
      <button class="toast-close">×</button>
    `;

    this.elements.toastContainer.appendChild(toast);

    // Close button
    toast.querySelector('.toast-close').addEventListener('click', () => {
      toast.style.animation = 'slideOutRight 0.3s ease-out';
      setTimeout(() => toast.remove(), 300);
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (toast.parentElement) {
        toast.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
      }
    }, 5000);
  }

  // ============================================
  // Security:  Input Sanitization
  // ============================================

  escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<':  '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return String(text).replace(/[&<>"']/g, m => map[m]);
  }

  validateInput(input) {
    const value = parseFloat(input.value);

    if (isNaN(value)) {
      input.setCustomValidity('Please enter a valid number');
      return false;
    }

    if (value < this.constraints.min || value > this.constraints.max) {
      input.setCustomValidity(`Value must be between ${this.constraints.min} and ${this.constraints.max}`);
      return false;
    }

    input.setCustomValidity('');
    return true;
  }

  sanitizeInput(value) {
    const num = parseFloat(value);

    if (isNaN(num)) {
      throw new Error('Invalid number');
    }

    if (num < this.constraints.min || num > this.constraints.max) {
      throw new Error(`Value must be between ${this.constraints.min} and ${this.constraints.max}`);
    }

    return Math.round(num * 10) / 10; // Round to 1 decimal place
  }

  // ============================================
  // Data Loading & Processing
  // ============================================

  async loadData() {
    try {
      const response = await fetch('data/iris.csv');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const csvText = await response.text();
      const parsedData = this.parseCSV(csvText);

      if (! parsedData || parsedData.length === 0) {
        throw new Error('No valid data found in CSV file');
      }

      if (parsedData.length < 50) {
        throw new Error('Insufficient training data');
      }

      return this.processData(parsedData);
    } catch (error) {
      console.error('Data loading error:', error);
      throw new Error(`Failed to load training data: ${error.message}`);
    }
  }

  parseCSV(csvText) {
    const lines = csvText. trim().split('\n').filter(line => line.trim());

    if (lines.length < 2) {
      throw new Error('CSV file is empty or malformed');
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());

      if (values. length === headers.length) {
        const row = {};
        headers.forEach((header, index) => {
          row[header] = values[index];
        });
        data.push(row);
      }
    }

    return data;
  }

  processData(data) {
    const features = [];
    const labels = [];

    // Extract features
    const featureArrays = data.map(row => {
      const featureNames = ['sepal_length', 'sepallength', 'sepal. length'];
      const widthNames = ['sepal_width', 'sepalwidth', 'sepal.width'];
      const petalLengthNames = ['petal_length', 'petallength', 'petal. length'];
      const petalWidthNames = ['petal_width', 'petalwidth', 'petal.width'];

      const getFeature = (names) => {
        for (const name of names) {
          if (row[name] !== undefined) {
            const val = parseFloat(row[name]);
            if (!isNaN(val)) return val;
          }
        }
        return 0;
      };

      return [
        getFeature(featureNames),
        getFeature(widthNames),
        getFeature(petalLengthNames),
        getFeature(petalWidthNames)
      ];
    });

    // Calculate normalization statistics
    this.inputStats = this.calculateStats(featureArrays);

    // Process each row
    data.forEach((row, idx) => {
      const feature = featureArrays[idx];

      // Validate features
      if (feature.some(f => isNaN(f) || f < 0)) {
        return; // Skip invalid data
      }

      // Normalize features
      const normalizedFeature = feature.map((val, i) =>
        (val - this.inputStats.means[i]) / (this.inputStats.stds[i] || 1)
      );

      // Get species label
      const speciesNames = ['species', 'class', 'variety'];
      let speciesValue = '';

      for (const name of speciesNames) {
        if (row[name]) {
          speciesValue = row[name]. toLowerCase().trim();
          break;
        }
      }

      // Create one-hot encoded label
      const label = [
        speciesValue. includes('setosa') ? 1 : 0,
        speciesValue.includes('versicolor') ? 1 : 0,
        speciesValue.includes('virginica') ? 1 : 0
      ];

      if (label.some(l => l === 1)) {
        features.push(normalizedFeature);
        labels.push(label);
      }
    });

    if (features.length === 0) {
      throw new Error('No valid samples found in data');
    }

    console.log(`✓ Loaded ${features.length} valid samples`);

    return {
      features:  tf.tensor2d(features),
      labels: tf.tensor2d(labels),
      sampleCount: features.length
    };
  }

  calculateStats(featureArrays) {
    const means = [];
    const stds = [];

    for (let i = 0; i < 4; i++) {
      const values = featureArrays.map(arr => arr[i]).filter(v => !isNaN(v));

      if (values.length === 0) {
        means.push(0);
        stds.push(1);
        continue;
      }

      const mean = values.reduce((a, b) => a + b, 0) / values.length;
      const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
      const std = Math.sqrt(variance);

      means.push(mean);
      stds.push(std || 1); // Prevent division by zero
    }

    return { means, stds };
  }

  // ============================================
  // Model Building
  // ============================================

  buildModel() {
    try {
      const model = tf. sequential();

      // Input layer with regularization
      model.add(tf.layers.dense({
        units: 16,
        inputShape: [4],
        activation: 'relu',
        kernelInitializer: 'heNormal',
        kernelRegularizer: tf.regularizers. l2({ l2: 0.001 })
      }));
      model.add(tf. layers.dropout({ rate: 0.2 }));

      // Hidden layer
      model.add(tf.layers.dense({
        units: 8,
        activation: 'relu',
        kernelInitializer: 'heNormal',
        kernelRegularizer: tf.regularizers. l2({ l2: 0.001 })
      }));
      model.add(tf. layers.dropout({ rate: 0.1 }));

      // Output layer
      model.add(tf.layers.dense({
        units: 3,
        activation: 'softmax'
      }));

      // Compile model
      model.compile({
        optimizer: tf.train. adam(0.001),
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy']
      });

      console.log('✓ Model built successfully');
      return model;
    } catch (error) {
      console.error('Model building error:', error);
      throw new Error(`Failed to build model: ${error.message}`);
    }
  }

  // ============================================
  // Training
  // ============================================

  async handleTrain() {
    if (this.isTraining) {
      this.showToast('Training already in progress', 'warning');
      return;
    }

    try {
      this.isTraining = true;
      this.isTrained = false;
      this.trainingStartTime = Date. now();
      this.trainingHistory = { accuracy: [], loss:  [] };

      // Update UI
      this.elements.trainBtn.disabled = true;
      this.elements.trainBtn.classList.add('loading');
      this.elements.trainBtnText. textContent = 'Training...';
      this.updateStatus('training', 'Training...');
      this.elements.progressSection.style.display = 'block';
      this.elements.metrics.style.display = 'grid';

      // Load and prepare data
      this.showToast('Loading training data...', 'info');
      const data = await this.loadData();
      this.trainingData = data;

      // Build model
      this.showToast('Building neural network...', 'info');
      this.model = this.buildModel();

      // Initialize chart
      this.initChart();

      // Train model
      const totalEpochs = 100;
      await this.model.fit(data.features, data.labels, {
        epochs: totalEpochs,
        batchSize:  16,
        validationSplit: 0.2,
        shuffle: true,
        callbacks: {
          onEpochEnd:  async (epoch, logs) => {
            this.updateProgress(epoch + 1, totalEpochs, logs);
          },
          onTrainEnd: () => {
            console.log('✓ Training completed successfully');
          }
        }
      });

      // Clean up tensors
      data.features. dispose();
      data.labels. dispose();

      this.isTrained = true;
      this.updateStatus('ready', 'Model Trained ✓');
      this.showToast('Model trained successfully!  🎉', 'success');

      // Show prediction and examples cards
      this.elements.predictionCard.style.display = 'block';
      this.elements.examplesCard. style.display = 'block';
      this.elements.chartContainer.style.display = 'block';

    } catch (error) {
      console.error('Training error:', error);
      this.updateStatus('error', 'Training Failed');
      this.showToast(`Training failed: ${error.message}`, 'error');
    } finally {
      this.isTraining = false;
      this.elements.trainBtn.disabled = false;
      this.elements.trainBtn.classList.remove('loading');
      this.elements.trainBtnText.textContent = 'Start Training';
    }
  }

  // ============================================
  // Chart Visualization
  // ============================================

  initChart() {
    if (this.chart) {
      this.chart.destroy();
    }

    const ctx = this.elements.trainingChart.getContext('2d');

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label: 'Accuracy',
            data:  [],
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            borderWidth: 2,
            tension: 0.4,
            fill: true,
            yAxisID: 'y'
          },
          {
            label: 'Loss',
            data: [],
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            borderWidth: 2,
            tension:  0.4,
            fill: true,
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            labels: {
              color: '#f1f5f9',
              font: {
                family: 'Inter',
                size: 12
              }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(30, 41, 59, 0.95)',
            titleColor: '#f1f5f9',
            bodyColor: '#94a3b8',
            borderColor: '#334155',
            borderWidth: 1,
            padding: 12,
            displayColors: true
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Epoch',
              color: '#94a3b8',
              font: {
                family: 'Inter',
                size: 11
              }
            },
            grid: {
              color: 'rgba(51, 65, 85, 0.3)'
            },
            ticks: {
              color: '#94a3b8',
              font: {
                family: 'Inter'
              }
            }
          },
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            title: {
              display: true,
              text: 'Accuracy',
              color: '#10b981',
              font: {
                family: 'Inter',
                size: 11
              }
            },
            grid: {
              color: 'rgba(51, 65, 85, 0.3)'
            },
            ticks: {
              color:  '#94a3b8',
              font: {
                family: 'Inter'
              }
            }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            title: {
              display: true,
              text: 'Loss',
              color: '#ef4444',
              font: {
                family:  'Inter',
                size:  11
              }
            },
            grid: {
              drawOnChartArea: false,
            },
            ticks: {
              color: '#94a3b8',
              font: {
                family: 'Inter'
              }
            }
          }
        }
      }
    });
  }

  updateChart() {
    if (!this.chart) return;

    const epochs = this.trainingHistory.accuracy.length;
    this.chart.data.labels = Array.from({ length: epochs }, (_, i) => i + 1);
    this.chart.data.datasets[0].data = this.trainingHistory.accuracy;
    this. chart.data.datasets[1]. data = this.trainingHistory. loss;
    this.chart. update('none'); // Update without animation for performance
  }

  // ============================================
  // Prediction
  // ============================================

  async handlePredict(event) {
    event.preventDefault();

    if (!this.isTrained || !this.model) {
      this.showToast('Please train the model first', 'warning');
      return;
    }

    try {
      // Get and sanitize inputs
      const inputs = [
        this.sanitizeInput(document.getElementById('sepalLength').value),
        this.sanitizeInput(document.getElementById('sepalWidth').value),
        this.sanitizeInput(document.getElementById('petalLength').value),
        this.sanitizeInput(document.getElementById('petalWidth').value)
      ];

      // Validate all inputs
      if (inputs.some(val => isNaN(val))) {
        throw new Error('Please enter valid measurements');
      }

      // Normalize inputs using training statistics
      const normalizedInputs = inputs.map((val, idx) =>
        (val - this.inputStats.means[idx]) / this.inputStats.stds[idx]
      );

      // Make prediction
      const inputTensor = tf.tensor2d([normalizedInputs]);
      const prediction = this.model.predict(inputTensor);
      const probabilities = await prediction.data();

      // Clean up tensors
      inputTensor.dispose();
      prediction.dispose();

      // Display results
      this.displayPrediction(probabilities);

    } catch (error) {
      console.error('Prediction error:', error);
      this.showToast(`Prediction failed: ${error.message}`, 'error');
    }
  }

  displayPrediction(probabilities) {
    const maxIndex = probabilities.indexOf(Math.max(... probabilities));
    const predictedSpecies = this.species[maxIndex];
    const confidence = (probabilities[maxIndex] * 100).toFixed(1);

    // Update result display
    this.elements.resultSpecies.textContent = predictedSpecies;
    this.elements. resultConfidence.textContent = `${confidence}% confident`;

    // Create confidence bars
    let barsHTML = '';
    this.species.forEach((species, index) => {
      const prob = (probabilities[index] * 100).toFixed(1);
      const isWinner = index === maxIndex;

      barsHTML += `
        <div class="confidence-bar ${isWinner ? 'winner' : ''}">
          <div class="confidence-label">
            <span>${species}</span>
            <span>${prob}%</span>
          </div>
          <div class="confidence-track">
            <div class="confidence-fill" style="width: ${prob}%"></div>
          </div>
        </div>
      `;
    });

    this.elements.confidenceBars.innerHTML = barsHTML;
    this.elements.result.style.display = 'block';

    // Scroll to result
    this.elements.result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    this.showToast(`Classified as ${predictedSpecies} with ${confidence}% confidence`, 'success');
  }

  // ============================================
  // Form Utilities
  // ============================================

  resetForm() {
    this.elements.predictionForm.reset();
    this.elements.result.style.display = 'none';
    this.showToast('Form reset', 'info');
  }

  loadExample(example) {
    const examples = {
      setosa: [5.1, 3.5, 1.4, 0.2],
      versicolor: [5.9, 3.0, 5.1, 1.8],
      virginica: [6.5, 3.0, 5.8, 2.2]
    };

    const values = examples[example];
    if (! values) return;

    document.getElementById('sepalLength').value = values[0];
    document.getElementById('sepalWidth').value = values[1];
    document.getElementById('petalLength').value = values[2];
    document.getElementById('petalWidth').value = values[3];

    this.showToast(`Loaded ${example} example`, 'info');

    // Auto-scroll to form
    this.elements.predictionCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // ============================================
  // Memory Management
  // ============================================

  dispose() {
    if (this.model) {
      this.model. dispose();
      this.model = null;
    }

    if (this.trainingData) {
      if (this.trainingData.features) this.trainingData.features.dispose();
      if (this.trainingData.labels) this.trainingData.labels.dispose();
      this.trainingData = null;
    }

    if (this.chart) {
      this.chart. destroy();
      this.chart = null;
    }

    console.log('✓ Resources cleaned up');
  }
}

// ============================================
// Application Initialization
// ============================================

let classifier = null;

async function initializeApp() {
  const loadingOverlay = document.getElementById('loadingOverlay');

  try {
    // Show loading overlay
    loadingOverlay.style.display = 'flex';

    // Check if TensorFlow.js is loaded
    if (typeof tf === 'undefined') {
      throw new Error('TensorFlow.js failed to load.  Please check your internet connection.');
    }

    console.log('TensorFlow.js version:', tf.version. tfjs);

    // Set backend preference
    await tf.ready();

    // Try to set WebGL backend
    try {
      await tf.setBackend('webgl');
      console.log('✓ Using WebGL backend');
    } catch (e) {
      console.warn('WebGL not available, using CPU backend');
      await tf.setBackend('cpu');
    }

    console.log('✓ TensorFlow.js backend:', tf.getBackend());

    // Initialize classifier
    classifier = new IrisClassifier();
    console.log('✓ Iris Classifier initialized successfully');

    // Make it globally accessible for debugging
    window.classifier = classifier;
    window.tf = tf;

    // Hide loading overlay
    loadingOverlay.style.display = 'none';

  } catch (error) {
    console.error('Initialization error:', error);
    loadingOverlay.innerHTML = `
      <div style="text-align: center; color: #ef4444;">
        <div style="font-size: 3rem; margin-bottom: 1rem;">⚠️</div>
        <div style="font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem;">
          Initialization Failed
        </div>
        <div style="color: #94a3b8;">
          ${error.message}
        </div>
        <button onclick="location.reload()" style="
          margin-top: 2rem;
          padding: 0.75rem 2rem;
          background:  linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
        ">
          Retry
        </button>
      </div>
    `;
  }
}

// ============================================
// Event Listeners
// ============================================

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  if (classifier) {
    classifier.dispose();
  }
});

// Handle visibility change to pause/resume
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    console.log('Page hidden - pausing');
  } else {
    console.log('Page visible - resuming');
  }
});

// Add slide out animation for toast
const style = document.createElement('style');
style.textContent = `
  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(120%);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);
