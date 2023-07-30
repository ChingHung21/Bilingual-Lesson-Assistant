#建立AWS S3雲端服務及導入io模組
import io
import boto3
# 建立 AWS S3 client
s3 = boto3.client('s3', aws_access_key_id='Your AWS ID',
                  aws_secret_access_key='Your AWS API KEY')
# 建立 AWS polly client
polly_client = boto3.Session(
    aws_access_key_id='Your AWS ID',                     
    aws_secret_access_key='Your AWS API KEY',
    region_name='Your Service Region').client('polly')

def tts(Text, voiceID):
    # 取得tts data stream
    response = polly_client.synthesize_speech(VoiceId=voiceID,
                    OutputFormat='mp3', 
                    Text = Text,
                    Engine = 'neural')
    # 創造一個audio_buffer作為資料流的緩衝，並將result中的audio_data寫入
    audio_buffer = io.BytesIO()
    audio_buffer.write(response['AudioStream'].read())
    audio_buffer.seek(0)
    # 將檔案上傳至 AWS S3
    s3 = boto3.resource('s3', 
                        aws_access_key_id='Your AWS ID', 
                        aws_secret_access_key='Your AWS API KEY', 
                        region_name='Your Service Region')
    s3.Object('Your S3 Project Name', 'file.mp3').upload_fileobj(audio_buffer)
    print('Audio file saved to S3 successfully')

def tts_foreach(text, index, voiceID):
    # 取得tts data stream
    response = polly_client.synthesize_speech(VoiceId=voiceID,
                    OutputFormat='mp3', 
                    Text = text,
                    Engine = 'neural')
    #創造一個audio_buffer作為資料流的緩衝，並將result中的audio_data寫入
    audio_buffer = io.BytesIO()
    audio_buffer.write(response['AudioStream'].read())
    audio_buffer.seek(0)
    # 將檔案上傳至 AWS S3
    s3 = boto3.resource('s3', aws_access_key_id='Your AWS ID', aws_secret_access_key='Your AWS API KEY', region_name='Your Service Region')
    s3.Object('Your S3 Project Name', f"{index}.mp3").upload_fileobj(audio_buffer)
    print('Audio file saved to S3 successfully')

def tts_Function(text, textName, voiceID):
    # 取得tts data stream
    response = polly_client.synthesize_speech(VoiceId=voiceID,
                    OutputFormat='mp3', 
                    Text = text,
                    Engine = 'neural')
    # 創造一個audio_buffer作為資料流的緩衝，並將result中的audio_data寫入
    audio_buffer = io.BytesIO()
    audio_buffer.write(response['AudioStream'].read())
    audio_buffer.seek(0)
    # 將檔案上傳至 AWS S3
    s3 = boto3.resource('s3', aws_access_key_id='Your AWS ID', aws_secret_access_key='Your AWS API KEY', region_name='Your Service Region')
    s3.Object('Your S3 Project Name', f"{textName}.mp3").upload_fileobj(audio_buffer)
    print('Audio file saved to S3 successfully')