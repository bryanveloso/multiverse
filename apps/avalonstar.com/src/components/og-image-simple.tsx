import * as React from 'react'

interface SimpleOgImageProps {
  title: string
  date: Date
  authorAge: number
}

export function SimpleOgImage({ title, date, authorAge }: SimpleOgImageProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div
      style={{
        width: 1200,
        height: 630,
        backgroundColor: '#0d0a11',
        color: '#ffffff',
        padding: 80,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        fontFamily: 'Geologica, sans-serif'
      }}>
      <div style={{ display: 'flex', fontSize: 18, color: '#fff683' }}>
        Avalonstar
      </div>

      <div style={{ display: 'flex', fontSize: 48, fontWeight: 700, textAlign: 'center' }}>
        {title}
      </div>

      <div style={{ display: 'flex', fontSize: 16, color: '#939393' }}>
        {formatDate(date)} • Age {authorAge}
      </div>
    </div>
  )
}