import { useEffect, useState } from 'react'

function Versions(): JSX.Element {
  const [versions] = useState(window.electron.process.versions)
  const [appVersion, setAppVersion] = useState<string | null>(null)


  useEffect(() => {
    async function fetchAppVersion() {
      const version = await window.app.getAppVersion()
      setAppVersion(version)
    }
    fetchAppVersion()
  }, [])



  return (
    <ul className="versions">
      <li className="electron-version">Electron v{versions.electron}</li>
      <li className="chrome-version">Chromium v{versions.chrome}</li>
      <li className="node-version">Node v{versions.node}</li>
      <li className="app-version">App v{appVersion}</li>
    </ul>
  )
}

export default Versions
