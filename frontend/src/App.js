import React, { useState, useEffect } from 'react';
import './styles/global.css'
import './styles/App.css'
import './styles/SideBar.css'
import './styles/Main.css'

import api from './services/api.js'
import DevItem from './components/DevItems/'
import DevForm from './components/DevForm'

//Componente => bloco isolado de HTML, CSS e JS, o qual não interfere no restante da explicação
//Estado => informação que o componente vai mudar, mantidas pelo componente(lembrar: imutabilidade)
//Propriedade => informações que um componente(Parent) passa para os componentes(Children)

//const key = "KEY1_KEY1_KFJAKFJAL"

function App(){
  const [devs, setDevs] = useState([])

  useEffect(() => { 
    const getDevs = async () => {
      const response = await api.get('/devs')

      setDevs(response.data)
    }
    getDevs()
  }, [devs])

  useEffect(() => {
    async function loadDevs() {
      const response = await api.get('/devs')
      setDevs(response.data)
    }

    loadDevs()
  }, [])

  async function handleDelete(github_username) {
    await api.delete(`/devs/${github_username}`)

    setDevs(1)
  }

  async function handleAddDev(data) {
    const response = await api.post('/devs', data)

    setDevs(elements => [...elements, response.data] )
  }

  return (
    <div id="app">
      <aside>
        <h1><strong>Register</strong></h1>
        <DevForm onSubmit={handleAddDev}/>
      </aside>
      <main>
        <ul>
          {devs.map(dev => ( 
            <DevItem key={dev._id} handleDelete={handleDelete} dev={dev}/>
          ))}
        </ul>
      </main>
    </div>
  )
}

export default App;
