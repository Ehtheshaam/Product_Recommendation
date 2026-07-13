# VOGA - AI-Powered Intelligent Product Discovery

VOGA is a premium Machine Learning and Data Science portfolio project built to demonstrate modern Recommendation Systems, Natural Language Processing, Explainable AI, Interactive Analytics, and Full Stack Development.

Designed with a sleek, minimalist aesthetic, VOGA provides an interview-ready showcase of how Data Science powers intelligent product discovery.

---

## 🚀 Project Overview

The goal of VOGA is to intelligently recommend products to users based on their preferences. Instead of a standard e-commerce clone, this platform acts as an **AI SaaS Dashboard**, highlighting the data and models driving the recommendations.

### Key Features
- **AI Recommendation Engine**: Natural Language Processing applied to product metadata.
- **Explainable AI (XAI)**: Insights into *why* a product was recommended.
- **Interactive ML Dashboard**: Real-time analytics of the dataset, vocabulary, and model inference statistics.
- **Content-Based Filtering**: Combining product name, category, and brand using TF-IDF.
- **Modern Full Stack**: React (Vite) frontend with a Python Flask REST API backend.

---

## 🧠 Machine Learning Workflow

Our recommendation pipeline works as follows:

1. **Dataset Loading**: Using Pandas to load `clean_data.csv`.
2. **Data Cleaning**: Handling missing values for brands, categories, and ratings so the model trains successfully.
3. **Feature Engineering**: Combining text features (Name, Brand, Category) into a single context document. We duplicate the category to give it more weight.
4. **TF-IDF Vectorization**: We convert text into numerical vectors using `TfidfVectorizer`. We tuned parameters (`max_features=8000`, `ngram_range=(1,2)`) to capture important phrases.
5. **Feature Matrix Generation**: The text corpus is transformed into a sparse matrix representing keyword importance.
6. **Dynamic Cosine Similarity**: Instead of storing a massive 5GB pre-computed similarity matrix, we calculate the cosine angle between vectors *on-the-fly* only for the selected product.
7. **Recommendation Engine**: Sorting similarities in descending order to fetch the Top-N matching products instantly.
8. **Caching Strategy**: We use `Flask-Caching` to cache recent similarity queries, providing sub-millisecond responses without destroying memory.

---

## 📂 Folder Structure

```
├── backend/                  # Flask REST API backend
│   ├── app.py                # API endpoints
│   ├── services/
│   │   └── ml_engine.py      # Core Machine Learning logic
│   └── requirements.txt      # Python dependencies
├── frontend/                 # React frontend
│   ├── src/                  # React components and pages
│   ├── tailwind.config.js    # Tailwind CSS styling configuration
│   └── package.json          # Node dependencies
├── dataset/                  # Contains clean_data.csv
├── models/                   # Saved model artifacts (.pkl files)
└── README.md                 # Project documentation
```

---

## 💻 Tech Stack

- **Frontend**: React, Tailwind CSS, Framer Motion, Recharts, Lucide React
- **Backend**: Python, Flask, Flask-CORS
- **Machine Learning**: Scikit-learn, Pandas, NumPy
- **Algorithms**: TF-IDF (Term Frequency-Inverse Document Frequency), Cosine Similarity

---

## ❓ Interview Questions & Explanations

Here are simple explanations for the core components of this project:

**Why TF-IDF?**
We use TF-IDF because it highlights important words while ignoring common ones (like "the", "and"). If a product description contains a rare, specific keyword, TF-IDF ensures that keyword carries more weight in finding similar products.

**Why Cosine Similarity?**
Cosine Similarity measures the angle between two vectors rather than their distance. This means even if one product has a very long description and another has a short one, they can still be deemed similar if they share the same core keywords.

**Why did we remove the `cosine_sim.pkl` file? (Architecture Optimization)**
Initially, a 5.2GB matrix was generated to store every possible product-to-product similarity. This is highly inefficient. We optimized the system by discarding the static matrix and calculating similarity *dynamically* on-the-fly. 
Advantages of this optimization:
- **Smaller project size**: Reduced from 6GB down to ~150MB.
- **Faster GitHub uploads**: Easy to push without Git LFS.
- **Easier deployment**: Can be hosted on free tiers like Vercel/Render.
- **Better scalability**: Memory consumption stays completely flat regardless of how many users are active.

**What is Explainable AI in VOGA?**
In the UI, we don't just show similar products; we show *why* they matched (e.g., "Shares keywords and category with your current product"). This builds trust with the user.

---

## 🛠️ How to Run

1. **Backend Setup**
   ```bash
   pip install -r requirements.txt
   cd backend
   python app.py
   ```
   The backend will start on `http://127.0.0.1:5000`.

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   The React app will open in your default browser.

---

## 🔮 Future Improvements

- **Sentence Transformers / BERT**: Upgrade from TF-IDF to semantic embeddings for better contextual understanding.
- **Collaborative Filtering**: Incorporate user behavior (clicks, purchases) to make hybrid recommendations.
- **FAISS**: Implement Facebook AI Similarity Search for sub-millisecond similarity search across millions of products.
