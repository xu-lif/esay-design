import React, { useCallback, useRef, useState } from "react";

type InputProps = {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
};

const Input: React.FC<InputProps> = ({
  value,
  defaultValue = "",
  onChange,
}) => {
  // value的是否设置来判断是否是受控组件
  const isControled = typeof value !== "undefined";
  const [, setForceUpdate] = useState({});
  const stateRef = useRef(isControled ? value : defaultValue);

  if (isControled) {
    stateRef.current = value;
  }

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    stateRef.current = e.target.value;
    setForceUpdate({});
    if (onChange) onChange(stateRef.current);
  }, []);

  return <input value={stateRef.current} onChange={handleChange} />;
};

export default React.memo(Input);
