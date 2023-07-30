import openai
openai.api_key = "Your OpenAI API KEY"

# 英文抽象摘要
def openaiSummarizer_en(text):    
    response = openai.Completion.create(
        engine="text-davinci-003",
        prompt=(f"Summarize this text:\n\n{text}"),
        temperature=0.5,
        max_tokens=450,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0
    )
    abstractive_summary_en = response.choices[0].text.strip()
    if len(text) < 600:
        abstractive_summary_en = "您所選擇的文章，文字數量不足，因此未產生摘要。進行文章摘要需要輸入一段足夠長的文字，才能產生較有意義的摘要。若您需要產生「英文文章摘要」，原文建議要有4句以上（約600個字元）；若您需要產生「中文文章摘要」，原文建議要有300字（約600個字元）以上。"
    return abstractive_summary_en

# 中文抽象摘要
def openaiSummarizer_ch(text):
    response = openai.Completion.create(
        engine="text-davinci-003",
        prompt=(f"請摘要以下文章:\n\n{text}"),
        temperature=0.9,
        max_tokens=400,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0
    )
    abstractive_summary_ch = response.choices[0].text.strip()
    if len(text) < 300:
        abstractive_summary_ch = "您所選擇的文章，文字數量不足，因此未產生摘要。進行文章摘要需要輸入一段足夠長的文字，才能產生較有意義的摘要。若您需要產生「英文文章摘要」，原文建議要有4句以上；若您需要產生「中文文章摘要」，原文建議要有300字以上。"
    return abstractive_summary_ch