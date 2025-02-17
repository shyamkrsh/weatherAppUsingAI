import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import { ThemeContext, useThemeProvider } from "./lib/theme";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const themeContext = useThemeProvider();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeContext.Provider value={themeContext}>
        <Router />
        <Toaster />
      </ThemeContext.Provider>
    </QueryClientProvider>
  );
}

export default App;
