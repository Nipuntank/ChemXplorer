
# 🧪 Chemical Compounds Management System – Backend

A backend system for managing chemical compounds, built using **Node.js**, **Express**, and **MySQL**. It provides RESTful APIs to create, read, update, and manage compound data.

---

## 📋 Prerequisites

Make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** (comes with Node.js)
- **MySQL** (v8 or higher)

---

## ⚙️ Installation Steps

### 1. Clone the Repository

```bash
git clone <repository-url>
cd compound-management-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Setup

- Create a MySQL database (default name: `chemical_compounds`):

```sql
CREATE DATABASE chemical_compounds;
```

---

## 🌐 Update Database Configuration

Create a `.env` file in the root directory of your project and add the following content:

```env
# .env
DB_USER="your_username"
DB_PASSWORD="your_password"
DB_NAME=chemical_compounds
DB_HOST=localhost
PORT=3000
```

> ⚠️ **Important**: Ensure your `.env` file is added to `.gitignore` to prevent accidental exposure of credentials.

---

## 📥 Import Initial Data

### Option 1: Using CSV

- Place a `compounds.csv` file in the project root.
- Run the import script:

```bash
node scripts/importData.js
```

### Option 2: Using Sample Data

- Modify `scripts/importData.js` to include hardcoded sample data.
- Run the script:

```bash
node scripts/importData.js
```

---

## 🚀 Start the Server

```bash
npm run dev
```

> The server will run at: `http://localhost:3000/api/compounds`

---

## 🌍 Environment Configuration

| Variable       | Default              | Description                |
|----------------|----------------------|----------------------------|
| `PORT`         | `3000`               | Server port                |
| `DB_HOST`      | `localhost`          | MySQL host                 |
| `DB_USER`      | `root`               | MySQL username             |
| `DB_PASSWORD`  | *(your password)*    | MySQL password             |
| `DB_NAME`      | `chemical_compounds` | Database name              |

---

## 🛠 Maintenance

### 🔄 Reset the Database

```bash
node scripts/importData.js
```

> This drops and recreates the `Compounds` table and imports the data.

---

## 📂 Project Structure

```bash
compound-management-backend/
├── config/
│   └── database.js
├── models/
│   └── Compound.js
├── routes/
│   └── compounds.js
├── scripts/
│   └── importData.js
├── .env
├── server.js
├── package.json
```

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

## 🤝 Contributions

Feel free to fork this repository and submit a pull request. Feedback and contributions are welcome!
