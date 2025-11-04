# MediNet Use Case: Predicting Heart Failure Mortality

## Introduction: The Problem We're Solving

Heart failure is a serious medical condition where the heart cannot pump blood effectively throughout the body. Medical professionals need to predict which patients are at higher risk of mortality to provide appropriate care and interventions. However, creating accurate prediction models requires large amounts of patient data, which is often scattered across different hospitals and cannot be shared due to privacy regulations like GDPR and HIPAA.

**This is where MediNet comes in.** MediNet allows researchers to train machine learning models on data from multiple hospitals without the data ever leaving those hospitals. This approach, called **federated learning**, solves the privacy problem while still enabling powerful collaborative research.

---

## What You'll Learn in This Use Case

In this practical example, you will:

1. **Understand the clinical problem**: Why predicting heart failure mortality matters and what data we use
2. **Access the MediNet platform**: How to connect to the research environment
3. **Explore the dataset**: Understanding the 12 clinical features that predict mortality
4. **Design a neural network**: Creating an AI model architecture without coding
5. **Configure training parameters**: Understanding what learning rate, epochs, and batch size mean and why they matter
6. **Train and optimize the model**: Running the training process and improving results
7. **Validate the final model**: Confirming your model is ready for clinical use

By the end of this guide, you'll have trained a working deep learning model for heart failure mortality prediction using real-world clinical data.

---

## Previous Knowledge: What You Need to Know

This section covers the essential concepts you'll encounter when working with federated learning:

### What is Federated Learning?

**Federated learning** is a machine learning approach that trains models across multiple decentralized locations without ever moving the data from its source.

**The key principle**: Instead of bringing data to the model, we bring the model to the data.

**Traditional centralized approach**:
```
Hospital A ──┐
             ├─→ [Central Server with all data] ─→ Trained Model
Hospital B ──┤
Hospital C ──┘

❌ Problem: Patient data must leave hospitals (privacy violation, GDPR/HIPAA issues)
❌ Problem: Data transfer is slow, expensive, and risky
❌ Problem: Hospitals reluctant to share sensitive data
```

**Federated learning approach**:
```
Hospital A ←──┐
              ├─ [Initial Model] ─→ [Coordinator Server]
Hospital B ←──┤     (distributes model)
Hospital C ←──┘

Each hospital:
1. Trains model on local data (data never leaves)
2. Sends only model updates (learned patterns) back

Coordinator:
3. Aggregates all updates
4. Creates improved global model
5. Redistributes to hospitals

✅ Benefit: Data stays at source (privacy preserved)
✅ Benefit: Hospitals can collaborate without sharing raw data
✅ Benefit: Model learns from diverse datasets across institutions
```

This solves a fundamental problem in medical research: how to leverage data from multiple sources while respecting privacy regulations and institutional policies.

### What is Differential Privacy?

**Differential privacy** is a mathematical framework that adds carefully calibrated noise to data or model updates to protect individual privacy while preserving overall patterns.

**The concept**: Even if someone has access to model updates, they cannot determine if any specific patient's data was included in the training.

**How it works in federated learning**:

When Hospital A sends model updates back to the coordinator, differential privacy mechanisms ensure:
- Individual patient information cannot be reverse-engineered from the updates
- The noise added is mathematically proven to protect privacy
- The overall learning signal remains strong enough for the model to improve

**Analogy**: Imagine asking people their salaries:
- **Without privacy**: "I earn exactly €45,230" → revealing
- **With differential privacy**: "I earn approximately €45,000 ± €5,000" → preserves privacy while still useful for statistics

**Key parameter - Epsilon (ε)**:
- **Lower ε** (e.g., 0.1): Stronger privacy, more noise, slightly less accurate model
- **Higher ε** (e.g., 10): Weaker privacy guarantees, less noise, more accurate model

MediNet implements differential privacy to add an additional layer of protection beyond the federated architecture itself.

### What is a Neural Network?

A **neural network** is a type of machine learning model inspired by how the human brain works. It consists of layers of interconnected "neurons" that process information:

```
Input Layer (Patient Data)
    ↓
Hidden Layer 1 (Pattern Detection)
    ↓
Hidden Layer 2 (Complex Pattern Recognition)
    ↓
Output Layer (Risk Prediction)
```

Each layer learns to recognize different patterns:
- **First hidden layer**: Might learn simple patterns like "high creatinine = kidney problems"
- **Second hidden layer**: Might learn complex combinations like "high creatinine + low ejection fraction + advanced age = very high risk"
- **Output layer**: Combines everything to produce a final prediction: risk of mortality (0-100%)

### What is Federated Learning?

**Federated learning** is a way to train machine learning models across multiple locations without sharing the raw data.

