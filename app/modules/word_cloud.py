import boto3
from io import BytesIO
from wordcloud import WordCloud, STOPWORDS
import matplotlib.pyplot as plt

# 建立 AWS S3 client
s3 = boto3.client('s3', aws_access_key_id='Your AWS ID',
                  aws_secret_access_key='Your AWS API KEY')

# 自訂要排除的詞彙
my_stopwords = set(['<br>','br'])

# 將預設的stopwords集合加上自訂的stopwords集合
stopwords = set(STOPWORDS)
stopwords.update(my_stopwords)

def englishCloud(text):
    try:
        wordcloud = wordcloud = WordCloud(stopwords=stopwords, 
                                          width = 1200, 
                                          height = 600, 
                                          margin = 2, 
                                          background_color = "white", 
                                          colormap = "Dark2", 
                                          max_words = 25, 
                                          min_font_size = 8)
        wordcloud.generate(text)
        plt.figure( figsize=(20,10) )
        plt.imshow(wordcloud, interpolation='bilinear')
        plt.axis("off")
        # 將圖片存到BytesIO中
        img_buffer = BytesIO()
        plt.savefig(img_buffer, format='png')
        img_buffer.seek(0)
        # 將檔案上傳至 AWS S3
        s3 = boto3.resource('s3', aws_access_key_id='Your AWS ID', 
                            aws_secret_access_key='Your AWS API KEY', 
                            region_name='Your Service Region')
        s3.Object('Your S3 Project Name', "wordcloud.png").upload_fileobj(img_buffer)
        return "Word Cloud"
    except ValueError:
        pass
