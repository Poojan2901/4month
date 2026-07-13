import Cursor from "./components/common/Cursor";
import Hero from "./components/Hero/Hero";
import Counter from "./components/Counter/Counter";
import Soundtrack from "./components/Soundtrack/Soundtrack";
import Journey from "./components/Journey/Journey";
import Feeling from "./components/Feelings/Feelings";
import MessageJar from "./components/MessageJar/MessageJar";
import Stats from "./components/Stats/Stats";
import DiaryBook from "./components/Gallery/DiaryBook";
import Letters from "./components/Letters/Letters";
import LoveMap from "./components/LoveMap/LoveMap";
import Promises from "./components/Promises/Promises";
import Coupons from "./components/Coupons/Coupons";
import Quiz from "./components/Quiz/Quiz";
import MessageBottle from "./components/MessageBottle/MessageBottle";
import BucketList from "./components/BucketList/BucketList";
import Videos from "./components/Videos/Videos";
import "./styles/tokens.css";
import "./styles/global.css";

function App() {
  return (
    <div className="app">
      <Hero />
      <Counter />
      <Journey />
      <Feeling />
      <MessageJar />
      <Stats />
      <DiaryBook />
      <Letters />
      <LoveMap />
      <Promises />
      <Coupons />
      <Quiz />
      <MessageBottle />
      <BucketList />
      <Videos />
    </div>
  );
}

export default App;