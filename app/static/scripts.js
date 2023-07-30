/*設定初始字數限制*/
let wordLimitAmount = 5600;
window.addEventListener("load", ()=>{
    form = document.querySelector("#text_input_form");
    if (form.action == "http://127.0.0.1:5000/translate"){
        wordLimitAmount = 5600;
    }else{
        wordLimitAmount = 2800;
    }
});

/*設定右側功能欄位的事件*/
//中英翻譯設定按鈕
function leadto_translate(){
    //將form表單中的action設定為指定路徑
    form = document.querySelector("#text_input_form");
    form.action = "/translate";
    form.method = "POST";
    wordLimitAmount = 5600;
    totalCount = wordsTotal()
    document.querySelector("#textWordDisplay").innerText = `${totalCount} / ${wordLimitAmount} `;
    checkLimit()
    //設定點擊的標籤按鈕，將其class設定為function_active，並將剩餘標籤按鈕的class設定為function
    translate_input = document.querySelector("#translate_bnt");
    translate_input.className = "function_active";

    summarize = document.querySelector("#summarize_bnt");
    summarize.className = "function";

    TranslateSummarize = document.querySelector("#TranslateSummarize_bnt");
    TranslateSummarize.className = "function";

    tts_input = document.querySelector("#tts_input_bnt");
    tts_input.className = "function";
}
//中英摘要設定按鈕
function leadto_summarize(){
    //將form表單中的action設定為指定路徑
    form = document.querySelector("#text_input_form");
    form.action = "/summarize";
    form.method = "POST";
    wordLimitAmount = 2800;
    totalCount = wordsTotal()
    document.querySelector("#textWordDisplay").innerText = `${totalCount} / ${wordLimitAmount} `;
    checkLimit()
    //設定點擊的標籤按鈕，將其class設定為function_active，並將剩餘標籤按鈕的class設定為function
    translate_input = document.querySelector("#translate_bnt");
    translate_input.className = "function";

    summarize = document.querySelector("#summarize_bnt");
    summarize.className = "function_active";

    TranslateSummarize = document.querySelector("#TranslateSummarize_bnt");
    TranslateSummarize.className = "function";

    tts_input = document.querySelector("#tts_input_bnt");
    tts_input.className = "function";
}
//中英翻譯並自動摘要設定按鈕
function leadto_TranslateSummarize(){
    //將form表單中的action設定為指定路徑
    form = document.querySelector("#text_input_form");
    form.action = "/TranslateSummarize";
    form.method = "POST";
    wordLimitAmount = 2800;
    totalCount = wordsTotal()
    document.querySelector("#textWordDisplay").innerText = `${totalCount} / ${wordLimitAmount} `;
    checkLimit()
    //設定點擊的標籤按鈕，將其class設定為function_active，並將剩餘標籤按鈕的class設定為function
    translate_input = document.querySelector("#translate_bnt");
    translate_input.className = "function";

    summarize = document.querySelector("#summarize_bnt");
    summarize.className = "function";

    TranslateSummarize = document.querySelector("#TranslateSummarize_bnt");
    TranslateSummarize.className = "function_active";

    tts_input = document.querySelector("#tts_input_bnt");
    tts_input.className = "function";
}
//語音導讀設定按鈕
function leadto_tts(){
    //將form表單中的action設定為指定路徑
    form = document.querySelector("#text_input_form");
    form.action = "/tts_output";
    form.method = "POST";
    wordLimitAmount = 2800;
    totalCount = wordsTotal()
    document.querySelector("#textWordDisplay").innerText = `${totalCount} / ${wordLimitAmount} `;
    checkLimit()
    //設定點擊的標籤按鈕，將其class設定為function_active，並將剩餘標籤按鈕的class設定為function
    translate_input = document.querySelector("#translate_bnt");
    translate_input.className = "function";

    summarize = document.querySelector("#summarize_bnt");
    summarize.className = "function";

    TranslateSummarize = document.querySelector("#TranslateSummarize_bnt");
    TranslateSummarize.className = "function";

    tts_input = document.querySelector("#tts_input_bnt");
    tts_input.className = "function_active";
}

