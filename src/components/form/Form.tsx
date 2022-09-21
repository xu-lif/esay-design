import React, { useCallback, useRef, useState } from "react";

import formContext from "./formContext";
import FormCore, { Rule } from "./FormCore";

type FormProps = {
  children: React.ReactNode;
  form?: any;
  rules?: Record<string, Rule>;
  initValues?: Record<string, any>;
  onSubmit?: (data: Record<string, any>) => void;
};

const Form: React.FC<FormProps> = ({
  children,
  form,
  rules,
  initValues,
  onSubmit,
}) => {
  const formRef = useRef<FormCore>(form);
  const [, setForceUpdate] = useState({});
  if (!formRef.current) {
    formRef.current = new FormCore(initValues, rules);
  }
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const isHasError = formRef.current.validataAndNotify();
    if (isHasError) {
      setForceUpdate({});
    } else if (onSubmit) {
      onSubmit(formRef.current.get());
    }
  }, []);

  return (
    <formContext.Provider value={formRef.current}>
      <form onSubmit={handleSubmit}>{children}</form>
    </formContext.Provider>
  );
};

export default React.memo(Form);
