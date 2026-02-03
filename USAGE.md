# NeuroIris Usage Guide

## Quick Start

1. **Open the Application**
   - Clone or download this repository
   - Open `index.html` in any modern web browser
   - No installation or setup required!

2. **Train the Model**
   - Click the "Start Training" button
   - Watch as the neural network trains in real-time
   - Observe the loss and accuracy charts update
   - Training typically completes in 2-5 seconds

3. **Classify Flowers**
   - Enter measurements for a flower (in centimeters)
   - Click "Classify" to see the prediction
   - The app shows confidence scores for all three species

## Features Explained

### Browser-Based Training
- All computation happens in your browser
- Uses TensorFlow.js for neural network operations
- Automatically leverages WebGL for GPU acceleration when available
- No data leaves your device - complete privacy

### Real-Time Visualization
- **Loss Chart**: Shows how well the model is learning (lower is better)
- **Accuracy Chart**: Shows prediction accuracy on training data (higher is better)
- Both charts update live during training

### Model Architecture
```
Input Layer:  4 neurons (sepal length, sepal width, petal length, petal width)
Hidden Layer: 10 neurons with ReLU activation
Hidden Layer: 10 neurons with ReLU activation  
Output Layer: 3 neurons with Softmax (Setosa, Versicolor, Virginica)
```

### Training Parameters
- **Epochs**: Number of times to iterate over the entire dataset (default: 50)
  - More epochs = better training but takes longer
  - Range: 10-200 epochs
  
- **Learning Rate**: Controls how quickly the model learns (default: 0.01)
  - Higher = faster learning but may be unstable
  - Lower = slower but more stable learning
  - Range: 0.001-0.1

## Sample Test Cases

The app includes three pre-filled sample cases:

### Setosa Sample
- Sepal Length: 5.1 cm
- Sepal Width: 3.5 cm
- Petal Length: 1.4 cm
- Petal Width: 0.2 cm
- **Expected**: Setosa (typically 99%+ confidence)

### Versicolor Sample
- Sepal Length: 5.5 cm
- Sepal Width: 2.4 cm
- Petal Length: 3.8 cm
- Petal Width: 1.1 cm
- **Expected**: Versicolor (typically 95%+ confidence)

### Virginica Sample
- Sepal Length: 6.3 cm
- Sepal Width: 2.9 cm
- Petal Length: 5.6 cm
- Petal Width: 1.8 cm
- **Expected**: Virginica (typically 95%+ confidence)

## Understanding the Results

After classification, you'll see:
1. **Predicted Species**: The most likely iris type
2. **Confidence**: How certain the model is (0-100%)
3. **Probability Bars**: Visual representation of all three class probabilities

Example output:
```
Virginica
Confidence: 98.5%

All Probabilities:
Setosa       ████ 1.2%
Versicolor   ████ 0.3%
Virginica    ████████████████████ 98.5%
```

## Technical Details

### Dataset
- **Source**: Classic Fisher's Iris dataset (1936)
- **Size**: 150 samples
- **Classes**: 3 species (50 samples each)
- **Features**: 4 continuous measurements in centimeters
- **Split**: 80% training, 20% testing (randomly shuffled)

### Neural Network
- **Framework**: TensorFlow.js 4.11.0
- **Type**: Feedforward neural network (Dense layers)
- **Loss Function**: Categorical Crossentropy
- **Optimizer**: Adam
- **Metrics**: Accuracy

### Performance
- **Training Time**: ~2-5 seconds (depends on device)
- **Expected Accuracy**: 95-100% on test set
- **GPU Acceleration**: Automatic via WebGL
- **Browser Memory**: ~10-20 MB

## Browser Compatibility

### Fully Supported
- Chrome 80+
- Firefox 75+
- Edge 80+
- Safari 13+
- Opera 67+

### Requirements
- JavaScript enabled
- Modern ES6 support
- WebGL support (for GPU acceleration)

## Troubleshooting

### Charts Not Showing
- Check browser console for errors
- Ensure Chart.js CDN is accessible
- Try refreshing the page

### Training Fails
- Check TensorFlow.js loaded correctly (see browser console)
- Ensure you have a modern browser
- Try lowering the number of epochs

### Low Accuracy
- Try training for more epochs (e.g., 100)
- Adjust learning rate (try 0.01 or 0.001)
- Refresh and try again (random initialization)

### Slow Performance
- GPU acceleration should be automatic
- Check browser console for backend info
- Close other tabs to free up memory
- Try reducing epochs for faster training

## Tips for Best Results

1. **First Time Use**: Train with default parameters (50 epochs, 0.01 learning rate)
2. **Experimentation**: Try different learning rates to see the impact
3. **Understanding**: Watch the charts to understand how neural networks learn
4. **Testing**: Use the sample buttons to verify model accuracy
5. **Custom Data**: Try your own measurements (must be realistic values)

## Privacy & Security

- ✅ All data processing happens locally in your browser
- ✅ No data is sent to any server
- ✅ No cookies or tracking
- ✅ No internet required after initial page load
- ✅ Works offline (if you save the page locally)

## Educational Use

This app is perfect for:
- Learning machine learning basics
- Understanding neural network training
- Demonstrating browser-based ML
- Teaching classification concepts
- Exploring the classic Iris dataset

## Next Steps

After using this app, you might want to:
1. Explore the source code in `app.js` and `iris-data.js`
2. Modify the neural network architecture
3. Try different hyperparameters
4. Build your own browser-based ML app
5. Learn more about TensorFlow.js

## Resources

- [TensorFlow.js Documentation](https://www.tensorflow.org/js)
- [Iris Dataset Information](https://en.wikipedia.org/wiki/Iris_flower_data_set)
- [Neural Networks Explained](https://www.3blue1brown.com/topics/neural-networks)

---

**Enjoy exploring machine learning in your browser! 🌸**
