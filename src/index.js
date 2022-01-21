import ReactDOM from 'react-dom'
import App from './App'
import './index.css'
import { BrowserRouter as Router } from 'react-router-dom'

ReactDOM.render(<Router>
  <App />
</Router>, document.getElementById('root'))

// function App() {
//   return (<div>
//     i am 
//     <span>Lee</span>
//   </div>)
// }

// ReactDOM.render(<App/>, document.getElementById('root'))