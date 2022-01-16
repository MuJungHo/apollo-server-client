import React from 'react'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/client'
import {
  Button,
  Checkbox,
  TextField,
  IconButton
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
const DELETE_TODO = gql`
mutation removeTodo($id: ID!) {
  deleteTodosuid(id: $id) {
    data{
     attributes{
       content
     }
   }
  }
}
`;
const GET_TODOS = gql`
query Message {
	todos{
    data{
      id
      attributes{
        content
        finish
      }
    }
  }
}
`
const UPDATE_TODO = gql`
mutation updateTodo($id: ID!, $finish: Boolean!, $content: String!) {
  updateTodosuid(id: $id, data: {finish: $finish, content: $content}) {
    data{
     attributes{
       content
       finish
     }
   }
  }
}`
const Todos = ({ todo }) => {
  const [deleteTodo, { data, loading, error }] = useMutation(DELETE_TODO, {
    refetchQueries: [
      GET_TODOS
    ]
  });
  const [updateTodo, { data_, loading_, error_ }] = useMutation(UPDATE_TODO, {
    refetchQueries: [
      GET_TODOS
    ]
  });
  const [todo_, setTodo] = React.useState({ ...todo })
  const [isUpdating, setUpdating] = React.useState(false)
  React.useEffect(() => {
    if (!isUpdating) {
      updateTodo({ variables: { id: todo_.id, finish: todo_.finish, content: todo_.content } })
    }
  }, [isUpdating])
  return (
    <div style={{ display: 'flex', 'align-items': 'center' }}>
      <Checkbox
        checked={todo.finish}
        onChange={e => updateTodo({ variables: { id: todo_.id, finish: e.target.checked, content: todo_.content } })}
      />
      {!isUpdating && <div onClick={() => setUpdating(true)}>{todo_.content}</div>}
      {isUpdating && <TextField
        value={todo_.content}
        onBlur={() => setUpdating(false)}
        onChange={e => setTodo({
          ...todo_,
          content: e.target.value
        })}
        variant="outlined"
      />}
      <IconButton onClick={() => setUpdating(!isUpdating)}>
        <EditIcon />
      </IconButton>
      <IconButton onClick={() => deleteTodo({ variables: { id: todo_.id } })}>
        <DeleteIcon />
      </IconButton>
    </div>
  )
}


export default Todos