import moment from 'moment'
import 'moment/locale/pt-br'

moment.locale('pt-br')

export function fromNow(value) {
  return moment(value).fromNow()
}
