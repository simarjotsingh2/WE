
import React from 'react'

export default function Features(){
  const items = [
    { title:'Career Accelerator', desc:'Resume clinics, mock interviews, and job boards.'},
    { title:'Scholarships & Grants', desc:'Curated funding opportunities and application tips.'},
    { title:'Mental Wellness', desc:'Peer support groups and access to resources.'},
    { title:'Safety & Rights', desc:'Know your rights with simple explainers and helplines.'}
  ]
  return (
    <section id="resources" className="section">
      <div className="container">
        <h2>What You’ll Find Inside</h2>
        <p className="subhead">Everything you need in one place—organized, practical, and free.</p>
        <div className="grid-2" style={{marginTop:18}}>
          {items.map((it, i)=>(
            <div className="feature" key={i}>
              <h3>{it.title}</h3>
              <p className="subhead">{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