**Traditional approach** (not privacy-preserving):
1. Hospital A sends patient data to central server
2. Hospital B sends patient data to central server
3. Hospital C sends patient data to central server
4. Central server trains model on combined data
5. ❌ **Problem**: Patient data left the hospitals (privacy violation)

**Federated learning approach** (privacy-preserving):
1. Central server sends initial model to all hospitals
2. Each hospital trains the model on its local data (data never leaves)
3. Each hospital sends only the learned patterns (model updates) back to server
4. Central server combines all the learned patterns into an improved model
5. ✅ **Benefit**: Patient data never leaves the hospitals (privacy maintained)

### Key Terms You'll Encounter

**Training**: The process of teaching the model to recognize patterns in data. Like studying for an exam.

**Epoch**: One complete pass through all the training data. If you study the same material 10 times, that's 10 epochs.

**Learning Rate**: How big of a step the model takes when adjusting based on errors. Too big = overshooting, too small = very slow learning.

**Batch Size**: How many examples the model looks at before updating its understanding. Like studying 10 flashcards at a time instead of all 1000 at once.

**Loss Function**: A way to measure how wrong the model's predictions are. The goal of training is to minimize this loss.

**Accuracy**: Percentage of predictions that are correct. 85% accuracy means the model got 85 out of 100 predictions right.

**Overfitting**: When a model memorizes the training data instead of learning general patterns. Like a student who memorizes answers but doesn't understand the concepts.

---

## Getting Started: Accessing MediNet Hub

### Step 1: Access the Platform

MediNet Hub is accessible through a web interface at:

**🌐 https://medinet-hub.isglobal.org**

_(Note: The platform is currently in controlled access for research institutions)_

### Step 2: Request Your Credentials

To access MediNet Hub, you need to request research credentials. Contact our team at:

📧 **juanr.gonzalez@isglobal.org**
📧 **ramon.mateo@isglobal.org**

In your email, please include:
- Your name and institutional affiliation
- Your research project description
- The clinical problem you're addressing
- Your role (researcher, clinician, data scientist, etc.)

Our team will review your request and provide you with:
- **Username**: Your unique researcher identifier
- **Password**: Secure access credential
- **API Key**: For programmatic access (if needed)
- **Access permissions**: Which datasets you can use

### Step 3: Log In

Once you receive your credentials:

1. Navigate to **https://medinet-hub.isglobal.org**
2. Enter your **username** and **password**
3. Click **"Sign In"**
4. You'll be directed to the main dashboard

**🎉 You're now ready to start your federated learning research!**

---

## The Clinical Problem: Heart Failure Mortality Prediction

### Why This Matters

Heart failure affects millions of people worldwide. Medical professionals need tools to assess mortality risk and guide treatment decisions. However, creating accurate predictive models requires large, diverse datasets—data that is scattered across hospitals and cannot be shared due to privacy regulations like GDPR and HIPAA.

**This is the perfect scenario for federated learning.** Instead of centralizing sensitive patient data, we can train a model that learns from multiple hospitals simultaneously while the data never leaves its source.

### The Power of Federated Learning in Healthcare

Imagine three hospitals:
- **Hospital A** has 500 heart failure patients (urban, younger population)
- **Hospital B** has 800 heart failure patients (rural, older population)
- **Hospital C** has 600 heart failure patients (diverse demographics)

**Traditional approach limitations**:
- Each hospital trains models on only their local data → biased, less generalizable
- Sharing data centrally → violates privacy, requires complex legal agreements, risky

**Federated approach advantages**:
- Model learns patterns from all 1,900 patients combined
- Each hospital's data remains local and secure
- Resulting model is more robust and generalizable
- No data sharing agreements needed beyond model participation

**The key insight**: By sending the model to the data (not data to the model), we can collaborate at scale while respecting privacy.

### The Dataset for This Use Case

For this demonstration, we'll use a **heart failure clinical dataset** that serves as a representative example of real-world medical data. This dataset contains patient records with clinical features relevant to predicting mortality risk.

**Dataset characteristics**:
- **Clinical domain**: Cardiovascular medicine / Heart failure
- **Prediction target**: Mortality risk (binary: survival vs death)
- **Features**: Patient demographics, lab values, and clinical measurements
- **Data type**: Structured tabular data (typical for electronic health records)

**Why this dataset?**

This dataset demonstrates the type of predictive modeling task common in healthcare:
- Binary classification (yes/no outcome)
- Mix of continuous and categorical features
- Clinical features validated in medical literature
- Real-world class imbalance (more survivors than deaths)
- Representative of data hospitals actually collect

**The federated learning advantage**:

In a real deployment, this type of dataset would exist at multiple hospitals:
- Each hospital has similar clinical features but different patient populations
- Combining insights from all hospitals improves model generalization
- Federated learning enables this collaboration without data centralization

