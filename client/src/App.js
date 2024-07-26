import './App.css';
import Dashboard from './pages/Home/Dashboard';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import Query from './pages/Home/Query';
import Labs from './pages/Home/Labs';
import Resources from './pages/Home/Resources';
import Emergency from './pages/Home/Emergency';
import Disease from './pages/Home/Disease';
import { getDeptList } from './pages/Functions_Files/Fetchdata';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setDepartment } from './state/filtersSlice';
import Main from './pages/Home/Main';
import Login from './pages/Home/Login';
import Signup from './pages/Home/Signup';
import Protect from './pages/Home/Protectedroute';
import Profile from './pages/Home/Profile';
import Public from './pages/Home/Public_route';
import { setTheme } from './pages/Home/themeUtils';
import Forgetpassword from './pages/Home/Forgetpassword';
function App() {
  const [deptList, setDeptlist] = useState();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.token);
  const theme = useSelector((state) => state.user?.user?.theme) || "default";
  setTheme(theme);
  const fetchData = async () => {
    if (!token) return
    const res = await getDeptList(token);
    setDeptlist(res);
    if (res) dispatch(setDepartment(res.join(', ')));
  };
  useEffect(() => {
    fetchData();
  }, [token])
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/profile" element={
            <Protect
              children={<Profile />}
            />
          } />
          <Route path="/" element=

            {<Public children={<Main />} />}
          >
            <Route path="" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="forgetpassword" element={<Forgetpassword />} />
          </Route>
          <Route path="dashboard" element={<Protect children={<Dashboard Department_list={deptList} />} />}>
            <Route path="" element={<Protect children={<Home />} />} />
            <Route path="labs" element={<Protect children={<Labs />} />} />
            <Route path="resources" element={<Protect children={<Resources />} />} />
            <Route path="emergency" element={<Protect children={<Emergency />} />} />
            <Route path="disease" element={<Protect children={<Disease />} />} />
            {/* <Route path="PatientExplorer" element={<Protect children={<Query />} />} /> */}
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
