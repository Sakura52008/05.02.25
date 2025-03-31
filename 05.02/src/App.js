import React, { useState, useEffect, useMemo } from 'react';
import './App.css';

const symbols = ['♥', '♦', '♣', '♠', '★', '☆', '■', '□'];

function App() {
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);  // Индексы перевернутых карт
  const [matchedCards, setMatchedCards] = useState([]);  // Совпавшие карты
  const [moves, setMoves] = useState(0);  // Количество ходов
  const [isBlocked, setIsBlocked] = useState(false);  // Блокировка хода, если карта не совпала

  // Генерация случайных карт
  const shuffledCards = useMemo(() => {
    const doubledSymbols = [...symbols, ...symbols];  // Удваиваем массив символов
    for (let i = doubledSymbols.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [doubledSymbols[i], doubledSymbols[j]] = [doubledSymbols[j], doubledSymbols[i]]; // Перемешивание
    }
    return doubledSymbols;
  }, []);

  useEffect(() => {
    // Инициализируем карты
    setCards(shuffledCards.map((symbol, index) => ({ symbol, id: index, flipped: false })));
  }, [shuffledCards]);

  useEffect(() => {
    if (flippedIndices.length === 2) {
      const [firstIndex, secondIndex] = flippedIndices;
      if (cards[firstIndex].symbol === cards[secondIndex].symbol) {
        // Если карты совпали, добавляем их в matchedCards
        setMatchedCards(prev => [...prev, cards[firstIndex].symbol]);
      } else {
        // Если не совпали, через секунду закрываем их
        setIsBlocked(true);
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map(card =>
              flippedIndices.includes(card.id)
                ? { ...card, flipped: false }
                : card
            )
          );
          setIsBlocked(false);
        }, 1000);
      }
      setMoves(prev => prev + 1);
      setFlippedIndices([]);  // Сбрасываем перевернутые карты
    }
  }, [flippedIndices, cards]);

  const handleCardClick = index => {
    if (isBlocked || cards[index].flipped || matchedCards.length === symbols.length) return;

    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);
    setFlippedIndices(prev => [...prev, index]);
  };

  const checkWin = () => matchedCards.length === symbols.length;

  return (
    <div className="game">
      <h1>Карточки на память</h1>
      <p>Ходов: {moves}</p>
      {checkWin() && <p>Вы выиграли!</p>}
      <div className="card-container">
        {cards.map((card, index) => (
          <div
            key={card.id}
            className={`card ${card.flipped ? 'flipped' : ''}`}
            onClick={() => handleCardClick(index)}
          >
            {card.flipped ? card.symbol : '?'}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
