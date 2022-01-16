import gql from 'graphql-tag'
import { useQuery, useMutation } from '@apollo/client'
import { initializeApollo } from '../apollo/client'
import Todo from '../component/Todo'
import { Button } from '@material-ui/core';
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
  const [addTodo, { data, loading, error }] = useMutation(CREATE_TODO, {
    refetchQueries: [
      GET_TODOS
    ]
  });
  let input;
  let todo_ = todos.data

  todo_ = todo_.map(data => ({ id: data.id, ...data.attributes }))
  return (
    <div>
      <form
        onSubmit={e => {
          e.preventDefault();
          addTodo({ variables: { content: input.value } });
          input.value = '';
        }}
      >
        <input
          ref={node => {
            input = node;
          }}
        />
        <button type="submit">Add Todo</button>
      </form>
      {
        todo_.map((todo, index) => <Todo key={index} todo={todo} />)
      }
    </div>
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
