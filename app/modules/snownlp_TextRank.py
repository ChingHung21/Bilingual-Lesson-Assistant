from snownlp import SnowNLP
def TextRank_Summarizer_ch(text):
    try:
        #將文本透過snownlp進行處理
        s = SnowNLP(text)
        #計算文章的句子的數量
        number_of_sentences = len(s.sentences)
        #大約取文章的四成句子作為摘要
        num = round((number_of_sentences*0.4))
        #擷取重點語句(未按照原文順序)
        summary = s.summary(num)

        #產生具有標點符號的摘要
        summary_with_punctuations = []
        for sentence in summary:
            if sentence in text:
                summary_with_punctuations.append(sentence + text[text.index(sentence)+len(sentence)])
        #產生具有標點符號的斷句
        sentences_with_puncuations = []
        for sentence in s.sentences:
            sentence = sentence + text[text.index(sentence)+len(sentence)]
            sentences_with_puncuations.append(sentence)
        #產生摘要(將摘要句子按照原文章順序重新排序)
        extractive_summary_ch = ''''''
        for sentence in sentences_with_puncuations:
            for summary_sentence in summary_with_punctuations:
                if sentence == summary_sentence:
                    extractive_summary_ch += sentence

        if len(extractive_summary_ch) > 0:
            extractive_summary_ch = extractive_summary_ch[:-1] + '。'
        
        extractive_summary_ch = extractive_summary_ch.replace("<br>","")

        if len(extractive_summary_ch) == 0:
            extractive_summary_ch = "您所選擇的文章，句子數量不足(建議至少三句)，因此未產生摘要。"

        #產生highlight過的原文
        for summary_sentence in summary:
            text = text.replace(summary_sentence, "<mark>"+summary_sentence+"</mark>").replace("\n","<br>")
            highlighted_text = text

        return highlighted_text, extractive_summary_ch
    
    except ZeroDivisionError:
        return " "
    
    except ValueError: 
        return " "