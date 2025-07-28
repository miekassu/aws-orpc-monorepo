import typescriptLogo from '/typescript.svg'
import { Header, Counter } from '@repo/ui'
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
      <Header title="Web" />
      <div className="card">
        <button onClick={() => refetch()}>HEY</button>
      </div>
      <div className="card">
        <Counter />
      </div>
    </div>
  )
}

export default App
