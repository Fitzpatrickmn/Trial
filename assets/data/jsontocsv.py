import json
import csv
from collections import OrderedDict

# Opening JSON file and loading the data
# into the variable data
with open("tweet-data/assets/data/data.json") as json_file:
    data = json.load(json_file)

#users = data['users']
tweets = data['tweets']
#hashtags = data['hashtags']

# CREATE CSV FOR TWEETS
# now we will open a file for writing
data_file = open('tweet-data/assets/data/data_tweets.csv', 'w')
  
# create the csv writer object
csv_writer = csv.writer(data_file)
  
# Counter variable used for writing 
# headers to the CSV file
count = 0
  
for t in tweets:
    if count == 0:
  
        # Writing headers of CSV file
        header = t.keys()
        csv_writer.writerow(header)
        count += 1
  
    # Writing data of CSV file
    csv_writer.writerow(t.values())
  
data_file.close()

# create the csv writer object
csv_writer = csv.writer(data_file)



        