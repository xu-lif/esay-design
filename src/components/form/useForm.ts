import { useRef } from 'react'

import FormCore, { Rule } from './FormCore'
type UseFormProps = {
  rules?: Record<string, Rule>;
  initValues?: Record<string, any>;
}

const useForm = (props?: UseFormProps) => {
  const formRef = useRef<FormCore | null>(null)
  if (!formRef.current) {
    formRef.current = new FormCore(props?.initValues, props?.rules)
  }
  return formRef.current
}

export default useForm