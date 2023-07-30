import requests, uuid, json
# Add your key and endpoint
key = "Your Azure API KEY"
endpoint = "Your Azure API Endpoint"
# Add your location, also known as region. The default is global.
location = "Your Service Location"
path = '/translate'
constructed_url = endpoint + path

params = {
    'api-version': '3.0',
    'from': 'zh-Hant',
    'to': ['en']
}
headers = {
    'Ocp-Apim-Subscription-Key': key,
    'Ocp-Apim-Subscription-Region': location,
    'Content-type': 'application/json',
    'X-ClientTraceId': str(uuid.uuid4())
}

def translator_ch2en(Chinese_Text):
    body = [{
        'text': Chinese_Text
    }]
    request = requests.post(constructed_url, 
                            params=params, 
                            headers=headers, 
                            json=body)
    response = request.json()

    #使用Regular Expression擷取出英文翻譯
    translated = json.dumps(response, sort_keys=True, 
                            ensure_ascii=False, 
                            indent=4, 
                            separators=(',', ': '))
    import re
    pattern1 = '"text":\s.*"'
    raw_translated = str(re.findall(pattern1, translated)) 
    English_Text = re.sub("\"text\": ", "", raw_translated)
    return English_Text

