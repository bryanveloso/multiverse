import { createBrowserRouter, RouterProvider } from 'react-router'
import { Shell } from './shell'
import { EditorialList } from './editorial/list'
import { EditorialEditor } from './editorial/editor'
import { PostList } from './posts/list'
import { Dashboard } from './dashboard'

const router = createBrowserRouter([
  {
    path: '/',
    Component: Shell,
    children: [
      { index: true, Component: Dashboard },
      { path: 'editorials', Component: EditorialList },
      { path: 'editorials/:id', Component: EditorialEditor },
      { path: 'posts', Component: PostList },
    ],
  },
])

export function App() {
  return <RouterProvider router={router} />
}