/*逐句翻譯功能(中翻英)*/
function translate_foreach_ch2en(elem){
    let voiceID = document.querySelector("#voiceID").value
    let loadingIcon = elem.querySelector("i");
    loadingIcon.style.display = "inline-block"; 
    //找到原輸入文章
    let text = document.querySelector("#text").innerHTML;
    //進行連線，送出資料進行翻譯，再拿回資料。
    fetch('/translate_foreach_ch2en', {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-type': 'application/json' 
        },
        body:JSON.stringify({text:text, voiceID:voiceID})
    })
    .then((res) => res.json())
    //將逐句翻譯後的句子展現在網頁上
    .then((data) => {
    //建立標題並抓取translateForeach
    let br = document.createElement("br");
    let p = document.createElement("p");
    p.innerText = "逐句翻譯";
    let translateForeach = document.querySelector("#translateForeach");
    translateForeach.innerHTML = "";
    translateForeach.appendChild(br);
    translateForeach.appendChild(p);
    for(let i=0;i<data.sentences_bothLangaugeList.length;i++){
        //為對中英翻譯以及音訊檔建立reuslt、audio以及container的div
        let sentences = document.createElement("div");
        sentences.classList.add("sentences");
        let audio = document.createElement("div");
        audio.classList.add("audio");
        let container = document.createElement("div");
        container.classList.add("container");
        let hr = document.createElement("hr");
        //將中英翻譯和音訊加入result以及audio，並放入container內，再將container放入translateForeach內
        sentences.innerHTML += "<div>" + data.sentences_bothLangaugeList[i] + "</div>";
        i = i.toString();
        audio.innerHTML += `<audio src="https://bilingual-assistant-demo-audio.s3.ap-northeast-1.amazonaws.com/${i}.mp3" controls></audio>` + "</div>";
        container.appendChild(sentences);
        container.appendChild(audio);
        translateForeach.appendChild(container);
        translateForeach.appendChild(hr);
        loadingIcon.style.display = "none";
    }
    })
}

/*逐句翻譯功能(英翻中)*/
function translate_foreach_en2ch(elem){
    let voiceID = document.querySelector("#voiceID").value
    let loadingIcon = elem.querySelector("i");
    loadingIcon.style.display = "inline-block"; 
    //找到原輸入文章
    let text = document.querySelector("#text").innerHTML;
    //進行連線，送出資料進行翻譯，再拿回資料。
    fetch('/translate_foreach_en2ch', {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-type': 'application/json' 
        },
        body:JSON.stringify({text:text, voiceID:voiceID})
    })
    .then((res) => res.json())
    //將逐句翻譯後的句子展現在網頁上
    .then((data) => {
    //建立標題並抓取translateForeach
    let br = document.createElement("br");
    let p = document.createElement("p");
    p.innerText = "逐句翻譯";
    let translateForeach = document.querySelector("#translateForeach");
    translateForeach.innerHTML = "";
    translateForeach.appendChild(br);
    translateForeach.appendChild(p);
    for(let i=0;i<data.sentences_bothLangaugeList.length;i++){
        //為對中英翻譯以及音訊檔建立reuslt、audio以及container的div
        let sentences = document.createElement("div");
        sentences.classList.add("sentences");
        let audio = document.createElement("div");
        audio.classList.add("audio");
        let container = document.createElement("div");
        container.classList.add("container");
        let hr = document.createElement("hr");
        //將中英翻譯和音訊加入result以及audio，並放入container內，再將container放入translateForeach內
        sentences.innerHTML += "<div>" + data.sentences_bothLangaugeList[i] + "</div>";
        i = i.toString();
        audio.innerHTML += `<audio src="https://bilingual-assistant-demo-audio.s3.ap-northeast-1.amazonaws.com/${i}.mp3" controls></audio>` + "</div>";
        container.appendChild(sentences);
        container.appendChild(audio);
        translateForeach.appendChild(container);
        translateForeach.appendChild(hr);
        loadingIcon.style.display = "none"; 
    }
    })
}

