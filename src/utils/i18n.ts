import {format} from 'date-fns'

const pidor = [
  ['пидор', 'пидоры'],
  ['пидора', 'пидоров'],
  ['пидору', 'пидорам'],
  ['пидора', 'пидоров'],
  ['пидором', 'пидорами'],
  ['пидоре', 'пидорах'],
]

const pumpkin = [
  ['тыковка', 'тыковки'],
  ['тыковки', 'тыковок'],
  ['тыковке', 'тыковкам'],
  ['тыковку', 'тыковки'],
  ['тыковкой', 'тыковками'],
  ['тыковке', 'тыковках'],
]

const pumpkinDates = ['31.10', '01.11', '02.11', '03.11', '04.11', '05.11', '06.11', '07.11']

export const getPidor = (role: 1 | 2 | 3 | 4 | 5 | 6, count: 1 | 2, opts: {
  capitalize?: boolean
  uppercase?: boolean
} = {}) => {
  const date = format(new Date, 'dd.MM')
  let translation = pidor

  if(pumpkinDates.includes(date)) {
    translation = pumpkin
  }

  let text = translation[role - 1][count - 1]

  if(opts.capitalize) {
    text = text[0].toUpperCase() + text.slice(1)
  }

  if(opts.uppercase) {
    text = text.toUpperCase()
  }

  return text
}
