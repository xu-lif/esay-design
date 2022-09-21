import "./App.css";

import React from "react";

import Form from "./components/form";
import { FormField, useForm } from "./components/form";
import Input from "./components/input";

function App() {
  const form = useForm({
    // rules: {
    //   age: {
    //     validate: (data) => {
    //       return data && data.length < 3
    //     },
    //     errorText: '长度不能超过2'
    //   }
    // } ,
    // initValues: {
    //   age: '1212'
    // }
  });

  // const [, setForceUpdate] = useState({})

  const handleBtnClick = (data: any) => {
    console.log("data", data);
  };
  return (
    <div className="App">
      <Form form={form} onSubmit={handleBtnClick}>
        <FormField
          name="name"
          rule={{
            validate: (data) => {
              return typeof data !== "undefined" && data.length < 4;
            },
            errorText: "字符串长度不能超过3",
          }}
        >
          <input id="name" />
        </FormField>
        <FormField
          name="age"
          initValue="2345"
          rule={{
            validate: (data) => typeof data !== "undefined" && data.length < 3,
            errorText: "字符串长度不能超过2",
          }}
        >
          <input id="age" />
        </FormField>
        <button>提交按钮</button>
      </Form>
      <Input value="112" />
    </div>
  );
}

export default App;
