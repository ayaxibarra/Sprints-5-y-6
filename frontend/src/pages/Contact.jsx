import { useState } from 'react'
import estilos from './ContactForm.module.css'

const VALOR_INICIAL = {
  nombreCompleto: '',
  correoElectronico: '',
  asunto: '',
  mensaje: '',
}

const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validar(valores) {
  const errores = {}

  if (!valores.nombreCompleto.trim()) {
    errores.nombreCompleto = 'Ingresá tu nombre completo.'
  }

  const correo = valores.correoElectronico.trim()
  if (!correo) {
    errores.correoElectronico = 'Ingresá tu correo electrónico.'
  } else if (!EMAIL_VALIDO.test(correo)) {
    errores.correoElectronico = 'Ingresá un correo electrónico válido.'
  }

  if (!valores.asunto.trim()) {
    errores.asunto = 'Ingresá el asunto de tu consulta.'
  }

  if (!valores.mensaje.trim()) {
    errores.mensaje = 'Escribí tu mensaje o consulta.'
  }

  return errores
}

export default function ContactForm() {
  const [valores, setValores] = useState(VALOR_INICIAL)
  const [errores, setErrores] = useState({})
  const [enviado, setEnviado] = useState(false)

  function actualizarCampo(evento) {
    const { id, value } = evento.target
    setValores((actual) => ({ ...actual, [id]: value }))
    setErrores((actual) => {
      if (!actual[id]) return actual
      const siguientes = { ...actual }
      delete siguientes[id]
      return siguientes
    })
    setEnviado(false)
  }

  function manejarEnvio(evento) {
    evento.preventDefault()
    const siguientesErrores = validar(valores)

    if (Object.keys(siguientesErrores).length > 0) {
      setEnviado(false)
      setErrores(siguientesErrores)
      evento.currentTarget.elements.namedItem(Object.keys(siguientesErrores)[0])?.focus()
      return
    }

    setErrores({})
    setValores(VALOR_INICIAL)
    setEnviado(true)
  }

  return (
    <section id="contacto" className={estilos.seccion} aria-labelledby="contacto-titulo">
      <h1 id="contacto-titulo" className={estilos.titulo}>Escribinos</h1>
      <p className={estilos.bajada}>
        ¿Tenés una consulta sobre un mueble o un pedido especial? Este formulario educativo valida tus datos; no envía mensajes.
      </p>

      {enviado && (
        <p className={estilos.exito} role="alert" aria-live="polite">
          Formulario validado correctamente. No se envió ningún mensaje.
        </p>
      )}

      <form id="formulario-contacto" className={estilos.formulario} noValidate onSubmit={manejarEnvio}>
        <div className={estilos.campo}>
          <label className={estilos.etiqueta} htmlFor="nombreCompleto">Nombre completo</label>
          <input
            className={`${estilos.entrada} ${errores.nombreCompleto ? estilos.entradaInvalida : ''}`}
            type="text"
            id="nombreCompleto"
            name="nombreCompleto"
            autoComplete="name"
            required
            aria-required="true"
            aria-invalid={Boolean(errores.nombreCompleto)}
            aria-describedby={errores.nombreCompleto ? 'error-nombreCompleto' : undefined}
            value={valores.nombreCompleto}
            onChange={actualizarCampo}
          />
          {errores.nombreCompleto && (
            <p id="error-nombreCompleto" className={estilos.error} role="alert">
              {errores.nombreCompleto}
            </p>
          )}
        </div>

        <div className={estilos.campo}>
          <label className={estilos.etiqueta} htmlFor="correoElectronico">Correo electrónico</label>
          <input
            className={`${estilos.entrada} ${errores.correoElectronico ? estilos.entradaInvalida : ''}`}
            type="email"
            id="correoElectronico"
            name="correoElectronico"
            autoComplete="email"
            required
            aria-required="true"
            aria-invalid={Boolean(errores.correoElectronico)}
            aria-describedby={errores.correoElectronico ? 'error-correoElectronico' : undefined}
            value={valores.correoElectronico}
            onChange={actualizarCampo}
          />
          {errores.correoElectronico && (
            <p id="error-correoElectronico" className={estilos.error} role="alert">
              {errores.correoElectronico}
            </p>
          )}
        </div>

        <div className={estilos.campo}>
          <label className={estilos.etiqueta} htmlFor="asunto">Asunto</label>
          <input
            className={`${estilos.entrada} ${errores.asunto ? estilos.entradaInvalida : ''}`}
            type="text"
            id="asunto"
            name="asunto"
            required
            aria-required="true"
            aria-invalid={Boolean(errores.asunto)}
            aria-describedby={errores.asunto ? 'error-asunto' : undefined}
            value={valores.asunto}
            onChange={actualizarCampo}
          />
          {errores.asunto && (
            <p id="error-asunto" className={estilos.error} role="alert">
              {errores.asunto}
            </p>
          )}
        </div>

        <div className={estilos.campo}>
          <label className={estilos.etiqueta} htmlFor="mensaje">Mensaje o consulta</label>
          <textarea
            className={`${estilos.area} ${errores.mensaje ? estilos.areaInvalida : ''}`}
            id="mensaje"
            name="mensaje"
            rows={5}
            required
            aria-required="true"
            aria-invalid={Boolean(errores.mensaje)}
            aria-describedby={errores.mensaje ? 'error-mensaje' : undefined}
            value={valores.mensaje}
            onChange={actualizarCampo}
          />
          {errores.mensaje && (
            <p id="error-mensaje" className={estilos.error} role="alert">
              {errores.mensaje}
            </p>
          )}
        </div>

        <button className={estilos.enviar} type="submit">Validar consulta</button>
      </form>
    </section>
  )
}