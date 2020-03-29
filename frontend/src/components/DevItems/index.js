import React from 'react'
import './style.css'

export default function Index({ dev, handleDelete }) {
  return (
    <li className="dev-item">
      <header>
        <img src={dev.avatar_url} alt={dev.github_username}/>
        <div className="user-info">
          <strong>{dev.name}</strong>
          <span>{dev.techs.join(', ')}</span>
        </div>
      </header>
      <p>
        {dev.bio}
      </p>
      <a href={`https://github.com/${dev.github_username}`}>View this profile</a>
      &emsp;&emsp;&emsp;
      <button onClick={() => handleDelete(dev.github_username)}>Delete this user</button>
    </li>
  )
}
