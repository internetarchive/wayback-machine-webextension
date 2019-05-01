function startConverting(){
    var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
    var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
    var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent
    var reference= document.getElementById('search_input')
    if('webkitSpeechRecognition' in window){
        var recognition=new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang='[en-IN]';
        recognition.start();
        var finalTranscript='';
        recognition.onresult=function( event ){
            var interimTrans='';
            for(var i=event.resultIndex;i<event.results.length;i++){
                var transcripts=event.results[i][0].transcript;
                if(event.results[i].isFinal){
                    finalTranscript+=transcripts;
                    reference.value+='https://'+finalTranscript;
                }
                else{
                    interimTrans+=transcripts;
                }
            }

        };
    }
    else{
        alert(" Voice Recognition is not available \n browser please try Upgrading Chrome.");
    }
}
