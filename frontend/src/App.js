import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const API = "https://fullstack-notes-app-twis.onrender.com";

  // Fetch Notes
  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/notes`);
      setNotes(res.data);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // Add Note
  const addNote = async () => {
    if (!title || !description) {
      alert("Please enter title and description");
      return;
    }

    setLoading(true);
    await axios.post(`${API}/notes`, { title, description });
    setTitle("");
    setDescription("");
    fetchNotes();
  };

  // Delete Note
  const deleteNote = async (id) => {
    setLoading(true);
    await axios.delete(`${API}/notes/${id}`);
    fetchNotes();
  };

  // Update Note
  const updateNote = async (id) => {
    const newTitle = prompt("Enter new title");
    const newDesc = prompt("Enter new description");

    if (!newTitle || !newDesc) return;

    setLoading(true);
    await axios.put(`${API}/notes/${id}`, {
      title: newTitle,
      description: newDesc
    });
    fetchNotes();
  };

  // Search filter
  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>📝 Notes App</h1>

      {/* Search */}
      <input
        style={styles.search}
        placeholder="🔍 Search notes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Form */}
      <div style={styles.form}>
        <input
          style={styles.input}
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          style={styles.input}
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button style={styles.addBtn} onClick={addNote}>
          {loading ? "Adding..." : "Add Note"}
        </button>
      </div>

      {/* Loading */}
      {loading && <p style={{ textAlign: "center" }}>Loading...</p>}

      {/* Notes Grid */}
      <div style={styles.grid}>
        {filteredNotes.map(note => (
          <div key={note._id} style={styles.card}>
            <h3>{note.title}</h3>
            <p>{note.description}</p>
            <small>
              {new Date(note.createdAt).toLocaleString()}
            </small>

            <div style={styles.btnGroup}>
              <button
                style={styles.editBtn}
                onClick={() => updateNote(note._id)}
              >
                Edit
              </button>
              <button
                style={styles.deleteBtn}
                onClick={() => deleteNote(note._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 🎨 Styles (OUTSIDE App function)
const styles = {
  container: {
    padding: "20px",
    fontFamily: "Arial",
    background: "#f4f6f8",
    minHeight: "100vh"
  },
  heading: {
    textAlign: "center",
    color: "#333",
    marginBottom: "20px"
  },
  search: {
    width: "100%",
    padding: "10px",
    marginBottom: "20px",
    borderRadius: "8px",
    border: "1px solid #ccc"
  },
  form: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px"
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc"
  },
  addBtn: {
    background: "#4CAF50",
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: "8px",
    cursor: "pointer"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "15px"
  },
  card: {
    background: "white",
    padding: "15px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
  },
  btnGroup: {
    marginTop: "10px",
    display: "flex",
    justifyContent: "space-between"
  },
  editBtn: {
    background: "#2196F3",
    color: "white",
    border: "none",
    padding: "5px 10px",
    borderRadius: "6px",
    cursor: "pointer"
  },
  deleteBtn: {
    background: "#f44336",
    color: "white",
    border: "none",
    padding: "5px 10px",
    borderRadius: "6px",
    cursor: "pointer"
  }
};

export default App;