**Important note**: The specific clinical features and their relationships are less important for this use case than understanding *how* to configure and train a federated model on medical data. The workflow you'll learn applies to any healthcare prediction task: disease diagnosis, treatment response, patient risk stratification, readmission prediction, etc.

---

## Workflow Overview: From Data to Validated Model

The complete process follows these steps:

```
1. Access Platform
   → Log in to MediNet Hub

2. Explore Dataset
   → Understand the 12 clinical features
   → Validate data quality and structure

3. Design Model Architecture
   → Use visual Model Designer
   → Configure layers and neurons
   → No coding required

4. Configure Training Parameters
   → Set learning rate
   → Define number of epochs
   → Select loss function and batch size

5. Execute Initial Training
   → Launch federated training
   → Monitor real-time metrics
   → Review performance results

6. Iterative Optimization
   → Analyze training curves
   → Adjust hyperparameters
   → Retrain and compare results

7. Final Validation
   → Confirm model meets clinical requirements
   → Document performance metrics
   → Prepare for deployment or further testing
```

---

## Step-by-Step Guide

### Step 1: Dataset Selection and Exploration

After logging into MediNet Hub, navigate to the **"Datasets"** section from the main dashboard.

**What you see**: A list of available datasets that you have permission to access. For this use case, select **"Heart Failure Clinical Records"**.

**Dataset Information Panel**:
- **Name**: Heart Failure Clinical Records
- **Samples**: 299 patient records
- **Features**: 12 clinical measurements
- **Target**: DEATH_EVENT (binary: 0=survived, 1=died)
- **Location**: Data remains at Hospital X (never transferred)
- **Status**: Pre-processed and ready for training

**Why this step matters**: Before building any model, you need to understand your data. What features are available? What are you trying to predict? Is the data clean and properly formatted? This exploration phase ensures you're working with appropriate data for your clinical question.

**Action**: Click on the dataset name to view detailed metadata, feature descriptions, and basic statistics.

---

### Step 2: Model Architecture Design

Navigate to **"Model Studio"** → **"Model Designer"** from the main menu.

**What you're doing**: You're about to design the "brain" of your AI model—the neural network architecture that will learn patterns from the patient data.

**Understanding the Model Designer Interface**:

The Model Designer is a visual drag-and-drop interface where you build your neural network layer by layer. Think of it like stacking LEGO blocks, where each block is a layer that processes information.

**Key Components**:

1. **Input Layer**: This is where patient data enters the network
   - Must match the number of features: **12 neurons** (one for each clinical feature)
   - Automatically configured based on dataset

2. **Hidden Layers**: These are where the "learning" happens
   - Each hidden layer looks for patterns in the data
   - You control: number of layers, neurons per layer, activation function

3. **Output Layer**: This produces the final prediction
   - For binary classification (death vs survival): **1 neuron**
   - Activation function: **Sigmoid** (produces probability between 0 and 1)

**Architecture for This Use Case**:

We'll build a simple neural network with the following structure:

```
Input Layer: Matches dataset features
    → Automatically configured based on dataset

Hidden Layer 1: 64 neurons, ReLU activation
    → First level of pattern detection

Hidden Layer 2: 32 neurons, ReLU activation
    → Second level of pattern combination

Output Layer: 1 neuron, Sigmoid activation
    → Produces risk probability (0 to 1)
```

**Why this architecture?**

**The focus here is on demonstrating MediNet's visual Model Designer capabilities**, not on building the optimal clinical model. This architecture is intentionally kept simple and pedagogical to show:

1. **How easy it is to design neural networks** without writing any code
2. **The drag-and-drop workflow** for building models visually
3. **Basic architectural concepts**: input → hidden layers → output
4. **Standard activation functions**: ReLU for hidden layers, Sigmoid for binary output

**A note on architecture choices**:

- **64 → 32 neurons**: A simple progressive reduction pattern, easy to understand and visualize
- **2 hidden layers**: Sufficient to demonstrate multi-layer architecture without overcomplicating
- **ReLU activation**: Industry-standard choice, allows non-linear learning
- **Sigmoid output**: Standard for binary classification (produces probabilities 0-1)

**This is about learning the platform, not clinical optimization**: In a real research project, you would iterate on the architecture, try different layer sizes, add regularization techniques like dropout, experiment with different depths, etc. The power of MediNet is that you can do all of this experimentation visually and rapidly, without needing to be a deep learning programming expert.

**The goal**: Show you that designing neural networks can be intuitive and accessible through the right interface

**In the Model Designer**:

1. Drag an **"Input Layer"** component to the canvas
   - Set neurons: 12 (matches dataset features)

2. Drag a **"Dense Layer"** component (first hidden layer)
   - Set neurons: 64
   - Set activation: ReLU
   - Connect to Input Layer

