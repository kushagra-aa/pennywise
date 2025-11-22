import { Route, Router } from "@solidjs/router";
import Layout from "~/components/Layout";
import Toast from "~/components/ui/Toast";
import Accounts from "~/pages/Accounts";
import Dashboard from "~/pages/Dashboard";
import Profile from "~/pages/Profile";
import Transactions from "~/pages/Transactions";
import LandingPage from "./pages/LandingPage";
import Recurrings from "./pages/Recurrings";

function App() {
  // useRecurringGenerator();
  return (
    <>
      <Router root={Layout}>
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/accounts" component={Accounts} />
        <Route path="/transactions" component={Transactions} />
        <Route path="/profile" component={Profile} />
        <Route path="/recurrings" component={Recurrings} />
        <Route path="*404" component={LandingPage} />
      </Router>
      <Toast />
    </>
  );
}

export default App;
