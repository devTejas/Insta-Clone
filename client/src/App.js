import { createContext, useContext, useEffect, useReducer } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import AllPost from "./pages/AllPost/AllPost";
import CreatePost from "./pages/CreatePost/CreatePost";
import Home from "./pages/Home/Home";
import Profile from "./pages/Profile/Profile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import UserProfile from "./pages/UserProfile/UserProfile";
import ViewPost from "./pages/ViewPost/ViewPost";
import { initialState, reducer } from "./reducers/userReducer";

export const UserContext = createContext(reducer);

const AppRoutes = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { dispatch } = useContext(UserContext);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      dispatch({ type: "USER", payload: user });
      if (pathname === "/signin" || pathname === "/signup") navigate("/");
    } else {
      if (pathname === "/create" || pathname === "/") navigate("/all");
    }
  }, [pathname]);

  return (
    <Routes>
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route exact path="/profile" element={<Profile />} />
      <Route path="/create" element={<CreatePost />} />
      <Route path="/post/:id" element={<ViewPost />} />
      <Route path="/profile/:userid" element={<UserProfile />} />
      <Route path="/" element={<Home />} />
      <Route path="/all" element={<AllPost />} />
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
