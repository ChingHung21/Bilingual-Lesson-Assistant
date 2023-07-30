from app import app
from flask import request, render_template, jsonify, session

import re
from app.modules.text_translator_ch2en import translator_ch2en
from app.modules.text_translator_en2ch import translator_en2ch
from app.modules.summa_TextRank import TextRank_Summarizer_en
from app.modules.snownlp_TextRank import TextRank_Summarizer_ch
from app.modules.speech_synthesis import tts, tts_foreach, tts_Function
from app.modules.vocabulary_hunter import vocabulary_hunter
from app.modules.word_cloud import englishCloud
from app.modules.openaiSummarizer import openaiSummarizer_en, openaiSummarizer_ch
from app.modules.language_detection import language_detector

#建立網站頁面
@app.route("/")
def index():
    return render_template("index.html")

#建立單字頁面
@app.route("/vocabulary")
def vocabulary():
    return render_template("vocabulary.html")

#建立說明頁面
@app.route("/help")
def help():
    return render_template("help.html")

#建立關於頁面
@app.route("/about")
def about():
    return render_template("about.html")

#中英翻譯功能輸出網站
@app.route("/translate", methods=['POST','GET'])
def translate_output():
    text = request.form["text"]
    languageType = language_detector(text)
    if languageType == "en":
        #英文原文
        English_Text = text
        #中文翻譯
        Chinese_Text = translator_en2ch(English_Text).replace('\\n', '<br>').replace('[\'"', '').replace('"\']', '').replace('\\r', '').replace('\\', '')
        return render_template('translate_output_en2ch.html',English_Text=English_Text,Chinese_Text=Chinese_Text)
    elif language_detector(text) == "zh-TW":
        #中文原文
        Chinese_Text = text
        #英文翻譯
        English_Text = translator_ch2en(Chinese_Text).replace('\\n', '<br>').replace('\\r', '').replace('\\\\','').replace('\\','').replace('[','').replace(']','').strip('\'').strip('\"').strip().replace('.','. ').replace('.  ','. ')
        #產生英文文字雲
        createCloud = englishCloud(English_Text)
        return render_template('translate_output_ch2en.html',Chinese_Text=Chinese_Text,English_Text=English_Text,createCloud=createCloud)
    
#逐句翻譯(中翻英)
@app.route("/translate_foreach_ch2en", methods=['POST'])
def translate_foreach_ch2en():
    #取得中文輸入文章
    data = request.get_json()
    text = data.get('text')
    voiceID = data.get('voiceID')  
    #利用Regular Expression將中文輸入文章進行斷句
    sentences = re.split(r'(?<=[。!?])\s*', text)
    #建立中英句子的List，並將中英句子合併後放在List中
    sentences_bothLangaugeList = []
    for sentence in sentences:
        #將中文句子逐句進行英文翻譯
        english_sentence = translator_ch2en(sentence).replace('\\n', '').replace('\\r', '').replace('\\\\','').replace('\\','').replace('[','').replace(']','').strip('\'').strip('\"').strip().replace('.','. ').replace('.  ','. ')
        #取得句子的index，並將其index設定為文字轉語音的檔名
        index = sentences.index(sentence)
        tts_foreach(english_sentence, index, voiceID)
        #若句子內容為空，則跳出if判斷式不做任何事
        if len(sentence) == 0 & len(english_sentence) ==0:
            continue
        else:
            sentences_bothLangauge = sentence + "<br>" + english_sentence + "<br>"
            sentences_bothLangaugeList.append(sentences_bothLangauge)
    return jsonify({"sentences_bothLangaugeList":sentences_bothLangaugeList})

#逐句翻譯(英翻中)
@app.route("/translate_foreach_en2ch", methods=['POST'])
def translate_foreach_en2ch():
    #取得英文輸入文章
    data = request.get_json()
    text = data.get('text')
    voiceID = data.get('voiceID')   
    #利用Regular Expression將英文輸入文章進行斷句
    # splitedSentences = re.split(r'[.?!]', text)
    splitedSentences = re.split(r'(?<=[.?!])', text)
    sentences = []
    #因為re模組輸出的splitedSentences列表中，會有一個多餘的空白元素，因此需要利用strip()將多餘空白去除，並重新放入另一個sentences列表中
    for sentence in splitedSentences:
        sentence = sentence.strip()
        sentences.append(sentence)
    #建立中英句子的List，並將中英句子合併後放在List中
    sentences_bothLangaugeList = []
    for sentence in sentences:
        #將英文句子逐句進行中文翻譯
        chinese_sentence = translator_en2ch(sentence).replace('[\'"', '').replace('"\']', '').replace('\\r', '').replace('\\n', '').replace('\\', '')
        #取得句子的index，並將其index設定為文字轉語音的檔名
        index = sentences.index(sentence)
        tts_foreach(sentence, index, voiceID)
        #若句子內容為空，則跳出if判斷式不做任何事
        if len(sentence) == 0 & len(chinese_sentence) == 0:
            continue
        else:
            sentences_bothLangauge = sentence + "<br>" + chinese_sentence + "<br>"
            sentences_bothLangaugeList.append(sentences_bothLangauge)
    return jsonify({"sentences_bothLangaugeList":sentences_bothLangaugeList})

