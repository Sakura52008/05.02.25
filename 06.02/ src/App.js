import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [coins, setCoins] = useState(0);
  const [clickBonus, setClickBonus] = useState(1);
  const [autoMineRate, setAutoMineRate] = useState(0);
  const [clickUpgradeCost, setClickUpgradeCost] = useState(10);
  const [autoUpgradeCost, setAutoUpgradeCost] = useState(20);
  const [environmentUpgradeCost, setEnvironmentUpgradeCost] = useState(100);
  const [environmentLevel, setEnvironmentLevel] = useState(0);
  const [background, setBackground] = useState("url('/images/background1.jpg')");

  const backgrounds = [
    "url('/images/background1.jpg')",
    "url('/images/background2.jpg')",
    "url('/images/background3.jpg')",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCoins((prevCoins) => prevCoins + autoMineRate);
    }, 1000);
    return () => clearInterval(interval);
  }, [autoMineRate]);

  const handleMineClick = () => {
    setCoins((prevCoins) => prevCoins + clickBonus);
  };

  const handleUpgradeClick = () => {
    if (coins >= clickUpgradeCost) {
      setCoins((prevCoins) => prevCoins - clickUpgradeCost);
      setClickBonus((prevBonus) => prevBonus + 1);
      setClickUpgradeCost((prevCost) => Math.floor(prevCost * 1.5));
    }
  };

  const handleUpgradeAuto = () => {
    if (coins >= autoUpgradeCost) {
      setCoins((prevCoins) => prevCoins - autoUpgradeCost);
      setAutoMineRate((prevRate) => prevRate + 2);
      setAutoUpgradeCost((prevCost) => Math.floor(prevCost * 1.5));
    }
  };

  const handleUpgradeEnvironment = () => {
    if (coins >= environmentUpgradeCost) {
      setCoins((prevCoins) => prevCoins - environmentUpgradeCost);
      setEnvironmentLevel((prevLevel) => prevLevel + 1);
      setEnvironmentUpgradeCost((prevCost) => Math.floor(prevCost * 1.5));
      setBackground(backgrounds[Math.min(environmentLevel, backgrounds.length - 1)]);
    }
  };

  return (
    <div className="game-container" style={{ backgroundImage: background }}>
      <div className="header">
        <div className="coins-info">
          <span id="coins">{coins}</span> монет
          <span id="auto-mine"> (+{autoMineRate} в сек)</span>
        </div>
      </div>

      <div className="upgrade-buttons">
        <button onClick={handleUpgradeClick}>
          Улучшить клик (+1) - {clickUpgradeCost} монет
        </button>
        <button onClick={handleUpgradeAuto}>
          Улучшить автодобычу (+2/сек) - {autoUpgradeCost} монет
        </button>
        <button onClick={handleUpgradeEnvironment}>
          Улучшить окружение - {environmentUpgradeCost} монет
        </button>
      </div>

      <div className="mine-button-container">
        <button className="mining-button" onClick={handleMineClick}>Добыча</button>
      </div>
    </div>
  );
};

export default App;
