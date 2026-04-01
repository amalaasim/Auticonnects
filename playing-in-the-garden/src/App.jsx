import StoryScreen from "./components/StoryScreen";

function App({ initialLanguage = "en" }) {
  return <StoryScreen initialLanguage={initialLanguage} />;
}

export default App;
