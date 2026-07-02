import { createBrowserRouter, RouterProvider } from 'react-router'
import { Shell } from './shell'
import { PagesList } from './pages/list'
import { PageDetail } from './pages/detail'
import { SlotEditor } from './pages/slot-editor'
import { Timeline } from './posts/list'
import { PostEditor } from './posts/editor'
import { GapEditor } from './gaps/editor'
import { Dashboard } from './dashboard'

const router = createBrowserRouter([
  {
    path: '/',
    Component: Shell,
    children: [
      { index: true, Component: Dashboard },
      { path: 'pages', Component: PagesList },
      { path: 'pages/:slug', Component: PageDetail },
      { path: 'slots/:id', Component: SlotEditor },
      { path: 'posts', Component: Timeline },
      { path: 'posts/:slug', Component: PostEditor },
      { path: 'gaps/:id', Component: GapEditor },
    ],
  },
])

export function App() {
  return <RouterProvider router={router} />
}
