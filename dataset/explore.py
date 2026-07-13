import pandas as pd

df = pd.read_json("dataset/amazon_fashion_dataset.ldjson",lines = True)
print(df.shape)
print(df.columns.tolist())
print(df.head(30))