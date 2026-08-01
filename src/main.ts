import './style.css'
import { bootAnalytics } from './analytics'
import { Game } from './game/Game'
import { bootI18n } from './i18n'

bootI18n()
bootAnalytics()

const canvas = document.querySelector<HTMLCanvasElement>('#game')
if (!canvas) {
  throw new Error('Game canvas not found')
}

new Game(canvas)
