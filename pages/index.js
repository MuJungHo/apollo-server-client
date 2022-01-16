import gql from 'graphql-tag'
import React, { Fragment } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { initializeApollo } from '../apollo/client'
import Todo from '../component/Todo'
import { Button, Input, Paper, Typography } from '@material-ui/core';
const styles = {
  Paper: {
    padding: 20,
    margin: "auto",
    textAlign: "center",
    width: 700,
    background: '#2d2d2d'
  }
};

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
const CREATE_TODO = gql`
mutation CreateTodo($content: String!) {
  createTodosuid(data: {content: $content,finish: false, publishedAt: "2019-09-01T15:04:12.627Z"}) {
    data{
      attributes{
        content
        finish
      }
    }
  }
}
`;
const Index = () => {
  const {
    data: { todos },
  } = useQuery(GET_TODOS)
  const [addTodo, { }] = useMutation(CREATE_TODO, {
    refetchQueries: [
      GET_TODOS
    ]
  });
  let todo_ = todos.data
  const inputRef = React.useRef();

  todo_ = todo_.map(data => ({ id: data.id, ...data.attributes }))
  const handleCreateTodo = e => {
    e.preventDefault();
    if (inputRef.current.value.trim().length === 0) return
    addTodo({ variables: { content: inputRef.current.value } });
    inputRef.current.value = '';
  }
  return (
    <Fragment>
      <style jsx global>{`
        body {
          margin: 0px;
        }
      `}</style>
      <div style={{
        height: '100vh',
        paddingTop: 20,
        boxSizing: 'border-box',
        background: '#262626'
      }}>
        <Paper style={styles.Paper}>
          <Typography variant="h4" style={{ color: '#61dafb', textAlign: 'left' }}>To Do List</Typography>
          <div style={{ background: '#fff', padding: 10, borderRadius: 5, marginTop: 20 }}>
            {
              todo_.map((todo, index) => <Todo key={todo.id} todo={todo} />)
            }
            <form
              style={{ display: 'flex', }}
              onSubmit={handleCreateTodo}
            >
              <Input
                style={{ flex: 1 }}
                placeholder="Add a new to do"
                inputRef={inputRef}
              />
              <Button
                style={{ marginLeft: 20 }}
                type="submit"
                variant="contained"
                color="primary"
              >
                Add
              </Button>
            </form>
          </div>
        </Paper>
      </div >
    </Fragment >
  )
}

export async function getStaticProps() {
  const apolloClient = initializeApollo()

  await apolloClient.query({
    query: GET_TODOS,
  })

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
  }
}

export default Index
