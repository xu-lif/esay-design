type ListenerFunc = (name: string) => void;

export type ErrorMsg = {
  msg: string,
  status: boolean,
}

export type Rule = {
  validate: (value: any, record: Map<string, any>) => boolean,
  errorText: string
}

class FormCore {
  private data: Map<string, any>;
  private listeners: Set<ListenerFunc>;
  private errors: Record<string, ErrorMsg>;
  public status: "edit" | "loading" | "disabled";
  private rules: Record<string, Rule>;
  private hasListeners: Set<string>;
  constructor(initValue?: any, rules?: Record<string, Rule>) {
    this.data = new Map();
    this.listeners = new Set();
    this.errors = {};
    this.status = "edit";
    this.rules = {};
    this.hasListeners = new Set();
    if (initValue) {
      Object.keys(initValue).forEach(key => {
        this.data.set(key, initValue[key])
      })
    }
    if (rules) {
      Object.keys(rules).forEach(key => {
        if (rules[key] && typeof rules[key].validate === 'function') {
          this.rules[key] = rules[key]
        }
      })
    }
  }

  // 订阅模式
  subscribe = (name: string, listener: ListenerFunc) => {
    if (!name || !listener || this.hasListeners.has(name)) {
      return ;
    }
    this.listeners.add(listener);
    this.hasListeners.add(name)
    // this.notify(name)
    return () => {
      this.listeners.delete(listener);
      this.hasListeners.delete(name)
    };
  };

  // 数据变更，通知re-render
  private notify = (name: string) => {
    this.listeners.forEach((listender) => {
      listender(name);
    });
  };

  // 数据变更, 变更结束检查数据
  set(name: string, value: any) {
    if (!name) {
      return;
    }
    this.data.set(name, value);
    this.validateData(name)
    this.notify(name);
  }

  // 获取数据
  get(name?: string) {
    if (!name) {
      return this.data
    }
    return this.data.get(name)
  }

  // 获取error
  getErrors(): Record<string, ErrorMsg>
  getErrors(name: string): ErrorMsg
  getErrors(name?: string) {
    if (name) {
      return this.errors[name]
    }
    return this.errors
  }

  // 设置field的rule
  setFieldRule(name: string, rule: Rule) {
    this.rules[name] = rule
  }

  // 设置field的initValue
  setFieldInitValue(name: string, initValue: any) {
    this.data.set(name, initValue)
  }

  // 验证field数据并且更新this.errrors
  private validateSingleField(name: string) {
    if (name && this.rules) {
      const curRule = this.rules[name]
      const execRuleResult = curRule.validate(this.data.get(name), this.data)
      if (!execRuleResult) { // 检查不通过
        this.errors[name] = {
          msg: curRule.errorText,
          status: true
        }
      } else {
        this.errors[name] = {
          msg: '',
          status: false
        }
      }
    }
  }

  // 检查数据validate
  private validateData(name: string | undefined) {
    if (name) { // 检查单个field
      if (this.rules && this.rules[name]) {
        this.validateSingleField(name)
      }
    } else { // 检查整个表单的所有field
      if (this.rules) {
        Object.keys(this.rules).forEach(key => {
          this.validateSingleField(key)
        })
      }
    }
  }

  validataAndNotify(name?: string): boolean {
    this.validateData(name)
    if (name) {
      return !!this.errors[name]
    }
    return !!this.errors && Object.keys(this.errors).some(key => {
      return this.errors[key].status
    })
    // this.notify(name || '*')
  }
}

export default FormCore;