3. Drag another **"Dense Layer"** component (second hidden layer)
   - Set neurons: 32
   - Set activation: ReLU
   - Connect to previous layer

4. Drag an **"Output Layer"** component
   - Set neurons: 1
   - Set activation: Sigmoid
   - Connect to previous layer

5. Click **"Save Architecture"**

**What happens behind the scenes**: MediNet automatically generates the neural network code based on your visual design and registers it in the system. You can modify this architecture later if needed.

---

### Step 3: Training Configuration—Understanding the Parameters

Navigate to **"Training"** or **"Entrenament"** section.

This is where you configure **how** the model will learn from the data. These settings control the learning process itself.

**Why this matters**: The same neural network architecture can perform very differently depending on these training parameters. It's like having a student (the model) and deciding how they should study: Should they take big leaps or small steps? How many times should they review the material? How much material should they study at once?

Let's understand each parameter in detail:

---

#### Parameter 1: Learning Rate

**What it controls**: The size of the adjustments the model makes to its internal parameters after seeing each batch of data.

**Analogy**: Imagine you're trying to find the bottom of a valley while blindfolded:
- **High learning rate** (e.g., 0.1): You take big steps. Pro: You move quickly. Con: You might overshoot the valley bottom and bounce back and forth without ever settling.
- **Low learning rate** (e.g., 0.0001): You take tiny steps. Pro: You carefully approach the bottom. Con: It takes forever, and you might get stuck on a small bump thinking it's the bottom.
- **Just right** (e.g., 0.001 or 0.01): You take measured steps that balance speed and precision.

**Visual understanding**:

```
Learning Rate Too High:
Loss |     *        *
     |   *  *    *  *
     | *      **      *
     +------------------
        Training Steps
     (Oscillating, unstable)

Learning Rate Just Right:
Loss | *
     |  *
     |   *
     |    **
     |      ****
     +------------------
        Training Steps
     (Smooth convergence)

Learning Rate Too Low:
Loss | *
     | *
     | *
     | *
     |  *
     +------------------
        Training Steps
     (Very slow progress)
```

**For this use case**: We'll use a learning rate in the range of **0.001 to 0.01**, which is standard for this type of problem.

**How to know if you need to adjust**:
- If loss oscillates wildly → learning rate is too high
- If loss decreases very slowly → learning rate is too low
- If loss decreases smoothly and then plateaus → just right

---

#### Parameter 2: Number of Epochs

**What it controls**: How many complete passes the model makes through the **local** dataset at each participating site.

**Analogy**: If you're studying for an exam, one epoch is like reading through all your notes once. 10 epochs means reading through all your notes 10 times.

**Understanding epochs in local training**:

```
At Hospital A (local training):

Epoch 1: Model sees all local patients, makes predictions, learns from mistakes
Epoch 2: Model sees all local patients again, predictions are better now
Epoch 3: Model sees all local patients again, predictions improve further
...
Epoch N: Local model has learned patterns from this hospital's data
```

**Trade-offs**:

- **Too few epochs** (e.g., 5): Model hasn't learned enough from local data. Like studying for 30 minutes—you'll know something but not enough.

- **Too many epochs** (e.g., 500): Model starts to **overfit** to local data—it memorizes the specific training examples instead of learning general patterns.

- **Just right** (e.g., 20-50 for federated learning): Model learns local patterns efficiently without overfitting. Note: In federated learning, we typically use fewer local epochs than in centralized training because the model will be updated multiple times through federation rounds.

**For this use case**: We'll start with **50 local epochs** per round and monitor validation performance.

**How to detect overfitting**:
```
Training Accuracy: 95% ✓
Validation Accuracy: 65% ✗
→ Large gap indicates overfitting
```

---

#### Parameter 2b: Federation Rounds (Rounds)

**What it controls**: The number of times the global model is distributed to participating sites, trained locally, and aggregated back. This is the key parameter that distinguishes federated learning from centralized training.

**Understanding the difference between Epochs and Rounds**:

```
ROUNDS (Federated Learning Cycles):
═══════════════════════════════════════════════════════════

Round 1:
  ├─ Coordinator sends initial model to all hospitals
  ├─ Hospital A trains for 50 epochs on local data → sends updates
  ├─ Hospital B trains for 50 epochs on local data → sends updates
  ├─ Hospital C trains for 50 epochs on local data → sends updates
  └─ Coordinator aggregates updates → Global Model v1

Round 2:
  ├─ Coordinator sends Global Model v1 to all hospitals
  ├─ Hospital A trains for 50 more epochs → sends updates
  ├─ Hospital B trains for 50 more epochs → sends updates
  ├─ Hospital C trains for 50 more epochs → sends updates
  └─ Coordinator aggregates updates → Global Model v2

Round 3:
  ├─ Coordinator sends Global Model v2 to all hospitals
  ├─ ... (continues)
  └─ Global Model v3

...

Round N: Final global model
```

