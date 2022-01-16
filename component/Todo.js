import React from 'react'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/client'
import { initializeApollo } from '../apollo/client'
import { Button } from '@material-ui/core';

const Todos = ({ todo }) => {
  return (
    <div>
      <div>{todo.title}</div>
      <div>{todo.content}</div>
      <Button color="primary">delete</Button>
    </div>
  )
}


export default Todos