/*語音導讀*/
function ttsFunction(elem ,textId){
    let voiceID = document.querySelector("#voiceID").value
    let loadingIcon = elem.querySelector("i");
    loadingIcon.style.display = "inline-block"; 
    //找到文章
    let text = document.querySelector(textId).innerText;
    textId = textId.replace("#","");
    console.log(textId);
    //進行連線，送出資料進行語音導讀。
    fetch('/ttsFunction', {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-type': 'application/json' 
        },
        body:JSON.stringify({text:text, textId:textId, voiceID:voiceID})
    })
    .then((res) => res.json())
    .then((data) => {
        //elem.innerHTML = `<button onclick="ttsFunction(this,'#translated_en_paragraph');" class="audio"><img src="static/icons/sound.png" />語音導讀</button>`;
        elem.innerHTML = `<audio src="https://bilingual-assistant-demo-audio.s3.ap-northeast-1.amazonaws.com/${data.textId}.mp3" controls></audio>`;
    })
}

/*單字統整功能*/
function vocabulary_hunter(elem, inputText){
    //找到英文翻譯文本
    let loadingIcon = elem.querySelector("i");
    loadingIcon.style.display = "inline-block"; 
    let text = document.querySelector(inputText).innerHTML;
    fetch('/vocabularyHunter', {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-type': 'application/json' 
        },
        body:JSON.stringify({text:text})
    })
    .then((res) => res.json())
    //將有標註重點單字的文章展現在網頁上
    .then((data) => {
        document.querySelector(inputText).innerHTML = data.keypointText;
    })
    loadingIcon.style.display = "none"; 
    elem.disabled = true;
    elem.style.backgroundColor = "#cccccc";
    elem.style.cursor = "default";
}


/*Copy Button*/
let copyFunction = false; //確認copy()是否正在執行，正在執行為true, 反之為false
function copy(elem, copyId){
    copyFunction = true; 
    let copyText = document.querySelector(copyId).innerText;
    navigator.clipboard.writeText(copyText);
    //按下copy後，其CSS樣式會改變，其copy()結束後會恢復
    setTimeout(function(){
        elem.style.backgroundColor = "#42D43D";
        elem.style.color = "white";
        elem.style.transitionDuration = "0.4s";
        elem.innerHTML = '<img src="https://github.com/ChingHung21/Icons/blob/main/copy.png?raw=true" />Copied';
        setTimeout(function(){
            elem.style.backgroundColor = "#F9C80E";
            elem.style.color = "black";
            elem.style.transitionDuration = "1.2s";
            elem.style.hover ="box-shadow: inset, background-color: #D9AE13";
            elem.innerHTML = '<img src="https://github.com/ChingHung21/Icons/blob/main/copy.png?raw=true" />Copy';
        },2500);
    },800);
    setTimeout(function(){
        copyFunction = false;
    },3300);
}

//設定Copy Button滑鼠移入與移出的CSS樣式
function copyButton_Focus(elem){
    if (copyFunction == false){
        let copyButton = document.querySelector(".copy");
        elem.style.boxShadow = "inset";
        elem.style.backgroundColor = "#D9AE13";
        elem.style.transitionDuration = "0s";
    }
}
function copyButton_Relax(elem){
    if (copyFunction == false){
        let copyButton = document.querySelector(".copy");
        elem.style.boxShadow = "";
        elem.style.backgroundColor = "#F9C80E";
        elem.style.transitionDuration = "0s";
    }
}

