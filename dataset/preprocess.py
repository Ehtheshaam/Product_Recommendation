import pandas as pd

df = pd.read_json("dataset/amazon_fashion_dataset.ldjson",lines = True)

#keep only useful columns
df = df[['product_name','brand','parent___child_category__all','rating','sales_price']]

#rename columns names to easy
df.columns= ['product_name','brand','category','rating','price']

#drop rows where product_name or category is missing
df = df.dropna(subset=['product_name','category'])

#fill missing rating with average
df['rating']=df['rating'].fillna(df['rating'].mean())

#fill missing price with 0
df['price'] = df['price'].fillna(0)

#one issue,Brand has NaN values
df['brand']= df['brand'].fillna('Unknown')

#reset index
df = df.reset_index(drop=True)

print("clean dataser shape :",df.shape)
print("\nSample data :")
print(df.head(5))

#for saving cleaned data
df.to_csv("dataset/clean_data.csv",index = False)
print("\n saved as clean_data.csv")
