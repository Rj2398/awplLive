import {BrowserRouter as Router} from 'react-router-dom';
import Routes from "./router/Routes";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; 
import {Provider, useDispatch} from "react-redux";
import store from './redux/store';
import { ToastContainer } from 'react-toastify';

// const queryClient = new QueryClient();

const AppComponent = () => {

  return (
    <>
      <Router>
        <Routes />
      </Router>
    </>
  );
};

function App() {
  return (
    // <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <ToastContainer />
      <AppComponent />
      </Provider>
    // </QueryClientProvider>
  )
}

export default App;
