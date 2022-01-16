import React from 'react'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/client'
import {
  Typography,
  Checkbox,
  Button,
  Input,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import BuildIcon from '@material-ui/icons/Build';
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
mutation updateTodo($id: ID!, $finish: Boolean!) {
  updateTodosuid(id: $id, data: {finish: $finish}) {
    data{
     attributes{
       content
       finish
     }
   }
  }
}`
const UPDATE_TODO_CONTENT = gql`
mutation updateTodo($id: ID!, $content: String!) {
  updateTodosuid(id: $id, data: {content: $content}) {
    data{
     attributes{
       content
       finish
     }
   }
  }
}`
const Todos = ({ todo }) => {
  const [deleteTodo, { }] = useMutation(DELETE_TODO, {
    refetchQueries: [
      GET_TODOS
    ],
    onCompleted() {
      console.log('finish')
    }
  });
  const [updateTodo, { }] = useMutation(UPDATE_TODO, {
    refetchQueries: [
      GET_TODOS
    ]
  });
  const [updateTodoContent, { }] = useMutation(UPDATE_TODO_CONTENT, {
    refetchQueries: [
      GET_TODOS
    ]
  });
  const [todo_, setTodo] = React.useState({ ...todo })
  const [isUpdating, setUpdating] = React.useState(false)
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    if (!isUpdating) {
      if (todo_.content.trim().length === 0) return setTodo({ ...todo })
      updateTodoContent({ variables: { id: todo_.id, content: todo_.content } })
    }
  }, [isUpdating])
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Checkbox
        checked={todo.finish}
        onChange={e => updateTodo({ variables: { id: todo_.id, finish: e.target.checked } })}
      />
      {!isUpdating && <Typography style={{
        flex: 1,
        textAlign: 'left',
        textDecoration: todo.finish ? 'line-through' : 'none'
      }} onClick={() => setUpdating(true)}>{todo_.content}</Typography>}
      {isUpdating && <Input
        fullWidth
        value={todo_.content}
        onBlur={() => setUpdating(false)}
        onChange={e => setTodo({
          ...todo_,
          content: e.target.value
        })}
        variant="outlined"
      />}
      <IconButton onClick={() => setUpdating(!isUpdating)}>
        <BuildIcon />
      </IconButton>
      <IconButton
        onClick={() => setOpen(true)}
      >
        <DeleteIcon />
      </IconButton>
      <Dialog
        fullWidth
        maxWidth="sm"
        open={open}
        onClose={() => setOpen(false)}
      >
        <DialogTitle>{"Warning"}</DialogTitle>
        <DialogContent>
          <DialogContentText >
            {`Are you sure to delete ${todo.content}?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary" >
            cancel
          </Button>
          <Button onClick={() => deleteTodo({ variables: { id: todo.id } })} variant="contained" color="secondary" autoFocus>
            delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}


export default Todos