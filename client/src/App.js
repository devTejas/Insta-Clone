import "./App.css";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/pages/Home/Home";
import SignIn from "./components/pages/SignIn";
import SignUp from "./components/pages/SignUp";
import Profile from "./components/pages/Profile/Profile";
import CreatePost from "./components/pages/CreatePost/CreatePost";
import { createContext, useContext, useEffect, useReducer } from "react";
import { initialState, reducer } from "./reducers/userReducer";

export const UserContext = createContext(reducer);

const AppRoutes = () => {
  const navigate = useNavigate();
  const { dispatch } = useContext(UserContext);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    console.log(user);

    if (user) dispatch({ type: "USER", payload: user });
    else navigate("/signin");
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/create" element={<CreatePost />} />
    </Routes>
  );
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <Navbar />
        <AppRoutes />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
