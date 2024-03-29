import queryGraphql from '../../shared/query-graphql';

export default function TodoProfile({ todo }) {
  if (!todo) {
    return <h1>Todo Not Found</h1>;
  }
  return (
    <h1>
      {todo.title} is{todo.checked ? ' already done' : ' still not done'}
    </h1>
  );
}

export async function getStaticProps(context) {
  const { params } = context;
  const { id } = params;
  const { todo = null } = await queryGraphql(
    `
    query($id: ID) {
      todo(id: $id) {
        id
        title
        checked
      }
    }
  `,
    { id },
  );
  return { props: { todo } };
}

export async function getStaticPaths() {
  const { todos } = await queryGraphql(`
    query {
      todos {
        title
        checked
        id
      }
    }
  `);
  return {
    paths: todos.map(({ id }) => ({
      params: { id },
    })),
    fallback: true,
  };
}
