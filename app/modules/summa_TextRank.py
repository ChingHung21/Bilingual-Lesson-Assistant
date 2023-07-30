from summa import summarizer
def TextRank_Summarizer_en(text):
    #以list的形式，比對原文與摘要，將原文中的重點句，加上<mark>標籤
    extractive_summary_en_list = summarizer.summarize(text, ratio=0.4, split=True)
    #摘要(string)
    extractive_summary_en = summarizer.summarize(text, ratio=0.4)
    extractive_summary_en =  extractive_summary_en.replace("<br>","")
    
    highlighted_text = ""
    if len(extractive_summary_en) == 0:
        extractive_summary_en = "您所選擇的文章，句子數量不足(建議至少三句)，因此未產生摘要。"

    for summary_sentence in extractive_summary_en_list:
        text = text.replace(summary_sentence, "<mark>"+summary_sentence+"</mark>").replace("\n","<br>")
        highlighted_text = text

    return highlighted_text, extractive_summary_en


