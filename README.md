# NeuroIris 🌸

NeuroIris is a client-side ML web app that trains a neural network directly in the browser using the Iris dataset. Users start training with one click and classify Iris flowers in real time—no backend, no data upload, fully local.

## Features

- 🚀 **Browser-based Training**: Train a neural network entirely in your browser using TensorFlow.js
- 💻 **Local CPU/GPU**: Automatically uses WebGL for GPU acceleration when available
- 📊 **Real-time Visualization**: Watch training progress with live loss and accuracy charts
- 🎯 **Instant Classification**: Classify iris flowers immediately after training
- 🔒 **Privacy-First**: All computation happens locally - no data leaves your device
- 📱 **Responsive Design**: Works on desktop and mobile browsers

## How to Use

1. **Open the App**: Simply open `index.html` in a modern web browser (Chrome, Firefox, Edge, Safari)

2. **Train the Model**:
   - Adjust training parameters (epochs, learning rate) if desired
   - Click "Start Training" button
   - Watch the training progress and charts update in real-time

3. **Classify Iris Flowers**:
   - Enter flower measurements (sepal length/width, petal length/width in cm)
   - Click "Classify" to get instant predictions
   - Use sample buttons to test with pre-filled examples

## Technical Details

### Model Architecture
- **Input Layer**: 4 features (sepal length, sepal width, petal length, petal width)
- **Hidden Layer 1**: 10 neurons with ReLU activation
- **Hidden Layer 2**: 10 neurons with ReLU activation
- **Output Layer**: 3 neurons with Softmax activation (for 3 iris species)

### Dataset
- **Classic Iris Dataset**: 150 samples
- **Classes**: Setosa, Versicolor, Virginica (50 samples each)
- **Train/Test Split**: 80/20 with shuffling

### Technologies
- **TensorFlow.js 4.11.0**: For neural network training and inference
- **Chart.js 4.4.0**: For real-time training visualization
- **Vanilla JavaScript**: No framework dependencies
- **Pure CSS**: Custom responsive styling

## Browser Requirements

- Modern browser with JavaScript enabled
- WebGL support for GPU acceleration (optional but recommended)
- Supported browsers: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+

## Running Locally

No build process required! Simply:

```bash
# Clone the repository
git clone https://github.com/Muhammadyousafrana/NeuroIris.git
cd NeuroIris

# Open in browser (choose one method)
# Method 1: Direct file open
open index.html

# Method 2: Using Python's built-in server
python -m http.server 8000
# Then visit http://localhost:8000

# Method 3: Using Node.js http-server
npx http-server -p 8000
# Then visit http://localhost:8000
```

## Performance

- **Training Time**: ~2-5 seconds for 50 epochs (varies by device)
- **Typical Accuracy**: 95-100% on test set
- **GPU Acceleration**: Automatically enabled when available (WebGL)
- **Memory Usage**: ~10-20MB

## Example Classifications

**Setosa Sample**:
- Sepal Length: 5.1 cm
- Sepal Width: 3.5 cm
- Petal Length: 1.4 cm
- Petal Width: 0.2 cm

**Versicolor Sample**:
- Sepal Length: 5.5 cm
- Sepal Width: 2.4 cm
- Petal Length: 3.8 cm
- Petal Width: 1.1 cm

**Virginica Sample**:
- Sepal Length: 6.3 cm
- Sepal Width: 2.9 cm
- Petal Length: 5.6 cm
- Petal Width: 1.8 cm

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## About the Iris Dataset

The Iris dataset is one of the most famous datasets in machine learning, introduced by Ronald Fisher in 1936. It's perfect for learning classification algorithms and is often used as a "Hello World" for machine learning.
