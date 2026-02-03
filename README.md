# NeuroIris

NeuroIris is a client-side Machine Learning web app that trains a small neural network directly in the browser using the Iris dataset. No backend or data upload is required — everything runs locally in the user's browser using TensorFlow.js. Start training with one click and classify iris flowers in real time.

![App screenshot](assets/screenshot.png)

> Note: The screenshot above is a placeholder. See "Add or update screenshot" below for instructions to capture and add a real image.

Table of contents
- [Demo / Quick start](#demo--quick-start)
- [Features](#features)
- [How it works](#how-it-works)
- [Model architecture & training configuration](#model-architecture--training-configuration)
- [Project structure](#project-structure)
- [Usage](#usage)
- [Developing / Running locally](#developing--running-locally)
- [Troubleshooting & tips](#troubleshooting--tips)
- [Add or update screenshot](#add-or-update-screenshot)
- [Licensing](#licensing)
- [Contributing](#contributing)

Demo / Quick start
- Open `index.html` in your browser to run locally (recommended to serve over HTTP for full browser compatibility).
- Or run a quick static server:
```bash
# Python 3
python -m http.server 8000
# then open http://localhost:8000 in your browser
```

Features
- Fully client-side training and inference using TensorFlow.js (no server).
- Train a small neural network on the Iris dataset (150 samples, 4 features).
- Real-time training progress, accuracy/loss charts, and prediction UI.
- Example inputs for the three Iris species (Setosa, Versicolor, Virginica).
- Input validation and basic UI notifications/toasts.
- Resource cleanup when the page unloads.

How it works
- All app logic lives in `js/app.js` which:
  - Loads and preprocesses the dataset (normalization).
  - Builds and compiles a TensorFlow.js model.
  - Trains the model in-browser and updates the UI on each epoch.
  - Accepts user inputs, normalizes them using the same stats as training, and performs inference.
- UI is in `index.html` (cards for training, prediction, examples, and charts).

Key files
- [index.html](https://github.com/Muhammadyousafrana/NeuroIris/blob/69bd96c84aaeab56ac408ce076c8879dac03e8ca/index.html) — Main UI and layout.
- [js/app.js](https://github.com/Muhammadyousafrana/NeuroIris/blob/69bd96c84aaeab56ac408ce076c8879dac03e8ca/js/app.js) — Main application class (`IrisClassifier`) and initialization logic.
- assets/ — (recommended) place to store images such as `screenshot.png`.

Model architecture & training configuration
- Model (from `js/app.js`):
  - Input: 4 features (sepal length, sepal width, petal length, petal width)
  - Dense(16, relu) + L2 regularization + Dropout(0.2)
  - Dense(8, relu) + L2 regularization + Dropout(0.1)
  - Output Dense(3, softmax)
  - Optimizer: Adam (learning rate 0.001)
  - Loss: categoricalCrossentropy
  - Metrics: accuracy
- Training:
  - Epochs: 100
  - Batch size: 16
  - Validation split: 0.2
  - Shuffle: true
  - The app updates a training chart and shows accuracy/loss per epoch.

Project structure (recommended overview)
- index.html — UI markup and cards for training & prediction
- css/ — (if present) styles for layout and theme
- js/app.js — main logic; UI initialization, event handlers, model build/train/predict
- assets/screenshot.png — app screenshot (add this for README)

Usage (end user)
1. Open the app (index.html).
2. Click "Train" to start training in your browser. Watch training progress and charts.
3. After training completes, use the prediction form to enter measurements and classify.
4. Use example buttons to quickly fill the form with known iris measurements.

Developing / Running locally
1. Clone the repository:
```bash
git clone https://github.com/Muhammadyousafrana/NeuroIris.git
cd NeuroIris
```
2. Serve the files using a simple HTTP server:
```bash
python -m http.server 8000
# or
npx http-server -p 8000
```
3. Open `http://localhost:8000` in a modern browser (Chrome, Firefox, Edge). TensorFlow.js requires a reasonably up-to-date browser for WebGL acceleration.

Troubleshooting & tips
- If training is slow, try disabling other heavy browser tabs or use Chrome with GPU acceleration enabled.
- If predictions show NaN or errors: ensure you trained the model first and that inputs are within the allowed range (app enforces 0.0–10.0, step 0.1).
- For debugging, open DevTools console — the app logs model building/training steps.
- The app cleans up tensors and chart resources on unload, but if you see memory growth, refresh the page.

Add or update screenshot
1. Capture a screenshot of the running app (e.g., after training shows results).
2. Place the image file at `assets/screenshot.png` in the repository root.
   - Recommended size: 1200×700 (or scale down for GitHub).
3. Commit and push:
```bash
git add assets/screenshot.png README.md
git commit -m "Add README and app screenshot"
git push
```
4. The README already references `assets/screenshot.png`, so once the image file is present it will display on GitHub.

If you'd like, I can:
- Create the `README.md` file in a branch and open a pull request for you.
- Or, if you upload a screenshot here (paste or attach), I can embed the actual image and produce a PR with both README and screenshot.

License
- If you don't have a LICENSE file, consider adding an MIT license. I can draft one for you if you want.

Contributing
- Contributions are welcome. For bug reports or feature requests, open an issue in the repo.
- For code changes, please open a pull request and describe the changes.

Acknowledgements
- Built with TensorFlow.js and the classic Iris dataset.
