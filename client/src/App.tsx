import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import {
  AppRoleRouterPage,
  BrowseDirectoryPage,
  DealRoomPage,
  LandingPage,
  OfferComposerPage,
  OfferDetailPage,
  OffersIndexPage,
  RoleDashboardPage,
  RoleOnboardingPage,
} from "@/pages/GetBookedPlatform";
import { useEffect } from "react";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

function RedirectRoute({ to }: { to: string }) {
  const [, setLocation] = useLocation();

  useEffect(() => {
    setLocation(to);
  }, [setLocation, to]);

  return null;
}

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={LandingPage} />
      <Route path={"/signup/role"} component={RoleOnboardingPage} />
      <Route path={"/app"} component={AppRoleRouterPage} />
      <Route path={"/app/artist"}>{() => <RoleDashboardPage role="artist" />}</Route>
      <Route path={"/app/promoter"}>{() => <RoleDashboardPage role="promoter" />}</Route>
      <Route path={"/app/venue"}>{() => <RoleDashboardPage role="venue" />}</Route>
      <Route path={"/app/crew"}>{() => <RoleDashboardPage role="crew" />}</Route>
      <Route path={"/app/creative"}>{() => <RoleDashboardPage role="creative" />}</Route>
      <Route path={"/browse"}>{() => <BrowseDirectoryPage role="all" />}</Route>
      <Route path={"/browse/artists"}>{() => <BrowseDirectoryPage role="artist" />}</Route>
      <Route path={"/browse/venues"}>{() => <BrowseDirectoryPage role="venue" />}</Route>
      <Route path={"/browse/crews"}>{() => <BrowseDirectoryPage role="crew" />}</Route>
      <Route path={"/browse/creatives"}>{() => <BrowseDirectoryPage role="creative" />}</Route>
      <Route path={"/offers"} component={OffersIndexPage} />
      <Route path={"/offers/new"} component={OfferComposerPage} />
      <Route path={"/offers/:id"}>{params => <OfferDetailPage id={params.id} />}</Route>
      <Route path={"/deals/:id"}>{params => <DealRoomPage id={params.id} />}</Route>
      <Route path={"/dashboard"}>{() => <RedirectRoute to="/app" />}</Route>
      <Route path={"/offer"}>{() => <RedirectRoute to="/offers" />}</Route>
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
