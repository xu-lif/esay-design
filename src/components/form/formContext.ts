import { createContext } from 'react'

import FormCore from './FormCore'

const formContext = createContext<FormCore | null>(null)

export default formContext