import pandas as pd
import numpy as np

df = pd.read_csv (r'tweet-data/assets/data/data_tweets.csv')

df_a = df[df['id'] <= 5000]
#print(df_a)

df_b = df[df['id'] > 5000]
df_b.rename(columns={'hashtags': 'tweetText'}, inplace=True)
df_b.rename(columns={'text': 'retweet_ids'}, inplace=True)
df_b.rename(columns={'retweet_id': 'hashtags'}, inplace=True)
df_b.rename(columns={'retweet_ids': 'retweet_id'}, inplace=True)
df_b.rename(columns={'tweetText': 'text'}, inplace=True)

#print(df_b)

newdf = pd.concat([df_a, df_b], ignore_index=True)
newdf['NumberOfCharacters'] = newdf['text'].str.len()
newdf['NumberOfHashtags'] = newdf['hashtags'].str.len()
newdf['NumberOfHashtags'] = newdf['NumberOfHashtags'].fillna(0)
newdf['NumberOfRetweets'] = newdf['retweet_id'].str.len()
newdf['NumberOfRetweets'] = newdf['NumberOfRetweets'].fillna(0)
newdf['NumberOfLikes'] = newdf['likes'].str.len()
newdf['NumberOfLikes'] = newdf['NumberOfLikes'].fillna(0)
print(newdf)

#newdf.to_csv(r'tweet-data/assets/data/clean_data.csv')

newdf.to_csv (r'tweet-data/assets/data/clean_data.csv', index = False, header=True)





