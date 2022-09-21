import React, {
  cloneElement,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";

import formContext from "./formContext";
import FormCore, { Rule } from "./FormCore";

type FormFieldProps = {
  children: React.ReactElement;
  name: string;
  errorClass?: string;
  initValue?: string;
  rule?: Rule;
};
/**
 *  数据 data-core
 *  数据变更触发react re-render(forceUpdate, setState)
 *
 */

const FormField: React.FC<FormFieldProps> = ({
  name,
  initValue,
  rule,
  errorClass = "",
  children,
}) => {
  const formCore = useContext<FormCore | null>(formContext);
  useMemo(() => {
    if (rule) {
      formCore?.setFieldRule(name, rule);
    }
    if (initValue) {
      formCore?.setFieldInitValue(name, initValue);
    }
  }, []);
  // 订阅外部数据源的变更
  /**
   * useSyncExternalStore
   *   --  mount阶段：获取当前store的数据快照(const storeData = () => formCore?.get(name)()),并保存hook.memorizedState = storeData, 挂载effect对象值fiber.updateQueue中
   *   --- mount effect阶段：执行订阅外部数据源
   *   --- commit阶段和fiber调和结束之后，为了保证数据已经是最新的，会判断数据是否发生了变化,如果发生了变更，则开启一个同步的渲染任务
   *   --- update: （1）获取store的数据快照，如果deps（subscribe函数发生变化时），按照effect的逻辑重新发起订阅操作
   *   --- 订阅外部数据源的listener触发时，比较新旧value是否变化，变化的话开启一个同步的渲染任务
   */
  const state = useSyncExternalStore(
    (l) => () => {
      formCore?.subscribe(name, l);
    },
    () => formCore?.get(name)
  );
  // const [, setForceUpdate] = useState({})
  // const valueRef = useRef<any>(initValue)
  // const errorRef = useRef<ErrorMsg>({
  //   status: false,
  //   msg: ''
  // })
  // const cancleSubscribe = useRef<any>(null)

  // const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
  //   const value = e.target.value
  //   formCore?.set(name, value)
  // }, [])

  // const child = cloneElement(children, {
  //   value: valueRef.current,
  //   onChange: onChange
  // })

  // // 订阅副作用需要放在useEffect中
  // useEffect(() => {
  //   cancleSubscribe.current = formCore?.subscribe(name, (key: string) => {
  //     if (key === name || key === '*') {
  //       setForceUpdate({})
  //       valueRef.current = formCore?.data.get(name)
  //       if (formCore?.errors[name]) {
  //         errorRef.current = formCore?.errors[name]
  //       }
  //     }
  //   }, initValue)
  //   // isCount.current = false
  //   return () => { // 执行时机问题
  //     if (cancleSubscribe.current) {
  //       cancleSubscribe.current()
  //     }
  //   }
  // }, [])

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    formCore?.set(name, value);
  }, []);

  const errors = formCore?.getErrors(name);

  return (
    <div>
      <div>
        <span>value: </span>
        <span>{state}</span>
      </div>
      {cloneElement(children, {
        value: state,
        onChange: onChange,
      })}
      {errors && errors.status && (
        <div
          style={{
            color: "red",
            fontSize: "14px",
          }}
          className={errorClass}
        >
          {errors.msg}
        </div>
      )}
    </div>
  );
};

export default React.memo(FormField);
