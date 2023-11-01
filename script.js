if ('speechSynthesis' in window) {
    const speechSynthesis = window.speechSynthesis;
    const textInput = document.getElementById('text-input');
    const languageSelect = document.getElementById('language-select');
    const voiceSelect = document.getElementById('voice-select');
    const volumeControl = document.getElementById('volume-control');
    const pitchControl = document.getElementById('pitch-control');
    const rateControl = document.getElementById('rate-control');
    const convertButton = document.getElementById('convert-button');
    const pauseButton = document.getElementById('pause-button');
    const resumeButton = document.getElementById('resume-button');
    const saveButton = document.getElementById('save-button');
    const output = document.getElementById('highlighted-text');

    let isPaused = false;
    let volume = 1.0;
    let pitch = 1.0;
    let rate = 1.0;

    volumeControl.addEventListener('input', () => {
        volume = parseFloat(volumeControl.value);
    });

    pitchControl.addEventListener('input', () => {
        pitch = parseFloat(pitchControl.value);
    });

    rateControl.addEventListener('input', () => {
        rate = parseFloat(rateControl.value);
    });

    languageSelect.addEventListener('change', () => {
        const selectedLang = languageSelect.value;
        populateVoiceList(selectedLang);
    });

    convertButton.addEventListener('click', () => {
        const text = textInput.value;
        const voiceName = voiceSelect.value;
        if (text) {
            const utterance = new SpeechSynthesisUtterance(text);
            const selectedVoice = speechSynthesis.getVoices().find(voice => voice.name === voiceName);
            utterance.voice = selectedVoice;
            utterance.volume = volume;
            utterance.pitch = pitch;
            utterance.rate = rate;
            speechSynthesis.speak(utterance);
            output.textContent = text;
        }
    });

    pauseButton.addEventListener('click', () => {
        speechSynthesis.pause();
        isPaused = true;
    });

    resumeButton.addEventListener('click', () => {
        if (isPaused) {
            speechSynthesis.resume();
            isPaused = false;
        }
    });

    saveButton.addEventListener('click', () => {
        const text = textInput.value;
        const voiceName = voiceSelect.value;
        if (text) {
            const utterance = new SpeechSynthesisUtterance(text);
            const selectedVoice = speechSynthesis.getVoices().find(voice => voice.name === voiceName);
            utterance.voice = selectedVoice;
            utterance.volume = volume;
            utterance.pitch = pitch;
            utterance.rate = rate;
            speechSynthesis.speak(utterance);

            utterance.onend = () => {
                const blob = new Blob([new Uint8Array(utterance.audioBuffer)], { type: 'audio/wav' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'speech.mp3';
                a.click();
                URL.revokeObjectURL(url);
            };
        }
    });

    function populateVoiceList(lang) {
        voiceSelect.innerHTML = '';
        const voices = speechSynthesis.getVoices();
        for (let voice of voices) {
            if (voice.lang.startsWith(lang)) {
                const option = document.createElement('option');
                option.value = voice.name;
                option.textContent = voice.name;
                voiceSelect.appendChild(option);
            }
        }
    }

    // Initialize voices
    populateVoiceList('en');
} else {
    alert('Your browser does not support the Speech Synthesis API.');
}
