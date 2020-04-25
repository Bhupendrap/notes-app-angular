import { Component, ChangeDetectorRef, OnInit, AfterViewChecked, ElementRef } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { NoteService } from './note.service';
import { Note } from './note';
import * as MarkdownIt from 'markdown-it';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewChecked, OnInit {
  title = 'notes-app';
  newNote: Note = new Note();
  notes = [];
  noteForm: FormGroup;
  editNoteForm: FormGroup;
  previewTitle: string;
  previewContent: string;
  showOverlay = false;
  showDeleteModal = false;
  noteToDelete = {};
  noteToEdit = {editing: false};
  today: number = Date.now();
  md = new MarkdownIt();

constructor(private noteService: NoteService, private fb: FormBuilder,
            private elementRef: ElementRef, private cdr: ChangeDetectorRef) {
  this.createForm();
  setInterval(() => {this.today = Date.now()}, 1);
}

ngAfterViewChecked() {
  this.cdr.detectChanges();
}

createForm() {
  this.noteForm = this.fb.group({'title': '', 'content': ''});
  this.previewTitle = '';
  this.previewContent = '';
  this.subscribeChanges();
}

getNotes() {
  this.notes = this.noteService.notes;
}

addNote(note) {
  this.newNote = note;
  this.noteService.addNote(this.newNote);
  this.newNote = new Note();
}

editNote(note) {
  this.editNoteForm = this.fb.group({'title': note.title, 'content': note.content});
  this.showOverlay = true;
  note.editing = true;
  this.noteToEdit = note;
  // Set focus to current note form textarea
  setTimeout(() => {
    this.elementRef.nativeElement.querySelector('#content').focus();
  }, 0);

}

removeNote(note) {
  console.log(this.noteForm.controls);
  this.noteForm.controls['title'].setValue('');
  this.noteForm.controls['content'].setValue('');
  this.noteToDelete = {};
  this.getNotes();
}

subscribeChanges() {
  this.noteForm.controls['title'].valueChanges.subscribe(value => {
    this.previewTitle = value;
  });
  this.noteForm.controls['content'].valueChanges.subscribe(value => {
    this.previewContent = this.parseMarkdown(value);
  });
}

parseMarkdown(content) {
  return this.md.render(content);
}

ngOnInit() {
  this.getNotes();
  this.subscribeChanges();
}

onSubmit(value: any): void {
  this.addNote(value);
  // this.createForm();
}

}
