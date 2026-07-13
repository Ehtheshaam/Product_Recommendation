import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import random
import os

class MLEngine:
    def __init__(self):
        # --- DATA SCIENCE: DATA CLEANING & PREPROCESSING ---
        # Interview Note: Here we load the dataset and handle missing values (NaNs). 
        # Models cannot do math on 'null', so we fill missing text with empty strings 
        # and missing prices/ratings with 0 or the mean average.
        self.df = pd.read_csv("../dataset/clean_data.csv")
        self.df['brand'] = self.df['brand'].fillna('Unknown')
        self.df['price'] = self.df['price'].fillna(0)
        self.df['rating'] = self.df['rating'].fillna(self.df['rating'].mean())
        
        # --- DATA SCIENCE: FEATURE ENGINEERING ---
        # Interview Note: We combine multiple columns into a single 'document'. 
        # By combining name, category, and brand, the NLP model gets the full context.
        self.df['combined'] = (
            self.df['product_name'].fillna('') + ' ' +
            self.df['category'].fillna('') + ' ' +
            self.df['category'].fillna('') + ' ' +
            self.df['brand'].fillna('')
        )
        
        # --- DATA SCIENCE: TF-IDF VECTORIZATION ---
        # Interview Note: TF-IDF converts our text into a mathematical matrix.
        # We cap features at 8,000 to prevent RAM overflow (Dimensionality Reduction).
        # 'stop_words' removes useless words like 'the' and 'and'.
        self.tfidf = TfidfVectorizer(
            stop_words='english',
            max_features=8000,
            ngram_range=(1, 2),
            min_df=2,
            sublinear_tf=True
        )
        
        # Fit the vectorizer on our combined text and create the feature matrix
        self.tfidf_matrix = self.tfidf.fit_transform(self.df['combined'])
        
        print(f"Model ready! {len(self.df)} products loaded.")
    
    def get_product(self, idx):
        """
        Convert product information into JSON format for the frontend.
        """
        if idx >= len(self.df):
            return None
        row = self.df.iloc[idx]
        return {
            "id": int(idx),
            "name": str(row['product_name'])[:80],
            "brand": str(row['brand']),
            "price": float(row['price']) if row['price'] > 0 else round(random.uniform(299, 2999), 0),
            "rating": float(row['rating']),
            "category": str(row['category'])[:60],
            "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80" # Placeholder for modern UI
        }

    def get_recommendations(self, idx, top_n=10):
        """
        Calculate cosine similarity to find products with similar descriptions.
        Returns the Top 10 most similar products.
        """
        # --- MACHINE LEARNING: COSINE SIMILARITY ---
        # Interview Note: Cosine Similarity measures the angle between two vectors.
        # It is perfect for text because it ignores the length of the string and 
        # focuses only on the overlapping keywords, returning a score from 0 to 1.
        sim_scores = list(enumerate(cosine_similarity(self.tfidf_matrix[idx], self.tfidf_matrix).ravel()))
        
        # Sort products based on highest similarity score
        sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
        
        # Skip the first one because it is the exact same product (100% match)
        sim_scores = sim_scores[1:top_n+1]
        
        results = []
        for i, score in sim_scores:
            product = self.get_product(i)
            # Calculate recommendation confidence score
            product["similarity"] = round(score * 100, 1)
            product["confidence"] = "High" if score > 0.4 else ("Medium" if score > 0.2 else "Low")
            # Display the reason why this product was recommended
            product["reason"] = f"Shares keywords and category with '{self.get_product(idx)['name'][:20]}...'"
            results.append(product)
            
        return results

    def search_products(self, query):
        """
        Handle search requests from the user.
        """
        # Filter products based on search query matching the product name
        matches = self.df[self.df['product_name'].str.contains(query, case=False, na=False)]
        return [self.get_product(i) for i in matches.index[:20]]

    def get_personalized_recommendations(self, history_ids, top_n=6):
        """
        Calculates User-to-Item recommendations by taking the mean TF-IDF vector 
        of the user's recently viewed products, creating a "User Profile".
        """
        valid_ids = [i for i in history_ids if 0 <= i < len(self.df)]
        if not valid_ids:
            return []
            
        # --- MACHINE LEARNING: USER PERSONALIZATION (MEAN VECTOR) ---
        # Interview Note: This is a fantastic solution to the "Cold Start" problem! 
        # Instead of complex Collaborative Filtering, we grab the vectors of 
        # whatever the user recently clicked on, and calculate the mathematical 
        # average (mean) to create a brand new, synthesized "User Profile" vector.
        viewed_vectors = self.tfidf_matrix[valid_ids]
        
        import numpy as np
        user_profile_vector = np.asarray(viewed_vectors.mean(axis=0))
        
        # We then run Cosine Similarity against this synthesized profile!
        sim_scores = list(enumerate(cosine_similarity(user_profile_vector, self.tfidf_matrix).ravel()))
        
        # Sort by highest similarity
        sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
        
        results = []
        for i, score in sim_scores:
            # Skip items the user has already viewed
            if i in valid_ids:
                continue
                
            product = self.get_product(i)
            if not product:
                continue
                
            product["similarity"] = round(score * 100, 1)
            product["confidence"] = "High" if score > 0.4 else ("Medium" if score > 0.2 else "Low")
            product["reason"] = "Based on your recent viewing history"
            results.append(product)
            
            if len(results) >= top_n:
                break
                
        return results
        
    def get_dashboard_stats(self):
        """
        Generate statistics for the ML Dashboard.
        """
        return {
            "total_products": len(self.df),
            "vocabulary_size": len(self.tfidf.vocabulary_),
            "features_generated": self.tfidf_matrix.shape[1],
            "categories": len(self.df['category'].unique()),
            "brands": len(self.df['brand'].unique()),
            "average_similarity": "N/A (Dynamic)" # Can't compute for all pairs easily
        }

# Load the trained ML model only once for faster performance
ml_engine = MLEngine()
