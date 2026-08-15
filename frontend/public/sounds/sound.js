import sound from './pup.mp3';


const playSound = () => {
    const audio = new Audio(sound);
    audio.play();
};

export default playSound;