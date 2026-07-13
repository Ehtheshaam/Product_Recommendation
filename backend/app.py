from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_caching import Cache
from services.ml_engine import ml_engine
import random

app = Flask(__name__)
# Enable CORS to allow our React frontend to communicate with this Flask backend
CORS(app)

# --- SYSTEM ARCHITECTURE OPTIMIZATION ---
# Interview Note: We use Flask-Caching to keep the project incredibly lightweight.
# Instead of storing a 5.2GB Cosine Similarity matrix on the hard drive (which 
# breaks GitHub and blocks deployment), we calculate similarities dynamically on-the-fly!
# If a user clicks the same product twice, this Cache serves the results instantly 
# without recalculating the math.
cache = Cache(app, config={'CACHE_TYPE': 'SimpleCache', 'CACHE_DEFAULT_TIMEOUT': 300})

@app.route('/api/products')
def get_products():
    """
    Return a list of featured/random products for the landing page.
    """
    limit = int(request.args.get('limit', 12))
    featured_indices = random.sample(range(len(ml_engine.df)), min(limit, len(ml_engine.df)))
    featured = [ml_engine.get_product(i) for i in featured_indices]
    return jsonify(featured)

@app.route('/api/products/search')
def search_products():
    """
    Handle search requests from the user.
    """
    query = request.args.get('q', '')
    if not query:
        return jsonify([])
    results = ml_engine.search_products(query)
    return jsonify(results)

@app.route('/api/products/<int:product_id>')
def get_product(product_id):
    """
    Return details for a single product.
    """
    p = ml_engine.get_product(product_id)
    if not p:
        return jsonify({"error": "Product not found"}), 404
    return jsonify(p)

@app.route('/api/recommendations/<int:product_id>')
@cache.cached(timeout=300)
def api_recommendations(product_id):
    """
    Return the Top 10 most similar products and Explainable AI reasons.
    """
    if product_id >= len(ml_engine.df):
        return jsonify({"error": "Product not found"}), 404
        
    # --- MACHINE LEARNING: DYNAMIC COMPUTATION ---
    # Interview Note: We calculate similarity ONLY for this specific product dynamically.
    # This avoids storing a massive NxN similarity matrix!
    recs = ml_engine.get_recommendations(product_id, top_n=10)
    return jsonify(recs)

@app.route('/api/recommendations/personal', methods=['POST'])
def get_personal_recommendations():
    data = request.json
    if not data or 'history' not in data:
        return jsonify({"error": "Invalid request, missing history"}), 400
        
    history_ids = data['history']
    # If the history is not a list or is empty, return an empty array
    if not isinstance(history_ids, list) or not history_ids:
        return jsonify([])
        
    recommendations = ml_engine.get_personalized_recommendations(history_ids)
    return jsonify(recommendations)

@app.route('/api/stats')
def get_stats():
    """
    Return statistics for the Machine Learning Dashboard.
    """
    stats = ml_engine.get_dashboard_stats()
    return jsonify(stats)

if __name__ == '__main__':
    app.run(debug=True, port=5001)