/*Dictionary*/
let dictionaryWrapper = document.querySelector(".dictionaryWrapper");
let searchInput = document.querySelector("#searchInput");
let removeIcon = document.querySelector("#closeIcon");
let searchIcon = document.querySelector("#searchIcon");
let dictionaryButton = document.querySelector(".dictionaryButton");
let url = "";
//設定Dictionary按鈕
function leadtoYahoo(){
    yahooDictionary = document.querySelector("#yahooDictionary");
    cambridgeDictionary = document.querySelector("#cambridgeDictionary");
    oxfordDictionary = document.querySelector("#oxfordDictionary");
    merriamDictionary = document.querySelector("#merriamDictionary");
    yahooDictionary.className = "dictionaryActive";
    cambridgeDictionary.className = "dictionaryOption";
    oxfordDictionary.className = "dictionaryOption";
    merriamDictionary.className = "dictionaryOption";
}
function leadtoCambridge(){
    yahooDictionary = document.querySelector("#yahooDictionary");
    cambridgeDictionary = document.querySelector("#cambridgeDictionary");
    oxfordDictionary = document.querySelector("#oxfordDictionary");
    merriamDictionary = document.querySelector("#merriamDictionary");
    yahooDictionary.className = "dictionaryOption";
    cambridgeDictionary.className = "dictionaryActive";
    oxfordDictionary.className = "dictionaryOption";
    merriamDictionary.className = "dictionaryOption";
}
function leadtoOxford(){
    yahooDictionary = document.querySelector("#yahooDictionary");
    cambridgeDictionary = document.querySelector("#cambridgeDictionary");
    oxfordDictionary = document.querySelector("#oxfordDictionary");
    merriamDictionary = document.querySelector("#merriamDictionary");
    yahooDictionary.className = "dictionaryOption";
    cambridgeDictionary.className = "dictionaryOption";
    oxfordDictionary.className = "dictionaryActive";
    merriamDictionary.className = "dictionaryOption";
}
function leadtoMerriam(){
    yahooDictionary = document.querySelector("#yahooDictionary");
    cambridgeDictionary = document.querySelector("#cambridgeDictionary");
    oxfordDictionary = document.querySelector("#oxfordDictionary");
    merriamDictionary = document.querySelector("#merriamDictionary");
    yahooDictionary.className = "dictionaryOption";
    cambridgeDictionary.className = "dictionaryOption";
    oxfordDictionary.className = "dictionaryOption";
    merriamDictionary.className = "dictionaryActive";
}

function leadtoDictionary(word){
    if (yahooDictionary.className == "dictionaryActive"){
        url = `https://tw.dictionary.search.yahoo.com/search;_ylt=Awrtkk5dPihkGTgQBqF7rolQ;_ylc=X1MDMTM1MTIwMDM3OQRfcgMyBGZyAwRmcjIDc2ItdG9wLXNlYXJjaARncHJpZAM4TnJzVGhWUlM3QzJXY3paTlFWU1lBBG5fcnNsdAMwBG5fc3VnZwMxMARvcmlnaW4DdHcuZGljdGlvbmFyeS5zZWFyY2gueWFob28uY29tBHBvcwMwBHBxc3RyAwRwcXN0cmwDMARxc3RybAM0BHF1ZXJ5A2Jvb2sEdF9zdG1wAzE2ODAzNTkwMTI-?p=${word}&fr=sfp&iscqry=&fr2=sb-top-search`;
        let newURL = document.createElement('a');
        newURL.href = url;
        newURL.target="_blank"
        newURL.rel="noopener noreferrer"
        document.body.appendChild(newURL);
        newURL.click();
    }if (cambridgeDictionary.className == "dictionaryActive"){
        url = `https://dictionary.cambridge.org/zht/%E8%A9%9E%E5%85%B8/%E8%8B%B1%E8%AA%9E-%E6%BC%A2%E8%AA%9E-%E7%B9%81%E9%AB%94/${word}`;
        let newURL = document.createElement('a');
        newURL.href = url;
        newURL.target="_blank"
        newURL.rel="noopener noreferrer"
        document.body.appendChild(newURL);
        newURL.click();
    }if (oxfordDictionary.className == "dictionaryActive"){
        url =  `https://www.oxfordlearnersdictionaries.com/definition/english/${word}_1?q=${word}`;
        let newURL = document.createElement('a');
        newURL.href = url;
        newURL.target="_blank"
        newURL.rel="noopener noreferrer"
        document.body.appendChild(newURL);
        newURL.click();
    }if (merriamDictionary.className == "dictionaryActive"){
        url = `https://www.merriam-webster.com/dictionary/${word}`;
        let newURL = document.createElement('a');
        newURL.href = url;
        newURL.target="_blank"
        newURL.rel="noopener noreferrer"
        document.body.appendChild(newURL);
        newURL.click();
    }
}

