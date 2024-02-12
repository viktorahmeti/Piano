//Map notes to their MIDI numbers
let noteToMidiMap = new Map();
noteToMidiMap.set('C', -24);
noteToMidiMap.set('C#', -25);
noteToMidiMap.set('D', -26);
noteToMidiMap.set('D#', -27);
noteToMidiMap.set('E', -28);
noteToMidiMap.set('F', -29);
noteToMidiMap.set('F#', -30);
noteToMidiMap.set('G', -31);
noteToMidiMap.set('G#', -32);
noteToMidiMap.set('A', -33);
noteToMidiMap.set('A#', -34);
noteToMidiMap.set('B', -35);

//Map keyCodes to notes
let keyboardToNoteMap = new Map()
keyboardToNoteMap.set(97, {note: 'C'});   // 'a'
keyboardToNoteMap.set(119, {note: 'C#'});  // 'w'
keyboardToNoteMap.set(115, {note: 'D'});   // 's'
keyboardToNoteMap.set(101, {note: 'D#'});  // 'e'
keyboardToNoteMap.set(100, {note: 'E'});   // 'd'
keyboardToNoteMap.set(102, {note: 'F'});   // 'f'
keyboardToNoteMap.set(116, {note: 'F#'});  // 't'
keyboardToNoteMap.set(103, {note: 'G'});   // 'g'
keyboardToNoteMap.set(121, {note: 'G#'});  // 'y'
keyboardToNoteMap.set(104, {note: 'A'});   // 'h'
keyboardToNoteMap.set(117, {note: 'A#'});  // 'u'
keyboardToNoteMap.set(106, {note: 'B'});   // 'j'
keyboardToNoteMap.set(107, {note: 'C', octaveOffset: 1});  // 'k'
keyboardToNoteMap.set(111, {note: 'C#', octaveOffset: 1}); // 'o'
keyboardToNoteMap.set(108, {note: 'D', octaveOffset: 1});  // 'l'
keyboardToNoteMap.set(112, {note: 'D#', octaveOffset: 1}); // 'p'
keyboardToNoteMap.set(59, {note: 'E', octaveOffset: 1});  // ';'

let piano = document.getElementById('piano');
let octaveInput = document.getElementById('octave');
        
var inst = new Instrument();
inst.setTimbre({wave:"piano", release: 0.1, decay: 0.1, sustain: 0});

piano.addEventListener('mousedown', (event) => {
    onPress(event);
});

piano.addEventListener('touchstart', (event) => {
    event.preventDefault();
    onPress(event, 'touchend');
});

function onPress(event, finishEvent = 'mouseup'){
    //get data
    let element = event.target;
    let note = element.dataset.note;
    let octaveOffset = parseInt(element.dataset.octaveOffset || 0);

    //add effect
    element.classList.add('clicked');
    document.addEventListener(finishEvent, () => element.classList.remove('clicked'), {once: true});

    //play note
    playNote(note, octaveOffset);
}

document.addEventListener('keypress', (event) => {
    //if it's held down return
    if (event.repeat) return;

    let character = event.keyCode;
    if(!keyboardToNoteMap.get(character))
        return;

    let note = keyboardToNoteMap.get(character).note;
    let octaveOffset = keyboardToNoteMap.get(character).octaveOffset || 0;

    if(!note)
        return;

    let selector = `[data-note='${note}']`;
    if(octaveOffset)
        selector += `[data-octave-offset='${octaveOffset}']`;

    let element = document.querySelector(selector);
    element.classList.add('clicked');
    document.addEventListener('keyup', () => element.classList.remove('clicked'), {once: true});

    playNote(note, octaveOffset);
})

function playNote(note, octaveOffset = 0){
    let midi = noteToMidi(note) - (octaveInput.value - 1 + octaveOffset) * 12;
    inst.tone(midi);
}

function noteToMidi(note){
    return noteToMidiMap.get(note);
}

function isInNextOctave(element){
    if(element.classList.contains('black-key'))
        element = element.parentElement;
    return element.nextElementSibling == null;
}