import typescriptLogo from '/typescript.svg'
import { useListPosts } from './api/useListPosts'

const App = () => {
  const { data, error, refetch } = useListPosts()
  if (error) {
    console.error('Error fetching posts:', error)
  }
  console.log('Posts:', data)

  return (
    <div>
      <a href="https://vitejs.dev" target="_blank">
        <img src="/vite.svg" className="logo" alt="Vite logo" />
      </a>
      <a href="https://www.typescriptlang.org/" target="_blank">
        <img
          src={typescriptLogo}
          className="logo vanilla"
          alt="TypeScript logo"
        />
      </a>
      <header id="header">
        <h1>oRPC</h1>
      </header>
      <div className="card">
        <button onClick={() => refetch()}>FETCH</button>
      </div>
      <div className="card">
        {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
      </div>
    </div>
  )
}

export default App