**Key distinction**:

- **Epochs**: Local training iterations at each hospital
- **Rounds**: Global coordination cycles across all hospitals

**Example calculation**:
- **Rounds**: 10
- **Local epochs per round**: 50
- **Result**: Each hospital trains its local model for 50 epochs, 10 separate times
- **Total local training**: 10 rounds × 50 epochs = 500 total epochs of learning at each site
- **But**: Model benefits from cross-hospital aggregation after every 50 epochs

**Why rounds matter**:

In federated learning, we balance:
- **Local computation** (epochs per round): How much each hospital learns before sharing
- **Global communication** (rounds): How often we aggregate knowledge across hospitals

**Trade-offs**:

- **Many rounds, few local epochs** (e.g., 20 rounds × 10 epochs):
  - ✅ Frequent aggregation → faster global convergence
  - ✅ Less local overfitting risk
  - ❌ More communication overhead
  - ❌ More coordinator server load

- **Few rounds, many local epochs** (e.g., 5 rounds × 100 epochs):
  - ✅ Less communication overhead
  - ✅ Less coordinator load
  - ❌ Risk of local overfitting before aggregation
  - ❌ Slower global convergence

- **Balanced approach** (e.g., 10 rounds × 50 epochs):
  - ✅ Good balance between communication and convergence
  - ✅ Standard starting point for federated learning

**For this use case**: We'll configure **10 rounds** with **50 local epochs per round**.

**Analogy**:

Think of a research consortium where multiple labs collaborate on a vaccine:
- **Local epochs**: Each lab runs experiments in their own facility
- **Rounds**: The labs meet periodically to share findings and align on the next research direction
- You want labs to do enough work between meetings (local epochs) but also meet often enough to stay aligned (rounds)

---

#### Parameter 3: Loss Function

**What it controls**: How we measure how "wrong" the model's predictions are. This is what the model tries to minimize during training.

**For our binary classification problem** (died vs survived), we use **Binary Cross-Entropy Loss**.

**Understanding Binary Cross-Entropy**:

When the model makes a prediction, it outputs a probability (e.g., 0.73 = 73% risk of mortality).

- If the true outcome is **death** (1) and model predicts 0.73 → loss is low (good prediction)
- If the true outcome is **death** (1) and model predicts 0.12 → loss is high (bad prediction)
- If the true outcome is **survival** (0) and model predicts 0.15 → loss is low (good prediction)
- If the true outcome is **survival** (0) and model predicts 0.89 → loss is high (bad prediction)

The formula penalizes confident wrong predictions more heavily than uncertain wrong predictions.

**Why Binary Cross-Entropy?**

It's specifically designed for binary classification problems (two possible outcomes). Other loss functions exist for different types of problems:
- **Categorical Cross-Entropy**: For multi-class classification (e.g., predicting disease type: Type A, B, or C)
- **Mean Squared Error**: For regression (e.g., predicting exact blood pressure value)

**For this use case**: Select **Binary Cross-Entropy** from the dropdown menu.

---

#### Parameter 4: Batch Size

**What it controls**: How many patient records the model processes before updating its internal parameters.

**Analogy**: Imagine you're a teacher grading exams:
- **Batch size = 1**: You grade one exam, update your grading rubric based on that one exam, grade the next exam, update again. Very responsive but noisy and slow.
- **Batch size = entire dataset (299)**: You grade all exams, then update your rubric once. Stable but slow to adapt.
- **Batch size = 32**: You grade 32 exams, update your rubric, grade next 32 exams, update again. Good balance.

**Understanding the math**:

With a dataset of **299 patients** and **batch size of 32**:

```
Epoch 1:
  Iteration 1: Process patients 1-32 → Update model
  Iteration 2: Process patients 33-64 → Update model
  Iteration 3: Process patients 65-96 → Update model
  ...
  Iteration 10: Process patients 289-299 → Update model

Total: 10 iterations per epoch
```

**Trade-offs**:

