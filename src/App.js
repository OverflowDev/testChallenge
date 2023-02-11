import { toast, Toaster } from 'react-hot-toast';

import Form from "./components/Form";
import Sectors from "./components/Sectors";

function App() {
  return (
    <div className="App">
      <Toaster toastOptions={{ 
        duration: 4000
      }} />
      <Form />
      {/* <Sectors /> */}
    </div>
  );
}

export default App;
