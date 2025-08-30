import React, { useEffect, useState } from 'react'
import { FaTrash } from "react-icons/fa"
import { FaBars } from "react-icons/fa"
import { FaTimes } from "react-icons/fa";
import '../IncExp.css'
import 'react-date-picker/dist/DatePicker.css'
import 'react-calendar/dist/Calendar.css'
import DatePicker from 'react-date-picker'

function IncExp() {
  const [balance, setBalance] = useState(0)
  const [text, setText] = useState("")
  const [money, setMoney] = useState("")
  const [date, setDate] = useState("")
  const [history, setHistory] = useState(() => {
    return JSON.parse(localStorage.getItem('history')) || []
  })
  const [negative, setNegative] = useState(0)
  const [positive, setPositive] = useState(0)
  const [dark, setDark] = useState(() => {
    return JSON.parse(localStorage.getItem('dark')) || false
  })
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    setBalance(history.reduce((acc, curr) => {
      return acc + curr.money
    }, 0))

    let ng = 0
    let pos = 0

    for (const obj of history) {
      if (obj.money < 0) {
        ng += obj.money
      }
      else {
        pos += obj.money
      }
    }

    setNegative(ng)
    setPositive(pos)

    localStorage.setItem('history', JSON.stringify(history))
  }, [history])

  useEffect(() => {
    if (dark) {
      document.body.classList.add("dark")
    }
    else {
      document.body.classList.remove("dark")
    }

    localStorage.setItem('dark', JSON.stringify(dark))
  }, [dark])

  useEffect(() => {
    if (showSettings) {
      document.querySelector(".container").classList.add("blur")
    }
    else {
      document.querySelector(".container").classList.remove("blur")
    }
  }, [showSettings])

  const handleDelete = (id) => {
    let upHistory = history.filter((element) => {
      return element.id != id
    })

    setHistory(upHistory)
  }

  const handleSubmit = () => {
    if (money == 0 || money.trim() === "" || text.trim() === "" || date === "") {
      alert("Enter all details properly!")
      return
    }

    const now = new Date()
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    const formattedDate = date.toLocaleDateString('en-GB')

    const trn =
    {
      id: Date.now(),
      text: text.trim(),
      money: Number(money),
      date: formattedDate,
      time: time
    }

    setHistory([trn, ...history])
    setText("")
    setMoney("")
    setDate("")
  }

  const handleExport = () => {
    const data = JSON.stringify(history, null, 2)
    const blob = new Blob([data], { type: "text/plain" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = "history.txt"
    a.click()

    URL.revokeObjectURL(url)
  }

  const handleImport = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const importedHistory = JSON.parse(event.target.result)
        if (Array.isArray(importedHistory)) {
          setHistory(importedHistory)
        } else {
          alert("Invalid file format!")
        }
      } catch (err) {
        alert("Error reading file!")
      }
    }

    reader.readAsText(file)
  }

  return (
    <>
      <div className="header">
        <h2 className='heading-header'>Expense Tracker</h2>

        <button className="hamburger-btn" onClick={() => setShowSettings(!showSettings)} >
          {showSettings ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {showSettings ? (
        <div className="options">
          <h3 className='heading'>Settings</h3>
          <button className='dark-btn' onClick={() => setDark(!dark)}>
            {dark ? "Light Mode" : "Dark Mode"}
          </button>
          <button onClick={handleExport}>Export History</button>
          <label className="import-btn">Import History
            <input type="file" accept=".txt" onChange={handleImport} style={{ display: 'none' }} />
          </label>
        </div>
      ) : null}

      <div className='container'>
        <div className="balance-container">
          <h3>Balance</h3>
          <h1>₹ {balance}</h1>
        </div>

        <div className="income-expense-container">
          <div className="income">
            <h3>Income</h3>
            <h1>₹ {positive}</h1>
          </div>

          <div className="expense">
            <h3>Expense</h3>
            <h1>₹ {negative}</h1>
          </div>
        </div>


        <h3 className='heading'>History</h3>
        <ul className='history'>
          {history.map((e) => {
            return <li
              className={e.money < 0 ? 'expense-item' : 'income-item'}
              key={e.id}>
              <div className="history-div">
                <p>{e.text} : ₹ {e.money}</p>
                <p className='para'>{e.date} | {e.time}</p>
              </div>
              <button className='dlt-btn' onClick={() => handleDelete(e.id)}><FaTrash /></button>
            </li>
          })}
        </ul>

        <h3 className='heading'>New Transaction</h3>
        <div className="new-transaction">
          <input placeholder='Enter description...' type="text" value={text} onChange={(e) => { setText(e.target.value) }} />
          <input placeholder='Enter amount (use - for expense)' type="number" value={money} onChange={(e) => { setMoney(e.target.value) }} />
          <DatePicker
            onChange={(newDate) => setDate(newDate)}
            value={date}
            format="dd/MM/yyyy"
            clearIcon={null}
            calendarIcon={null}
            dayPlaceholder="dd"
            monthPlaceholder="mm"
            yearPlaceholder="yyyy"
          />
          <button className='add-btn' type="submit" onClick={handleSubmit}>Add Transaction</button>
        </div>

      </div>
    </>
  )
}

export default IncExp