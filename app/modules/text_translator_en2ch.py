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
    'from': 'en',
    'to': ['zh-Hant']
}

headers = {
    'Ocp-Apim-Subscription-Key': key,
    'Ocp-Apim-Subscription-Region': location,
    'Content-type': 'application/json',
    'X-ClientTraceId': str(uuid.uuid4())
}

def translator_en2ch(English_Text):
    body = [{
        'text': English_Text
    }]

    request = requests.post(constructed_url, params=params, headers=headers, json=body)
    response = request.json()

    #使用Regular Expression擷取出中文翻譯
    translated = json.dumps(response, sort_keys=True, ensure_ascii=False, indent=4, separators=(',', ': '))

    import re
    pattern1 = '"text":\s.*"'
    raw_translated = str(re.findall(pattern1, translated)) 
    Chinese_Text = re.sub("\"text\": ", "", raw_translated)
    return Chinese_Text