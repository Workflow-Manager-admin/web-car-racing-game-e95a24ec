import { Howl } from 'howler';

export const SOUNDS = {
  engine: new Howl({
    src: ['https://assets.mixkit.co/active_storage/sfx/2631/2631-preview.mp3'],
    loop: true,
    volume: 0.5
  }),
  crash: new Howl({
    src: ['https://assets.mixkit.co/active_storage/sfx/2620/2620-preview.mp3'],
    volume: 0.6
  }),
  score: new Howl({
    src: ['https://assets.mixkit.co/active_storage/sfx/2701/2701-preview.mp3'],
    volume: 0.7
  })
};
