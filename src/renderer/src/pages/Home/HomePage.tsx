import { withPageTransition } from '@renderer/components/AnimatedOutlet'

function HomePage(): JSX.Element {
  return (
    <div>
      <h1>Home Page</h1>
      <h2>Welcome to your Electron app with routing and animations!</h2>

      <h3 style={{ marginTop: '3rem' }}>Features</h3>
      <ul>
        <li>React Router with Hash routing for Electron</li>
        <li>Framer Motion page transitions</li>
        <li>Theme switching (Light/Dark)</li>
        <li>Beautiful animations</li>
        <li>Role-based navigation</li>
      </ul>
    </div>
  )
}

export default withPageTransition(HomePage)
