import { createBrowserRouter, RouterProvider } from 'react-router'
import { Shell } from './shell'
import { EditorialList } from './editorial/list'
import { EditorialEditor } from './editorial/editor'
import { Timeline } from './posts/list'
import { PostEditor } from './posts/editor'
import { GapEditor } from './gaps/editor'
import { ComposerList } from './composer/list'
import { ComposerDetail } from './composer/detail'
import { Dashboard } from './dashboard'

const router = createBrowserRouter([
  {
    path: '/',
    Component: Shell,
    children: [
      { index: true, Component: Dashboard },
      { path: 'editorials', Component: EditorialList },
      { path: 'editorials/:id', Component: EditorialEditor },
      { path: 'posts', Component: Timeline },
      { path: 'posts/:slug', Component: PostEditor },
      { path: 'gaps/:id', Component: GapEditor },
      { path: 'composer', Component: ComposerList },
      { path: 'composer/:subject', Component: ComposerDetail },
    ],
  },
])

export function App() {
  return <RouterProvider router={router} />
}
