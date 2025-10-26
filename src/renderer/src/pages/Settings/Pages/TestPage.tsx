import { withPageTransition } from '@renderer/components/AnimatedOutlet'

function TestPage() {
  return (
    <div>
      <h1>Test</h1>
      <p>This is the test settings page.</p>
    </div>
  )
}

export default withPageTransition(TestPage)
