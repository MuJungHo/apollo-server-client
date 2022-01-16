import React from 'react'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/client'
import { Button } from '@material-ui/core';

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
const Todos = ({ todo }) => {
  const [deleteTodo, { data, loading, error }] = useMutation(DELETE_TODO);
  return (
    <div>
      <div>{todo.content}</div>
      <div>{todo.finish ? 1: 0}</div>
      <Button color="primary" onClick={() => deleteTodo({ variables: { id: todo.id } })}>delete</Button>
    </div>
  )
}


export default Todos