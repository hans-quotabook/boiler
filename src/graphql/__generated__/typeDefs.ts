export default `
"""Article"""
type Article implements Node {
  id: ID!

  """Original ID"""
  _id: String!

  """Content"""
  content: String!
}

type ArticleConnection {
  """
  https://facebook.github.io/relay/graphql/connections.htm#sec-Edge-Types
  """
  edges: [ArticleEdge!]!

  """Flattened list of Article type"""
  nodes: [Article!]!

  """
  https://facebook.github.io/relay/graphql/connections.htm#sec-undefined.PageInfo
  """
  pageInfo: PageInfo!
}

type ArticleEdge {
  """https://facebook.github.io/relay/graphql/connections.htm#sec-Cursor"""
  cursor: String!

  """https://facebook.github.io/relay/graphql/connections.htm#sec-Node"""
  node: Article!
}

type Query {
  """Get articles"""
  articles(where: ArticlesWhereInput, first: Int!, after: String): ArticleConnection!

  """Get object by ID (Global Object Identification)"""
  node(id: ID!): Node

  """Returns true"""
  ping: Boolean!

  """Returns commit hash"""
  version: String!
}

input ArticlesWhereInput {
  _id: String
}

interface Node {
  """Unique ID in the schema (Global Object Identification)"""
  id: ID!
}

scalar DateTime

scalar Date

scalar Time

"""
PageInfo cursor, as defined in https://facebook.github.io/relay/graphql/connections.htm#sec-undefined.PageInfo
"""
type PageInfo {
  """
  The cursor corresponding to the first nodes in edges. Null if the connection is empty.
  """
  startCursor: String

  """
  The cursor corresponding to the last nodes in edges. Null if the connection is empty.
  """
  endCursor: String

  """
  Used to indicate whether more edges exist following the set defined by the clients arguments.
  """
  hasNextPage: Boolean!

  """
  Used to indicate whether more edges exist prior to the set defined by the clients arguments.
  """
  hasPreviousPage: Boolean!
}

`