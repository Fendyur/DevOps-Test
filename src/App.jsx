import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient.js'
import { validateTitle } from './validateTitle.js'

export default function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })
    const { data } = supabase.auth.onAuthStateChange((_event, s) => setSession(s))
    return () => data.subscription.unsubscribe()
  }, [])

  return (
    <main style={{ maxWidth: 480, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h1>Task Tracker</h1>
      {loading ? <p>Loading…</p> : session ? <Tasks session={session} /> : <Auth />}
    </main>
  )
}

function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  async function signUp() {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin },
    })
    if (error) setMessage(error.message)
    else if (!data.session) setMessage('Check your email to confirm your account, then log in.')
  }

  async function logIn(e) {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setMessage(error.message)
  }

  return (
    <form onSubmit={logIn}>
      <p>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </p>
      <p>
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
      </p>
      <button type="submit">Log in</button> <button type="button" onClick={signUp}>Register</button>
      {message && <p role="alert">{message}</p>}
    </form>
  )
}

function Tasks({ session }) {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')
  const [error, setError] = useState('')

  async function load() {
    const { data, error } = await supabase.from('tasks').select('*').order('created_at')
    if (error) setError(error.message)
    else setTasks(data)
  }

  useEffect(() => {
    load()
  }, [])

  async function addTask(e) {
    e.preventDefault()
    const invalid = validateTitle(title)
    if (invalid) return setError(invalid)
    const { error } = await supabase.from('tasks').insert({ title: title.trim() })
    if (error) return setError(error.message)
    setTitle('')
    setError('')
    load()
  }

  async function toggle(task) {
    const { error } = await supabase.from('tasks').update({ completed: !task.completed }).eq('id', task.id)
    if (error) setError(error.message)
    else load()
  }

  async function remove(task) {
    const { error } = await supabase.from('tasks').delete().eq('id', task.id)
    if (error) setError(error.message)
    else load()
  }

  return (
    <>
      <p>
        Signed in as {session.user.email} <button onClick={() => supabase.auth.signOut()}>Log out</button>
      </p>
      <form onSubmit={addTask}>
        <input placeholder="New task" value={title} onChange={(e) => setTitle(e.target.value)} />{' '}
        <button type="submit">Add</button>
      </form>
      {error && <p role="alert">{error}</p>}
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <label>
              <input type="checkbox" checked={task.completed} onChange={() => toggle(task)} />{' '}
              <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>{task.title}</span>
            </label>{' '}
            <button onClick={() => remove(task)}>Delete</button>
          </li>
        ))}
      </ul>
    </>
  )
}
