function generateAndSaveTTS(text, filename) {
    const utterance = new SpeechSynthesisUtterance(text);
  
    // Customize voice and options (optional)
    const voices = speechSynthesis.getVoices();
    // utterance.voice = voices.find(voice => voice.name === 'Google US English'); // Replace with desired voice
    utterance.lang = 'en-IN'; // Set language
    utterance.rate = 1.0; // Adjust speech rate
    utterance.pitch = 1.0; // Adjust pitch
  
    // Create a Blob from the audio stream
    const audioBlob = new Blob([new Promise(resolve => {
      utterance.onend = () => {
        const audioContext = new AudioContext();
        const bufferSource = audioContext.createBufferSource();
        const buffer = audioContext.createBuffer(1, utterance.text.length * 100, 44100);
        const channelData = buffer.getChannelData(0);
  
        const scriptProcessor = audioContext.createScriptProcessor(1024, 1, 1);
        scriptProcessor.onaudioprocess = (e) => {
          channelData.set(e.inputBuffer.getChannelData(0));
        };
  
        bufferSource.buffer = buffer;
        bufferSource.connect(scriptProcessor);
        scriptProcessor.connect(audioContext.destination);
        bufferSource.start();
  
        audioContext.oncomplete = () => {
          resolve(audioContext.createOfflineContext().decodeAudioData(buffer));
        };
      };
  
      speechSynthesis.speak(utterance);
    })]);
  
    // Create a download link
    const url = URL.createObjectURL(audioBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
  }
  
  var text = document.getElementById('text-input').value;
  // Example usage:
  document.getElementById('save-button').addEventListener('click', () => {
    generateAndSaveTTS(text, "hello.wav");
  });
  
  document.getElementById('speak-button').addEventListener('click', () => {
    const text = document.getElementById('text-input').value;

    if (!text) {
        alert('Please enter some text to speak.');
        return;
    }

    // Create a new SpeechSynthesisUtterance instance
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-IN'; 
    utterance.rate = 1.2;
    utterance.pitch = 1;
    utterance.volume = 1;

    // Speak the text
    speechSynthesis.speak(utterance);
});


