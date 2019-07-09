import React, { Fragment, useContext, useMemo } from 'react'
import { container, field } from '../styles/form'
import { row } from '../styles/shared'

import useFormal from '@kevinwolf/formal-web'
import useNetwork from '../lib/use-network'
import * as yup from 'yup'
import audioContext from '../lib/audio-context'

function Field({ id, label, error, children, ...props }) {
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <div className="inlineField">
        <input id={id} type="text" {...props} />
        {children}
      </div>
      {error && <div>{error}</div>}
      <style jsx>{field}</style>
    </div>
  )
}

function YouTubeForm() {
  const [res, sendRequest] = useNetwork('/api/info')
  const url = res.data && `/api/stream-youtube?id=${res.data.id}`
  const audio = useContext(audioContext)

  useMemo(() => {
    if (!url) {
      return
    }

    audio.setNowPlaying({
      ...res.data,
      url
    })
  }, [url])

  const schema = useMemo(() => {
    try {
      return yup.object().shape({
        url: yup
          .string()
          .url()
          .required()
      })
    } catch (e) {
      return null
    }
  })

  const formal = useFormal(
    {},
    {
      schema,
      onSubmit: sendRequest
    }
  )

  return (
    <Fragment>
      <form {...formal.getFormProps()} className="row">
        <Field label="Youtube URL" {...formal.getFieldProps('url')}>
          <button {...formal.getSubmitButtonProps()} type="submit">
            Submit
          </button>
        </Field>
      </form>

      {res.isLoading && <div className="row">Loading...</div>}

      {!res.isLoading && res.error && (
        <div className="row error">
          <h2>Could not get video</h2>
          <p>{res.error.message}</p>
        </div>
      )}

      <style jsx>{row}</style>
      <style jsx>{container}</style>
    </Fragment>
  )
}

export default YouTubeForm
