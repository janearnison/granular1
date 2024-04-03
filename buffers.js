let buffer1,
  buffer2,
  buffer3,
  buffer4,
  buffer5,
  buffer6,
  buffer7,
  buffer8,
  buffer9;

  buffer1 = new Tone.ToneAudioBuffer("samples/loop1.wav", () => {
    console.log('buffer loaded')
  })
  buffer2 = new Tone.ToneAudioBuffer("samples/loop2.wav");
  buffer3 = new Tone.ToneAudioBuffer("samples/loop3.wav");
  buffer4 = new Tone.ToneAudioBuffer("samples/loop4.mp3");
  buffer5 = new Tone.ToneAudioBuffer("samples/loop5.mp3");
  buffer6 = new Tone.ToneAudioBuffer(
    "samples/midtown120.mp3"
  );
  buffer7 = new Tone.ToneAudioBuffer("samples/storms_never_last.mp3");
  buffer8 = new Tone.ToneAudioBuffer("samples/Beat_2.mp3");
  buffer9 = new Tone.ToneAudioBuffer("samples/eavesdropper.mp3");
