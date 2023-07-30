import boto3
import json
#建立AWS Comprehend服務中的語言偵測工具，若輸出為"en"為英文，若"zh-TW"則為中文
def language_detector(text):
    comprehend = boto3.Session(
        aws_access_key_id='Your AWS ID',                     
        aws_secret_access_key='Your AWS API KEY',
        region_name='Your Service Region').client('comprehend')

    languageType = json.dumps(comprehend.detect_dominant_language(Text = text)["Languages"][0]["LanguageCode"], 
                              sort_keys=True, indent=0)
    languageType = languageType.replace('"','')
    return languageType

