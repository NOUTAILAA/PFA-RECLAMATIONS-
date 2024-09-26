import LoginComponent from './components/LoginComponent';
import './App.css'
import { BrowserRouter, Routes, Route, useLocation  } from 'react-router-dom';
import DemandsTable from './components/DemandeComponent';
import DemandForm from './components/DemandForm';
import DemandsList from './components/DemandList';
import UserProfile from './components/UserProfile';
import DemandDetails from './components/DemandDetails';
function App() {
  return (
    <BrowserRouter>
      <RouteRender />
    </BrowserRouter>
  );

  function RouteRender() {
    const location = useLocation(); // Correctement placé à l'intérieur du contexte de routeur

  return (
    <>
        <Routes>
          <Route path='/' element={<LoginComponent />} />
          <Route path='/demande' element={<DemandsTable />} />
          <Route path='/demandform' element={<DemandForm />} />
          <Route path="/alldemands" element={<DemandsList />} />
          <Route path="/profile/:userId" element={<UserProfile />} />
          <Route path="/demand/:id" element={<DemandDetails />} />

        </Routes>
        
  
      
    </>
  );
}
}
export default App
