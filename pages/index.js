import gql from 'graphql-tag'
import { useQuery } from '@apollo/client'
import { initializeApollo } from '../apollo/client'

const TodoQuery = gql`
query Message {
	todos{
    data{
      attributes{
        title
        content
      }
    }
  }
}
`

const Index = () => {
  const {
    data: { todos },
  } = useQuery(TodoQuery)
  let todoData = todos.data
  todoData = todoData.map(data => ({ ...data.attributes }))
  return (
    <div>
      {
        todoData.map((todo, index) => <div key={index}>
          <div>{todo.title}</div>
          <div>{todo.content}</div>
        </div>)
      }

    </div>
  )
}

export async function getStaticProps() {
  const apolloClient = initializeApollo()

  await apolloClient.query({
    query: TodoQuery,
  })

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
  }
}

export default Index
