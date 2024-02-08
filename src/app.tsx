import logo from "./assets/logo-nlw-expert.svg";
import { NewNoteCard } from "./components/new-note-card";
import { NoteCard } from "./components/note-card";
import { ChangeEvent, useState } from "react";

interface Note {
  id: string;
  date: Date;
  content: string;
}

export function App() {
  const [search, setSearch] = useState("");

  const [notes, setNotes] = useState<Note[]>(() => {
    const notesOnStorage = localStorage.getItem("@expert-notes:note-list");

    if (notesOnStorage) {
      return JSON.parse(notesOnStorage);
    }

    return [];
  });

  function onNoteCreated(content: string) {
    const newNote = {
      id: crypto.randomUUID(),
      date: new Date(),
      content: content,
    };

    const notesArray = [newNote, ...notes];

    setNotes(notesArray);

    localStorage.setItem("@expert-notes:note-list", JSON.stringify(notesArray));
  }

  function handleSearch(event: ChangeEvent<HTMLInputElement>) {
    const query = event.target.value;

    setSearch(query);
  }

  function onNoteDeleted(id: string) {
    const filteredNotes = notes.filter((note) => note.id !== id);

    setNotes(filteredNotes);
    localStorage.setItem(
      "@expert-notes:note-list",
      JSON.stringify(filteredNotes)
    );
  }

  const filteredNotes =
    search !== ""
      ? notes.filter((note) =>
          note.content.toLocaleLowerCase().includes(search.toLocaleLowerCase())
        )
      : notes;

  return (
    <div className="mx-auto max-w-6xl my-12 space-y-6 px-5 md:px-0">
      <img src={logo} alt="Logo Nlw Expert" />
      <form className="w-full">
        <input
          onChange={handleSearch}
          type="text"
          placeholder="Busque em suas notas..."
          className="w-full bg-transparent text-3xl font-semibold tracking-tight placeholder:text-slate-500 outline-none"
        />
      </form>

      <div className="h-px bg-slate-700"></div>

      <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 auto-rows-[250px] gap-6">
        <NewNoteCard onNoteCreated={onNoteCreated} />

        {notes &&
          filteredNotes.map((note) => (
            <NoteCard key={note.id} onNoteDeleted={onNoteDeleted} note={note} />
          ))}
      </div>
    </div>
  );
}