- **Small batch size** (e.g., 8, 16):
  - ✅ More frequent updates = faster learning in early epochs
  - ✅ Better generalization (doesn't overfit as easily)
  - ❌ Noisier gradients (more erratic learning)
  - ❌ Slower computation (more iterations needed)

- **Large batch size** (e.g., 128, 256):
  - ✅ Smoother, more stable learning
  - ✅ Faster computation per epoch (fewer iterations)
  - ❌ Requires more memory
  - ❌ May converge to worse solutions
  - ❌ For our 299 sample dataset, too large doesn't make sense

- **Medium batch size** (e.g., 32, 64):
  - ✅ Good balance between stability and generalization
  - ✅ Most common choice in practice

**For this use case**: We'll use **batch size = 32**, which gives us about 10 iterations per epoch and balances training stability with generalization.

**Memory consideration**: If you encounter "out of memory" errors (unlikely with this small dataset), reduce the batch size.

---

#### Summary: Training Configuration for Heart Failure Model

Here's what we'll configure:

| Parameter | Value | Reasoning |
|-----------|-------|-----------|
| **Learning Rate** | 0.001 | Standard starting point for Adam optimizer; balances speed and stability |
| **Local Epochs** | 50 | Number of passes through local data per federation round |
| **Federation Rounds** | 10 | Number of global aggregation cycles across all participating sites |
| **Loss Function** | Binary Cross-Entropy | Appropriate for binary classification (died vs survived) |
| **Batch Size** | 32 | Balances training stability and generalization |
| **Optimizer** | Adam | Adaptive learning rate; generally works well without tuning |

**Total training computation**: 10 rounds × 50 epochs = 500 total local epochs per participating hospital

**In the MediNet interface**:

1. Set **Learning Rate**: 0.001
2. Set **Local Epochs per Round**: 50
3. Set **Federation Rounds**: 10
4. Select **Loss Function**: Binary Cross-Entropy
5. Set **Batch Size**: 32
6. Select **Optimizer**: Adam (if available)
7. Click **"Start Federated Training"**

---

### Step 4: Initial Training Execution

After clicking "Start Training", MediNet initiates the federated learning process:

**What's happening behind the scenes**:

1. **Model initialization**: Your designed architecture is initialized with random weights
2. **Data preparation**: The 299 patient records are split:
   - **Training set** (~80%): 239 patients used to train the model
   - **Validation set** (~20%): 60 patients used to evaluate performance
3. **Training loop begins**:
   - For each epoch:
     - Model processes training data in batches of 32
     - Calculates loss (how wrong predictions are)
     - Updates weights to reduce loss
     - Evaluates on validation set
4. **Real-time monitoring**: MediNet displays training progress

**Monitoring the Training Dashboard**:

Navigate to **"Results"** or **"Analysis"** section to view real-time metrics:

**Metrics you'll see**:

1. **Training Loss Curve**:
   - Should decrease over epochs
   - If it's decreasing smoothly → training is working ✓
   - If it's flat → model isn't learning ✗
   - If it's oscillating wildly → learning rate too high ✗

2. **Validation Loss Curve**:
   - Should also decrease over epochs
   - **Key indicator**: Gap between training and validation loss
   - Small gap → model generalizes well ✓
   - Large gap → model is overfitting ✗

3. **Accuracy**:
   - Training accuracy: Performance on data the model has seen
   - Validation accuracy: Performance on data the model hasn't seen
   - **Validation accuracy is what matters** for real-world performance

4. **Confusion Matrix** (after training completes):
   ```
   Actual → | Survived | Died
   ---------|----------|------
   Predicted↓
   Survived | 38 (TN) | 5 (FN)
   Died     | 3 (FP)  | 14 (TP)
   ```
   - **True Positives (TP)**: Correctly predicted deaths
   - **True Negatives (TN)**: Correctly predicted survivals
   - **False Positives (FP)**: Predicted death but patient survived
   - **False Negatives (FN)**: Predicted survival but patient died

**What to look for**:

✅ **Good signs**:
- Loss decreases steadily
- Validation accuracy reaches 70-85% (reasonable for this dataset)
- Small gap between training and validation metrics
- Confusion matrix shows balanced performance

⚠️ **Warning signs**:
- Loss stops decreasing after 20 epochs → might need more epochs or different architecture
- Validation accuracy much lower than training accuracy → overfitting
- Model predicts mostly one class (e.g., always "survived") → data imbalance problem

**Training time**: With this small dataset and simple architecture, training should complete in **1-3 minutes** on standard hardware.

---

### Step 5: Analyzing Results and Iterative Optimization

After the initial training completes, it's time to analyze the results and decide if we can improve the model.

**Questions to ask**:

1. **Did the model learn?**
   - Check if validation accuracy is significantly better than random guessing (50% for binary classification)
   - For our dataset, 70%+ validation accuracy indicates successful learning

2. **Is there overfitting?**
   - Compare training accuracy (e.g., 95%) vs validation accuracy (e.g., 72%)
   - Large gap (>15-20%) suggests overfitting

3. **Did training converge?**
   - Look at loss curve: Did it plateau, or was it still decreasing at epoch 100?
   - If still decreasing → might benefit from more epochs

4. **Are predictions balanced?**
   - Check confusion matrix
   - Is the model predicting both classes, or mostly one class?

**Example Analysis Scenario**:

Let's say after the first training run, we observe:

```
Training Accuracy: 87%
Validation Accuracy: 74%
Training Loss: 0.35
Validation Loss: 0.62

Confusion Matrix (Validation Set):
               Predicted
Actual       | Survived | Died
-------------|----------|------
Survived     | 38       | 5
Died         | 11       | 6
```

**Interpretation**:

✅ **Positive**:
- Model learned successfully (74% > 50% random)
- Reasonable gap between training and validation
- Model predicts both classes (not just one)

⚠️ **Areas for improvement**:
- High false negatives (11 patients): Model missed 11 deaths
- This is concerning in medical context—missing deaths is worse than false alarms
- Loss curves show training stopped improving around epoch 70

**Optimization Strategy**:

Based on this analysis, we might try:

**Option 1: Adjust batch size** (our chosen approach for this use case)
- **Current**: Batch size = 32
- **Change to**: Batch size = 16
- **Rationale**: Smaller batches provide noisier but potentially better gradients for this small dataset, which might help the model learn the minority class (deaths) better

**Option 2: Adjust learning rate**
- Try a slightly lower learning rate (0.0005) to help model converge to better solution

**Option 3: Reduce epochs**
- If model converged at epoch 70, reduce to 80 epochs to save time

**Option 4: Add regularization**
- Use dropout or L2 regularization to reduce overfitting (advanced)

**For this use case, we'll proceed with Option 1**: Changing batch size from 32 to 16.

**Retraining**:

1. Navigate back to **"Training Configuration"**
2. Change **Batch Size** from 32 to **16**
3. Keep other parameters the same
4. Click **"Start Training"** again
5. Monitor the new training run

**What to expect with smaller batch size**:

- More iterations per epoch: 299 patients ÷ 16 batch size = ~19 iterations per epoch
- Potentially noisier training curves but better final performance
- Slightly longer training time

**After second training run**:

```
Training Accuracy: 85% (slightly lower than before)
Validation Accuracy: 78% (improved from 74%)
Training Loss: 0.40
Validation Loss: 0.56

Confusion Matrix (Validation Set):
               Predicted
Actual       | Survived | Died
-------------|----------|------
Survived     | 39       | 4
Died         | 8        | 9
```

**Analysis**:

✅ **Improvements**:
- Validation accuracy increased from 74% to 78%
- False negatives reduced from 11 to 8 (caught 3 more deaths)
- True positives increased from 6 to 9
- Better balance in predictions

**Decision**: This represents meaningful improvement. The model is now catching more deaths while maintaining good specificity.

---

### Step 6: Final Model Validation

After iterative optimization, we've arrived at a model with satisfactory performance. Now we validate it's ready for the next stage.

**Validation Checklist**:

✅ **Performance Metrics**:
- Validation accuracy: 78% (acceptable for this problem)
- Balanced predictions: Model predicts both classes
- False negative rate acceptable for clinical context

✅ **Training Stability**:
- Loss curves show smooth convergence
- No signs of severe overfitting
- Training completed successfully

✅ **Clinical Relevance**:
- Model uses clinically validated features
- Predictions align with medical knowledge (high-risk features → higher mortality prediction)
- Performance is better than simple risk scores

✅ **Documentation**:
- Model architecture documented
- Training parameters recorded
- Performance metrics saved

**Final Model Summary**:

```
Architecture:
- Input: 12 clinical features
- Hidden Layer 1: 64 neurons, ReLU
- Hidden Layer 2: 32 neurons, ReLU
- Output: 1 neuron, Sigmoid

Training Configuration:
- Learning Rate: 0.001
- Epochs: 100
- Loss Function: Binary Cross-Entropy
- Batch Size: 16 (optimized from 32)
- Optimizer: Adam

Final Performance:
- Validation Accuracy: 78%
- Training Accuracy: 85%
- Validation Loss: 0.56
- True Positive Rate (Sensitivity): 53% (9/17)
- True Negative Rate (Specificity): 91% (39/43)
```

**Clinical Interpretation**:

This model shows:
- **High specificity** (91%): Very good at identifying patients who will survive
- **Moderate sensitivity** (53%): Catches about half of patients who will die
- **Practical use case**: Could serve as a screening tool to identify high-risk patients for further clinical evaluation

**Limitations to acknowledge**:
- Small training dataset (299 patients)
- Would benefit from multi-center federated training with larger datasets
- Should be validated on external test set before clinical deployment
- Not a replacement for clinical judgment—a decision support tool

---

### Step 7: Next Steps and Model Export

**Downloading the Model**:

In MediNet Hub, navigate to **"Models"** → **"Trained Models"** and select your heart failure mortality model.

Click **"Export Model"** to download:
- Model architecture file (.json)
- Trained weights (.h5 or .pt depending on framework)
- Training history and metrics (.csv)
- Model card with documentation (.pdf)

**Potential Next Steps**:

1. **Clinical Validation Study**:
   - Test model on new patient cohort
   - Compare predictions to actual outcomes
   - Validate in different hospitals/populations

2. **Integration with Clinical Systems**:
   - Deploy model as API endpoint
   - Integrate with electronic health records (EHR)
   - Build clinical decision support interface

3. **Expansion to Multi-Center Federated Learning**:
   - Add data from Hospital B, C, D without sharing raw data
   - Train on combined patterns from multiple institutions
   - Improve model generalization

4. **Regulatory Compliance**:
   - Document model development process
   - Perform bias and fairness analysis
   - Prepare for medical device regulatory submission (if applicable)

---

## Key Takeaways: What You've Learned

Through this use case, you've learned:

✅ **The clinical problem**: Predicting heart failure mortality to improve patient care

✅ **Federated learning concepts**: Training models on distributed data without compromising privacy

✅ **Neural network design**: Building a multi-layer architecture for pattern recognition

✅ **Training parameter selection**: Understanding learning rate, epochs, batch size, and loss functions

✅ **Iterative optimization**: Analyzing results and adjusting hyperparameters to improve performance

✅ **Model validation**: Checking performance metrics and clinical relevance

✅ **Practical ML workflow**: From problem definition to validated model

---

## Frequently Asked Questions

**Q: Do I need to know how to code to use MediNet?**

A: No! MediNet provides visual interfaces for all major steps: dataset selection, model design, training configuration, and results analysis. The Model Designer uses drag-and-drop components.

**Q: How long does training take?**

A: For this heart failure dataset (299 patients), training completes in 1-3 minutes. Larger datasets from multiple hospitals would take longer, but MediNet optimizes the process.

**Q: What if I get poor results?**

A: Poor results can happen for several reasons:
- Insufficient training data → Add more data or use data augmentation
- Wrong architecture → Try different layer configurations
- Poor hyperparameters → Adjust learning rate, batch size, or epochs
- Data quality issues → Check for missing values, outliers, or errors

The iterative optimization process (Step 5) helps you systematically improve results.

**Q: Is 78% accuracy good enough?**

A: It depends on the clinical context:
- For screening tools: 78% might be acceptable as a first filter
- For diagnostic decisions: Might need >90% accuracy
- For high-stakes predictions: Need to consider cost of false negatives vs false positives

Always consider sensitivity (catching deaths) and specificity (avoiding false alarms) separately.

**Q: Can I use my own dataset?**

A: Yes! MediNet administrators can upload custom datasets. Contact the support team to discuss your data requirements and formatting.

**Q: What frameworks does MediNet use?**

A: MediNet supports multiple deep learning frameworks including TensorFlow, PyTorch, and others. The visual interface abstracts these details, but advanced users can access the underlying code.

**Q: How does MediNet ensure privacy?**

A: Federated learning keeps data at the source (hospitals). Only model updates (gradients) are shared, never raw patient data. Additional privacy techniques like differential privacy and secure aggregation add extra protection.

**Q: Can I collaborate with other researchers?**

A: Yes! MediNet supports collaborative federated learning where multiple researchers can train models on data from multiple hospitals without anyone seeing the raw data.

---

## Glossary

**Accuracy**: Percentage of correct predictions out of all predictions.

**Activation Function**: A mathematical function that determines if a neuron should "fire" (e.g., ReLU, Sigmoid).

**Batch**: A subset of the training data processed together before updating model weights.

**Binary Classification**: Predicting one of two possible outcomes (e.g., died vs survived).

**Cross-Entropy**: A loss function measuring the difference between predicted and actual probability distributions.

**Epoch**: One complete pass through the entire training dataset.

**Federated Learning**: Training machine learning models across decentralized data without moving the data.

**Loss Function**: A function measuring how wrong the model's predictions are; training aims to minimize this.

**Neural Network**: A machine learning model inspired by the human brain, consisting of layers of interconnected neurons.

**Overfitting**: When a model memorizes training data instead of learning general patterns, leading to poor performance on new data.

**Sensitivity (Recall, True Positive Rate)**: Percentage of actual positives correctly identified.

**Sigmoid**: An activation function that outputs values between 0 and 1, useful for probabilities.

**Specificity (True Negative Rate)**: Percentage of actual negatives correctly identified.

**Validation Set**: A portion of data held out during training to evaluate model performance on unseen data.

---

## Contact and Support

For questions, support, or access requests, contact:

📧 **juanr.gonzalez@isglobal.org**
📧 **ramon.mateo@isglobal.org**

🏢 **ISGlobal** - Barcelona Institute for Global Health

🌐 **Platform Access**: https://medinet-hub.isglobal.org

📚 **Documentation**: [MediNet User Guide](user-guide.html)

---

**Ready to start your federated learning research?**

Request your credentials today and join the future of privacy-preserving medical AI!