searchInput.addEventListener("keyup", e=>{
    if(e.key === "Enter" && e.target.value){
        leadtoDictionary(e.target.value);
    }
});
searchIcon.addEventListener("click", ()=>{
        leadtoDictionary(searchInput.value);
});

removeIcon.addEventListener("click", ()=>{
    searchInput.value = "";
    searchInput.focus();
})

function hideShow() {
    if (dictionaryWrapper.style.display == "none" || dictionaryWrapper.style.display == ''){
        dictionaryWrapper.style.display = "block"; 
        dictionaryWrapper.style.position = "fixed";
        dictionaryButton.className = "dictionaryButtonActive";
    }else{
        dictionaryWrapper.style.display = "none"
        dictionaryButton.className = "dictionaryButton";
    }
}

//WordCloud
let wordcloud = document.querySelector(".wordcloud")
let createCloud = document.querySelector(".createCloud")
window.addEventListener("load", ()=>{
    if (createCloud.innerText == "Word Cloud"){
        wordcloud.style.display = "block"
    }else{
        wordcloud.style.display = "none"
    }
});

let select = document.querySelector("#voiceSelect")
let voiceID = document.querySelector("#voiceID")
select.addEventListener("change", ()=>{
    voiceID.value = select.value;
    console.log(voiceID.value)
})

/*設定初始字數限制*/
//計算輸入框字數
function wordsTotal() {
    let text = document.querySelector("#text").value;
    // 定義正規表達式，找出中文字符和非中文字符
    let chineseRegex = /[\u4e00-\u9fa5]/gm; 
    let  nonChineseRegex = /[^\u4e00-\u9fa5]/gm; 
    // 計算中文字數量，每個中文字佔兩個字元
    let  chineseCount = (text.match(chineseRegex) || []).length * 2;
    // 計算非中文字數量，每個非中文字元佔一個字元
    let  nonChineseCount = (text.match(nonChineseRegex) || []).length;
    // 總字數
    let  totalCount = chineseCount + nonChineseCount;

    document.querySelector("#textWordDisplay").innerText = `${totalCount} / ${wordLimitAmount}  `;
    return totalCount
}

//確認輸入框字數，超過字數則使送出鍵失效
let textarea = document.querySelector("#text");
textarea.addEventListener('input', function() {
    checkLimit()
  });
textarea.addEventListener('click', function() {
    checkLimit()
});

function checkLimit(){
    form = document.querySelector("#text_input_form");
    console.log(form.action);
    if (form.action == "http://127.0.0.1:5000/translate"){
        wordLimitAmount = 5600;
    }else{
        wordLimitAmount = 2800;
    }

    let inputButton = document.querySelector("#inputButton");
    totalCount = wordsTotal()
    if (totalCount > wordLimitAmount) {
        document.querySelector("#textWordDisplay").style.color = "red";
        document.querySelector("#wordlimitAlert").style.display = "block";
        document.querySelector("#textWordDisplay").innerText = ` ${totalCount} / ${wordLimitAmount} `;
        inputButton.setAttribute('disabled','disabled');
        inputButton.className = "inputButtonDisabled";
    }if (totalCount <= wordLimitAmount){
        document.querySelector("#textWordDisplay").style.color = "black";
        document.querySelector("#wordlimitAlert").style.display = "none";
        document.querySelector("#textWordDisplay").innerText = ` ${totalCount} / ${wordLimitAmount} `;
        inputButton.removeAttribute('disabled','none');
        inputButton.className = "inputButton";
    }
}

let outputAction = document.querySelector("#outputAction");
outputAction = outputAction.innerText;
/*OpenAI抽象摘要功能*/
window.addEventListener("load", ()=>{
    if (outputAction == "summarize_en"){
        abstractive_summarization_en();
    }else if(outputAction == "summarize_ch"){
        abstractive_summarization_ch();
    }else if(outputAction == "TranslateSummarize_ch2en"){
        abstractive_TranslateSummarization_en()
    }else if(outputAction == "TranslateSummarize_en2ch"){
        abstractive_TranslateSummarization_ch()
    }
});