#中英摘要功能輸出網站
@app.route("/summarize", methods=['POST','GET'])
def summarize_output():
    text = request.form["text"]
    languageType = language_detector(text)
    if languageType == "en":
        #英文原文
        English_Text = text
        #英文摘要以及highlight過的原文
        highlighted_text, extractive_summary_en = TextRank_Summarizer_en(English_Text)
        createCloud = englishCloud(English_Text)
        return render_template('summarize_output_en.html',English_Text=English_Text,highlighted_text=highlighted_text,extractive_summary_en=extractive_summary_en,createCloud=createCloud,outputAction="summarize_en")
    elif language_detector(text) == "zh-TW":
        #中文原文
        Chinese_Text = text
        #中文摘要
        highlighted_text, extractive_summary_ch = TextRank_Summarizer_ch(Chinese_Text)
        return render_template('summarize_output_ch.html',Chinese_Text=Chinese_Text,highlighted_text=highlighted_text,extractive_summary_ch=extractive_summary_ch,outputAction="summarize_ch")

#中英翻譯並摘要功能輸出網站
@app.route("/TranslateSummarize", methods=['POST','GET'])
def TranslateSummarize_output():
    text = request.form["text"]
    languageType = language_detector(text)
    if languageType == "en":
        #英文原文
        English_Text = text
        #中文翻譯
        Chinese_Text = translator_en2ch(English_Text).replace('\\n', '<br>').replace('[\'"', '').replace('"\']', '').replace('\\r', '').replace('\\', '')
        #中文摘要
        highlighted_text, extractive_summary_ch = TextRank_Summarizer_ch(Chinese_Text)
        return render_template("TranslateSummarize_output_en2ch.html",English_Text=English_Text,Chinese_Text=Chinese_Text,extractive_summary_ch=extractive_summary_ch,highlighted_text=highlighted_text,outputAction="TranslateSummarize_en2ch")
    elif language_detector(text) == "zh-TW":
        #中文原文
        Chinese_Text = text
        #英文翻譯
        English_Text = translator_ch2en(Chinese_Text).replace('\\n', '<br>').replace('\\r', '').replace('\\\\','').replace('\\','').replace('[','').replace(']','').strip('\'').strip('\"').strip().replace('.','. ').replace('.  ','. ')
        #英文摘要以及highlight過的原文
        highlighted_text, extractive_summary_en = TextRank_Summarizer_en(English_Text)
        #產生英文文字雲
        createCloud = englishCloud(English_Text)
        return render_template("TranslateSummarize_output_ch2en.html",Chinese_Text=Chinese_Text,English_Text=English_Text, highlighted_text=highlighted_text, extractive_summary_en=extractive_summary_en, createCloud=createCloud,outputAction="TranslateSummarize_ch2en")

#單字統整功能(英文翻譯)
@app.route("/vocabularyHunter", methods=['POST'])
def vocabularyHunter():
    #取得英文摘要
    data = request.get_json()
    text = data.get('text') 
    #單字統整後的英文摘要
    keypointText = vocabulary_hunter(text)
    print("keypointText", keypointText)
    return jsonify({"keypointText":keypointText})

#語音輸出網站
@app.route("/tts_output", methods=['POST','GET'])
def tts_output():
    Text= request.form["text"]
    voiceID= request.form["voiceID"]
    tts(Text, voiceID)
    return render_template("tts_output.html",Text=Text)

#語音導讀功能
@app.route("/ttsFunction", methods=['POST'])
def ttsFunction():
    #取得文章
    data = request.get_json()
    text = data.get('text')
    textId = data.get('textId')
    voiceID = data.get('voiceID')
    tts_Function(text, textId, voiceID)
    return jsonify({"text":text, "textId":textId})

#抽象英文摘要功能
@app.route("/abstractive_summarization_en", methods=['POST'])
def openaiEnglishSummarization():
    #取得文章
    data = request.get_json()
    text = data.get('text')
    abstractive_summary_en = openaiSummarizer_en(text)
    return jsonify({"abstractive_summary_en":abstractive_summary_en})

#抽象中文摘要功能
@app.route("/abstractive_summarization_ch", methods=['POST'])
def openaiChineseSummarization():
    #取得文章
    data = request.get_json()
    text = data.get('text')
    abstractive_summary_ch = openaiSummarizer_ch(text)
    return jsonify({"abstractive_summary_ch":abstractive_summary_ch})

