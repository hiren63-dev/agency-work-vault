import { useState, useEffect, useCallback } from 'react'

export default function useSpeechRecognition() {
  const [transcript, setTranscript] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [recognition, setRecognition] = useState(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        const reco = new SpeechRecognition()
        reco.continuous = false // Stop when they stop speaking
        reco.interimResults = true // Show live progress
        reco.lang = 'en-US'

        reco.onresult = (event) => {
          let currentTranscript = ''
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript
          }
          setTranscript(currentTranscript)
        }

        reco.onstart = () => setIsListening(true)
        
        reco.onend = () => setIsListening(false)

        reco.onerror = (event) => {
          console.error("Speech recognition error", event.error)
          setIsListening(false)
        }

        setRecognition(reco)
      } else {
        console.warn('Web Speech API is not supported in this browser.')
      }
    }
  }, [])

  const startListening = useCallback(() => {
    if (recognition && !isListening) {
      setTranscript('')
      recognition.start()
    }
  }, [recognition, isListening])

  const stopListening = useCallback(() => {
    if (recognition && isListening) {
      recognition.stop()
    }
  }, [recognition, isListening])

  const resetTranscript = useCallback(() => {
    setTranscript('')
  }, [])

  return { transcript, isListening, startListening, stopListening, resetTranscript }
}
