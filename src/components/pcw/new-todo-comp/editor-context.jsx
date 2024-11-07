import React from 'react'
import { useContext, createContext, useState } from 'react'

const TodoEditorStateContext = createContext()
export const TodoEditorProvider = ({ children }) => {
  const [opened, setOpened] = useState(false)
  return (
    <TodoEditorStateContext.Provider
      value={{
        opened: opened,
        setOpened
      }}
    >
      { children }
    </TodoEditorStateContext.Provider>
  )
}

export const UseTodoEditorOpened = () => {
  const {opened, setOpened} = useContext(TodoEditorStateContext);

  return { opened: opened, setOpened: setOpened }
}