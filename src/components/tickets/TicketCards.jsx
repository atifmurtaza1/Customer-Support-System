import React from 'react'

const TicketCards = (props) => {
  return (

    <div className="rounded-lg border bg-white p-4">
         <h2 className="font-bold">{props.title}</h2>
      <p className="text-sm text-slate-500">
        Status: {props.status}
      </p>
    </div>
)
}

export default TicketCards