import { withPageTransition } from '@renderer/components/AnimatedOutlet'

const Tasks = () => {
  return (
    <div>
      <h1 className="main-heading">Tasks</h1>
      <p className="main-description">Manage your tasks here.</p>
    </div>
  )
}

export default withPageTransition(Tasks)
