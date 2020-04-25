import {Injectable} from '@angular/core';
import {Note} from './note';

@Injectable()
export class NoteService {

  // Placeholder for last id so we can simulate
  // automatic incrementing of id's
  lastId: number = 0;

  // Placeholder for notes
  notes: Note[] = [];

  constructor() {
    if (!localStorage.getItem('notes')) {
      localStorage.setItem('notes', JSON.stringify([]));
    }
  }

  // Simulate POST /notes
  addNote(note: Note): NoteService {
    if (this.notes.length) {
      this.lastId = this.notes[this.notes.length - 1].id;
    }
    if (!note.id) {
      note.id = ++this.lastId;
    }
    this.notes.push(note);
    localStorage.setItem('notes', JSON.stringify(this.notes));
    return this;
  }

}
