let duration=SPEECH_ASSESSMENT.DURATION,canRecord=!1,player=new Audio,errorMsg="",recordProgress=0,isRecording=!1,isPlaying=!1,recordTimer=0,serverParams={},settingForm={dict_type:SPEECH_ASSESSMENT.DICT_TYPE,precision:SPEECH_ASSESSMENT.PRECISION,agegroup:SPEECH_ASSESSMENT.AGE_GROUP,slack:SPEECH_ASSESSMENT.SLACK,phoneme_diagnosis:SPEECH_ASSESSMENT.PHONEME_DIAGNOSIS};const initRecorder=()=>{recorder=createRecorder(),setupAudioPlayer()},createRecorder=()=>new _17kouyu.IRecorder({appKey:SPEECH_ASSESSMENT.APP_KEY,secretKey:SPEECH_ASSESSMENT.SECRET_KEY,server:SPEECH_ASSESSMENT.WS_SERVER,mode:SPEECH_ASSESSMENT.MODE,onFlashLoad:(e,r)=>{},onConnectorStatusChange:(e,r)=>{},onMicStatusChange:(e,r)=>{50001==+e?canRecord=!0:(canRecord=!1,errorMsg="Please allow microphone access to try demo.")},onError:e=>{console.log("onError",e)}}),startTimer=()=>{clearInterval(recordTimer);let e=0;recordTimer=setInterval((()=>{e+=30,e>=duration?clearInterval(recordTimer):recordProgress=e/duration*100}),30)},setupAudioPlayer=()=>{player.pause(),player.currentTime=0,player.addEventListener("pause",(()=>{isPlaying=!1})),player.addEventListener("ended",(()=>{isPlaying=!1}))},listenRecord=e=>{recorder.startReplay({recordId:e})};