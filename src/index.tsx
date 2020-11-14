import React from 'react'
import {BrowserRouter} from 'react-router-dom'
import ReactDOM from 'react-dom'
import App from './app'
import * as serviceWorker from './serviceWorkerRegistration'
import {toast} from "react-toastify"

import 'react-toastify/dist/ReactToastify.css'

ReactDOM.render(<BrowserRouter><App /></BrowserRouter>, document.getElementById('app'))
serviceWorker.register(undefined, toast)
