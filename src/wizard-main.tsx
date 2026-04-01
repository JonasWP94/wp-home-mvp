import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { WpHomeProvider, useWpHome } from './store/wpHomeStore'
import Wizard from './components/Wizard/index'

function WizardPage() {
  const { data } = useWpHome();

  useEffect(() => {
    if (data.wizardDone) {
      window.location.href = '/apps/wpilot-home/';
    }
  }, [data.wizardDone]);

  if (data.wizardDone) {
    return null;
  }

  return <Wizard />;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WpHomeProvider>
      <WizardPage />
    </WpHomeProvider>
  </React.StrictMode>,
)
