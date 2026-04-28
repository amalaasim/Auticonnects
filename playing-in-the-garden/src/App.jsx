import StoryScreen from "./components/StoryScreen";

function App({
  initialLanguage = "en",
  gardenBackgroundSrc = "/backgrounds/garden.png",
  favoriteCharacter = "",
}) {
  return (
    <StoryScreen
      initialLanguage={initialLanguage}
      gardenBackgroundSrc={gardenBackgroundSrc}
      favoriteCharacter={favoriteCharacter}
    />
  );
}

export default App;
