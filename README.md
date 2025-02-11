# 📚 Your Library

Your Library is a minimalistic mobile-friendly web application that allows users to log in, scan book barcodes, fetch book details online, and manage their personal library. Users can track their reading progress, update their profile, and filter books based on status.

---

## 🚀 Features

### 🔍 Book Management
- Scan book barcodes via the camera or upload a book cover image.
- Fetch book details from Google Books API & Open Library API.
- Store books in a personal library with reading status.
- Delete books from the library.

### 📖 Reading Progress
- Users can mark books as **Not Started, In Progress, or Completed**.
- Filter books based on reading status.

### 👤 Profile Management
- Select an **emoji-based avatar** (horizontally scrollable).
- Edit **username, favorite genre, and bio**.
- View personal reading stats (Books Read, In Progress, Wishlist).
- **Logout instantly** from the profile page.

### 🏆 User Experience
- Mobile-friendly and **minimalistic UI** optimized for book readers.
- **Dark and light theme support** (future update).
- Smooth **animations and transitions** for seamless interaction.

---

## 🛠️ Tech Stack

- **Frontend:** React (with Tailwind CSS)
- **Backend:** Supabase (PostgreSQL, Authentication, Database)
- **APIs:** Google Books API, Open Library API

---

## 🔧 Installation & Setup

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/yourusername/yourlibrary.git
cd yourlibrary
```

### 2️⃣ Install Dependencies
```sh
npm install
```

### 3️⃣ Set Up Environment Variables
Create a `.env` file in the root directory and add the following:
```env
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4️⃣ Start the Development Server
```sh
npm start
```

The app will run on `http://localhost:3000/`

---

## 🏗️ Database Schema (Supabase)

### 📄 `books` Table
| Column      | Type      | Description                        |
|------------|----------|------------------------------------|
| id         | UUID     | Primary key                        |
| user_id    | UUID     | Foreign key (references `auth.users`) |
| title      | TEXT     | Book title                         |
| author     | TEXT     | Book author                        |
| isbn       | TEXT     | ISBN identifier                    |
| image_url  | TEXT     | Book cover image URL               |
| status     | TEXT     | `not_started` / `in_progress` / `completed` |
| created_at | TIMESTAMPTZ | Timestamp                         |

### 📄 `profiles` Table
| Column        | Type      | Description                     |
|--------------|----------|---------------------------------|
| id           | UUID     | Primary key (references `auth.users`) |
| username     | TEXT     | Display name                    |
| avatar       | TEXT     | Selected emoji avatar           |
| favorite_genre | TEXT     | Favorite book genre             |
| bio          | TEXT     | Short user bio                  |
| created_at   | TIMESTAMPTZ | Timestamp                      |

---

## 🛠️ Roadmap
- [ ] 🔄 Implement dark mode
- [ ] 📖 Add book recommendations
- [ ] 🎨 UI refinements based on user feedback

---

## 🤝 Contribution
Feel free to fork this repository and submit a pull request with improvements. 🚀

---