//英文抽象摘要
function abstractive_summarization_en(){
    //找到原輸入文章
    let text = document.querySelector("#text").innerHTML;
    //進行連線，送出資料進行摘要，再拿回資料。
    fetch('/abstractive_summarization_en', {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-type': 'application/json' 
        },
        body:JSON.stringify({text:text})
    })
    .then((res) => res.json())
    .catch((error) => {
        console.error('API request failed or timed out:', error);
        abstractive_summarization_en(); 
        })
    //將英文抽象摘要展現在網頁上
    .then((data) => {
        console.log(data.abstractive_summary_en);
        if (data.abstractive_summary_en === '') {
            abstractive_summarization_en();
        }
        else{
            let abstractive_summary_en = document.querySelector("#abstractive_summary_en");
            abstractive_summary_en.style.display = "block";
            let tools = document.querySelector("#abstractive_summary_tools");
            tools.style.display = "flex";
            abstractive_summary_en.innerHTML = data.abstractive_summary_en
        }
    })
}

//中翻英後英文抽象摘要
function abstractive_TranslateSummarization_en(){
    //找到原輸入文章
    let text = document.querySelector("#translate").innerText;
    //進行連線，送出資料進行摘要，再拿回資料。
    fetch('/abstractive_summarization_en', {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-type': 'application/json' 
        },
        body:JSON.stringify({text:text})
    })
    .then((res) => res.json())
    .catch((error) => {
        console.error('API request failed or timed out:', error);
        abstractive_TranslateSummarization_en(); 
        })
    //將英文抽象摘要展現在網頁上
    .then((data) => {
        console.log(data.abstractive_summary_en);
        if (data.abstractive_summary_en === '') {
            abstractive_TranslateSummarization_en();
        }
        else{
            let abstractive_summary_en = document.querySelector("#abstractive_summary_en");
            abstractive_summary_en.style.display = "block";
            let tools = document.querySelector("#abstractive_summary_tools");
            tools.style.display = "flex";
            abstractive_summary_en.innerHTML = data.abstractive_summary_en
        }
    })
}

//中文抽象摘要
function abstractive_summarization_ch(){
    //找到原輸入文章
    let text = document.querySelector("#text").innerHTML;
    //進行連線，送出資料進行摘要，再拿回資料。
    fetch('/abstractive_summarization_ch', {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-type': 'application/json' 
        },
        body:JSON.stringify({text:text})
    })
    .then((res) => res.json())
    .catch((error) => {
        console.error('API request failed or timed out:', error);
        abstractive_summarization_ch(); 
        })
    //將中文抽象摘要展現在網頁上
    .then((data) => {
        console.log(data.abstractive_summary_ch);
        if (data.abstractive_summary_ch === '') {
            abstractive_summarization_ch();
        }
        else{
            let abstractive_summary_ch = document.querySelector("#abstractive_summary_ch");
            abstractive_summary_ch.style.display = "block";
            abstractive_summary_ch.innerHTML = data.abstractive_summary_ch
        }
    })
}

//英翻中後中文抽象摘要
function abstractive_TranslateSummarization_ch(){
    //找到原輸入文章
    let text = document.querySelector("#translate").innerText;
    //進行連線，送出資料進行摘要，再拿回資料。
    fetch('/abstractive_summarization_ch', {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-type': 'application/json' 
        },
        body:JSON.stringify({text:text})
    })
    .then((res) => res.json())
    .catch((error) => {
        console.error('API request failed or timed out:', error);
        abstractive_TranslateSummarization_ch(); 
        })
    //將英文抽象摘要展現在網頁上
    .then((data) => {
        console.log(data.abstractive_summary_ch);
        if (data.abstractive_summary_ch === '') {
            abstractive_TranslateSummarization_ch();
        }
        else{
            let abstractive_summary_ch = document.querySelector("#abstractive_summary_ch");
            abstractive_summary_ch.style.display = "block";
            let tools = document.querySelector("#abstractive_summary_tools");
            tools.style.display = "flex";
            abstractive_summary_ch.innerHTML = data.abstractive_summary_ch
        }
    })
}
