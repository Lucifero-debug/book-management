"use client";
import { useState, useEffect } from "react";
import axios from 'axios'
import { useRouter } from "next/navigation";

export default function HomeLibrary() {
  const [activeSection, setActiveSection] = useState("home");

  const [formData, setFormData] = useState({
    bookName: "",
    author: "",
    publication: "",
    price: "",
    bookId:""
  });

  const [issuedBooks, setIssuedBooks] = useState([]);
  const [issueForm, setIssueForm] = useState({
    name: "",
    bookName: "",
    mobile: "",
    issueDate: "",
  });
  const [showIssueForm, setShowIssueForm] = useState(false);

  const [message, setMessage] = useState("");
  const [books, setBooks] = useState([]);
  const router=useRouter()

  useEffect(() => {
    const fetchBooks = async () => {
        try {
            const response = await axios.get("/api/books/all-books");
            const data=await response.data;
            setBooks(data.books); // Assuming API returns { books: [...] }
        } catch (err) {
          console.error("Error fetching books:", err);
        } 
    };

    fetchBooks();
}, []);

useEffect(() => {
  const fetchIssueBooks = async () => {
      try {
          const response = await axios.get("/api/books/get-issue");
          const data=await response.data;
          setIssuedBooks(data.books); // Assuming API returns { books: [...] }
      } catch (err) {
        console.error("Error fetching issued books:", err);
      } 
  };

  fetchIssueBooks();
}, []);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    
    try {
      const res=await axios.post("/api/books/add-books",formData)

      setMessage('✅ Book added successfully!');
      setTimeout(() => setMessage(''), 3000);
    
      // Reset form fields
      setFormData({
        bookId: '',
        bookName: '',
        author: '',
        publication: '',
        price: '',
      });

    } catch (error) {
      console.error("Error adding books:", error);
    }
  
  };
  
  const handleIssueChange = (e) => {
    setIssueForm({ ...issueForm, [e.target.name]: e.target.value });
  };

  const handleIssueSubmit = async(e) => {
    e.preventDefault();
    
  try {
    const response=await axios.post('/api/books/issue-books',issueForm)
  } catch (error) {
    console.error("Error issuing books:", error);
  }
  };

  const handleLogout=async()=>{
    await axios.post('/api/users/logout')
    router.push('/login')
  }
  
  const handleReturnBook = async(book) => {
    console.log("book",book)
    // Removing the book locally
    const updatedIssuedBooks = await axios.post('/api/books/receive-books',book)
  };

  const handleDeleteBook = async(book) => {
    const deletebook=await axios.post('/api/books/delete-books',book)
  };
  
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* ✅ Navbar */}
      <header className="relative bg-gray-200 p-7 shadow-md flex justify-center items-center h-12">
        <span className="text-xl font-bold">
          {activeSection !== "home" ?
            activeSection.replace("_", " ").charAt(0).toUpperCase() + activeSection.replace("_", " ").slice(1)
            : <span className="opacity-0">Placeholder</span>}
        </span>

        <button
          className="absolute left-4 text-xl font-bold text-blue-600"
          onClick={() => setActiveSection("home")}
        >
          Hey! Shiv.
        </button>

        <button
          className="absolute right-4 text-lg font-semibold"
          onClick={handleLogout}
        >
          Logout
        </button>
      </header>

      {/* ✅ Navigation Buttons */}
      <div className="flex justify-center space-x-4 mt-2">
        <button
          className={`px-4 py-2 rounded ${activeSection === "all_books" ? "bg-blue-600 text-white" : "bg-black text-white"}`}
          onClick={() => setActiveSection("all_books")}
        >
          All Books
        </button>
        <button
          className={`px-4 py-2 rounded ${activeSection === "add_book" ? "bg-blue-600 text-white" : "bg-black text-white"}`}
          onClick={() => setActiveSection("add_book")}
        >
          Add Book
        </button>
        <button
          className={`px-4 py-2 rounded ${activeSection === "issued_book" ? "bg-blue-600 text-white" : "bg-black text-white"}`}
          onClick={() => setActiveSection("issued_book")}
        >
          Issued Book
        </button>
        <button
          className={`px-4 py-2 rounded ${activeSection === "receive_book" ? "bg-blue-600 text-white" : "bg-black text-white"}`}
          onClick={() => setActiveSection("receive_book")}
        >
          Receive Book
        </button>
      </div>

      {/* ✅ Main Canvas */}
      <div className="flex-1 flex items-center justify-center w-[1364px] h-[749px] bg-gray-100 shadow-lg rounded-lg mx-auto text-center p-10 mt-2">
        {activeSection === "issued_book" && (
          <div className="relative w-full h-full p-6">
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
              onClick={() => setShowIssueForm(true)}
            >
              Issue Book
            </button>

            <table className="w-full border border-gray-300 rounded-lg">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">Name</th>
                  <th className="border p-2">Book Name</th>
                  <th className="border p-2">Mobile No</th>
                  <th className="border p-2">Issue Date</th>
                </tr>
              </thead>
              <tbody>
                {issuedBooks.map((book, index) => (
                  <tr key={index}>
                    <td className="border p-2">{book.borrower}</td>
                    <td className="border p-2">{book.name}</td>
                    <td className="border p-2">{book.number}</td>
                    <td className="border p-2">
  {new Date(book.issueDate).toLocaleDateString('en-GB')} 
</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Issue Book Form Popup */}
            {showIssueForm && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
                <div className="bg-white p-6 shadow-lg rounded-lg w-[400px] max-h-[90vh] overflow-y-auto">
                  <h2 className="text-xl font-bold mb-4 text-center">Issue a Book</h2>
                  <form onSubmit={handleIssueSubmit} className="flex flex-col gap-4">
                    {Object.keys(issueForm).map((field, index) => (
                      <div key={index} className="flex flex-col">
                        <label className="font-semibold capitalize mb-1">{field.replace(/([A-Z])/g, " $1")}</label>
                        <input
                          type="text"
                          name={field}
                          value={issueForm[field]}
                          onChange={handleIssueChange}
                          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder={`Enter ${field}`}
                          required
                        />
                      </div>
                    ))}
                    <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg mt-2 hover:bg-blue-700 transition">
                      Submit
                    </button>
                  </form>
                  <button
                    className="mt-4 w-full bg-red-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-red-700"
                    onClick={() => setShowIssueForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 📚 Receive Book Section */}
        {activeSection === "receive_book" && (
          <div className="relative w-full h-full p-6">
            <h2 className="text-2xl font-bold mb-4 text-center">Receive Book</h2>

            <table className="w-full border border-gray-300 rounded-lg">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">Name</th>
                  <th className="border p-2">Book Name</th>
                  <th className="border p-2">Mobile No</th>
                  <th className="border p-2">Issue Date</th>
                  <th className="border p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {issuedBooks.length > 0 ? (
                  issuedBooks.map((book, index) => (
                    <tr key={index}>
                      <td className="border p-2">{book.borrower}</td>
                      <td className="border p-2">{book.name}</td>
                      <td className="border p-2">{book.number}</td>
                      <td className="border p-2">{book.issueDate}</td>
                      <td className="border p-2">
                        <button
                          className="bg-green-600 text-white px-4 py-1 rounded-md shadow hover:bg-green-700 transition-all"
                          onClick={() => handleReturnBook(book)}
                        >
                          ✅ Return Book
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center text-gray-500 p-4">
                      No issued books to return.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* 🏠 Home Page */}
        {activeSection === "home" && (
          <div>
            <h2 className="text-4xl">
              <span className="text-blue-600 font-bold">Hey!</span> Shiv.
            </h2>
            <h2 className="text-2xl mt-2">Welcome to Your</h2>
            <h2 className="text-blue-600 text-5xl font-bold mt-2">Home Library</h2>
          </div>
        )}

       {/* 📚 All Books Section */}
       {activeSection === "all_books" && (
  <div className="relative w-full h-full p-6">
    <table className="w-full border border-gray-300 rounded-lg">
      <thead>
        <tr className="bg-gray-200">
          <th className="border p-2">S.No.</th>
          <th className="border p-2">Book Id</th>
          <th className="border p-2">Book Name</th>
          <th className="border p-2">Author</th>
          <th className="border p-2">Publication</th>
          <th className="border p-2">Price</th>
          <th className="border p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {books.map((book, index) => (
          <tr key={book.bookId || index}> {/* Ensure a unique key */}
            <td className="border p-2">{index + 1}</td>
            <td className="border p-2">{book.bookId}</td>
            <td className="border p-2">{book.name}</td>
            <td className="border p-2">{book.author}</td>
            <td className="border p-2">{book.publication}</td>
            <td className="border p-2">{book.price}</td>
            <td className="border p-2 text-center">
              <button 
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
                onClick={() => handleDeleteBook(book)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}


        {/* 📖 Add Book Form Section */}
        {activeSection === "add_book" && (
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-4">Add Book</h2>

            {/* ✅ Success Message */}
            {message && <p className="text-green-600 font-semibold mb-4">{message}</p>}

            <form onSubmit={handleSubmit} className="w-[500px] flex flex-col gap-3">
              {["bookId","bookName", "author", "publication","price"].map((field, index) => (
                <div key={index} className="flex items-center">
                  <label className="w-32 font-semibold capitalize">{field.replace(/([A-Z])/g, " $1")} -</label>
                  <input
                    type="text"
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    className="flex-1 border p-2 rounded"
                    placeholder={`Enter ${field}`}
                    required
                  />
                </div>
              ))}

              {/* 🔘 Submit Button */}
              <button type="submit" className="bg-black text-white px-6 py-2 rounded mt-4">
                Submit
              </button>
            </form>
          </div>
        )}
      </div>

      {/* ✅ Footer */}
      <footer className="w-full text-center bg-white py-3 shadow-md text-lg mt-auto">
        Powered By <span className="text-blue-600">@PrashantDev</span>.
      </footer>
    </div>
  );
}