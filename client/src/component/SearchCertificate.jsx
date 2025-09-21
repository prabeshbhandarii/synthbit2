import axios from 'axios'
import React, { useState } from 'react'

const SearchCertificate = () => {
    const [code, setCode] = useState('')
    const handleSubmit = async (e)=>{
        try {
            const response = await axios.get('http://localhost:8000/certificate', code)
            console.log(response)
        } catch (error) {
            console.log(error)
        }
    }
  return (
    <div>
        <label htmlFor="certificateCode">Enter certificate code</label>
        <input type="text" name="certificateCode" value={code} onChange={(e)=>{setCode(e.target.value)}} required />
        <button type="submit" onSubmit={handleSubmit}>submit</button>
    </div>
  )
}

export default SearchCertificate
