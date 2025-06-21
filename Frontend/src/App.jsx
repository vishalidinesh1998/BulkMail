import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import axios from 'axios'
import './App.css'
import * as XLSX from 'xlsx'

function App() {

  const [msg, setmsg] = useState("")
  const [status, setstatus] = useState(false)
  const [emaillist, setemaillist] = useState([])

  function handlemessage(evt) {
    setmsg(evt.target.value)

  }

  function handlefile(evt) {
    const file = evt.target.files[0]; // ✅ fixed from event.target

    const reader = new FileReader();

    reader.onload = function (event) {
      const data = event.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName]; // ✅ fixed from SheetName
      const emaillist = XLSX.utils.sheet_to_json(worksheet, { header: 'A' });
      const totalemail = emaillist.map(function (item) {
        return (item.A)
      })
      setemaillist(totalemail)
    };

    reader.readAsBinaryString(file);
  }


  function send() {
    setstatus(true)
    axios.post("https://bulkmail-1-zbw5.onrender.com/sendmail", { msg: msg, emaillist: emaillist })
      .then(function (data) {
        if (data.data === true) {
          alert("Email Send Successfully")
          setstatus(false)
        }
        else {
          alert("Failed to Send")
        }
      })
  }

  return (
    <div>
      <div className="p-2 bg-blue-950 text-2xl text-white font-bold text-center">
        <h1>Bulk Mail</h1>
      </div>
      <div className="p-2 bg-blue-900 text-xl text-white font-semibold text-center">
        <h1>We can help your business with sending multiple emails at once</h1>
      </div>
      <div className="p-2 bg-blue-800 text-xl text-white font-semibold text-center">
        <h1>Drag and Drop</h1>
      </div>
      <div className="p-4 bg-blue-600   text-center">
        <textarea onChange={handlemessage} value={msg} className='border-black rounded w-80 h-32' placeholder='Enter the email text.....'></textarea>
      </div>
      <div className="p-2 bg-blue-500   text-center ">
        <input onChange={handlefile} type="file" className='border-4 border-dashed  p-4 mt-5 mb-5'></input>
      </div>
      <div className="p-2 bg-blue-300    text-center ">
        <p>Total Email in the file:{emaillist.length}</p>
      </div>

      <div className="p-2 bg-blue-200    text-center ">
        <button onClick={send} className='bg-blue-950 text-white p-2 rounded'>{status ? "Sending..." : "Send"}</button>
      </div>
    </div>
  )
}

export default App
