import React from 'react';

export function TareaDia({ tareas, handleActuarDia }) {
  return (
    <div className="card precios">
      <div className="card-body">
        <h5 className="card-title"> {tareas.length} Tareas</h5>
        <h6 className="card-subtitle mb-2 text-muted">
          Estas son tus tareas de hoy:
        </h6>
        <ul>
          {tareas.map((tarea, i) => {
            return (
              <li key={i}>
                <button
                  className="btn btn-link"
                  type="button"
                  id={i}
                  onClick={handleActuarDia}
                >
                  {tarea.nombreNegocio}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
