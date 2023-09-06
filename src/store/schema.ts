import { defineStore } from 'pinia'
import { hasOwn } from '@/utils/index'

export const useSchemaStore = defineStore({
  id: 'creataLayout', // id必填，且需要唯一
  state: () => {
    return {
      colNum: 12,
      colPx: 12,
      pageList: [] as any,
      sourceData: [] as any,
      curGrid: null as any,
      pageIndex: 0,
      funcList: []
    }
  },
  actions: {
    setData(key: string, val: any, property?: string) {
      if (property) {
        let target: any = setVal(this[key], property)
        if (target) {
          target[0][target[1]] = val
        } else {
          console.log('不存在属性')
        }
      } else {
        this[key] = val
      }
    },
    addList(key: string, val: any, property?: string) {
      if (property) {
        let target: any = setVal(this[key], property)
        if (target) {
          target[0][target[1]].push(val)
        } else {
          console.log('不存在属性')
        }
      } else {
        this[key].push(val)
      }
    },
    deleteList(key: string, index: any, property?: string) {
      if (property) {
        let target: any = setVal(this[key], property)
        if (target) {
          target[0][target[1]].splice(index, 1)
        } else {
          console.log('不存在属性')
        }
      } else {
        this[key].splice(index, 1)
      }
    },
  }
})

const setVal = (state: any, property: string) => {
  if (property.includes('.')) {
    let arr = property.split('.')
    let target = state
    for (let index = 0; index < arr.length - 1; index++) {
      if (hasOwn(target, arr[index])) {
        target = target[arr[index]]
      } else {
        return null
      }
    }
    if (hasOwn(target, arr[arr.length - 1])) {
      return [target, arr[arr.length - 1]]
    } else {
      return null
    }
  } else {
    if (hasOwn(state, property)) {
      return [state, property]
    } else {
      return null
    }
  }
}