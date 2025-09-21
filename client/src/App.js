import { useState, useEffect } from "react";
import axios from 'axios'
import SearchCertificate from "./component/SearchCertificate";


function App() {
  const [info, setInfo] = useState({
    'name': '',
    'courseName': '',
    'courseStartDate': '',
    'courseCompletionDate': ''
  })
  const [downloadUrl, setDownloadUrl] = useState('')
  const [certificateCode, setCertificateCode] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setInfo(prev => ({
      ...prev, 
      [name]: [value]
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
   try {
    const res = await axios.post('http://localhost:8000/certificate', info);
    console.log(res.data)
    setDownloadUrl(res.data.downloadUrl)
    setCertificateCode(res.data.code)
   } catch (error) {
    console.log(error)
   } 
  }
  return (
    <div>
      <form id="certificateForm" onSubmit={handleSubmit}>
        <label htmlFor="name">Full Name</label>
        <input type="text" name="name" required value={info.name} onChange={handleChange}  />

        <label htmlFor="courseName">Course Name</label>
        <input type="text" name="courseName" value={info.courseName} onChange={handleChange} required />

        <label htmlFor="courseStartDate">Course Start Date</label>
        <input type="date" name="courseStartDate" value={info.courseStartDate} onChange={handleChange} required />

        <label htmlFor="courseCompletionDate">Course Completion Date</label>
        <input type="date" name="courseCompletionDate" value={info.courseCompletionDate} onChange={handleChange} required />

        <button type="submit">Generate Certificate</button>

        <div className="response">
          {
            downloadUrl ? <a href={downloadUrl}>download</a> : ''
          }
        </div>

        <h2>{certificateCode ? `Here is your certificate code. Keep it safe: ${certificateCode}` : ''}</h2>
        {
          certificateCode ? (
            <>
              <h1>search your certificate</h1>
        <label htmlFor="certificateCode">Enter certificate code</label>
        <SearchCertificate />
            </>
          ): ''
        }
      </form>
    </div>
  );
}

export default App;
