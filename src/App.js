import './App.css';
import React from 'react';
import { useState, useEffect } from 'react';

const API_URL = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&order=market_cap_desc&per_page=25&page=1&sparkline=false";

const CoinRow = (props) => {
  return(
    <>
    {props?.index % 2 == 0
      ?(
        <>
        <tr className="even">
         <Coin {... props}/>
        </tr>
        </>
      ) : (
        <>
        <tr className="odd">
         <Coin {... props}/>
        </tr>
        </>
      )
    }
    </>
  )
}

const Coin = (props) => {
  return (
    <>
      <td>{props.rank}</td>
      <td>
        <div className="flex-container">
          <div>
            <img className="thumbnail" src={props.imageURL} alt={"thumbnail" + "-" + props.name}></img>
          </div>
          <div>
            { props.name }
          </div>
          <div className="symbol">
            { props.symbol }
          </div>
        </div>
      </td>
      <td>{ "€ " + props.market_cap }</td>
      <td>{ "€ " + props.price }</td>
    </>
  )
}

const App = () => {

  const [coins, setCoins] = useState([]);
  let [timeStamp, setTimeStamp] = useState("");

  const getCoins = async () => {
    const response = await fetch(API_URL);
    const data = await response.json();    
    const date = new Date();
    let dateString = date.toLocaleString();  
    setTimeStamp(dateString);
    setCoins(data);
  }

  useEffect(() => {
    getCoins();
    const timer = setInterval(() => getCoins(), 10000);
  },[]);

  return(
    <>
    <div className="header">
      <h1>Crypto ticker | {timeStamp}</h1>
      <div className="credits">Data from CoinGecko</div>
    </div>
    <div>
    {
      coins?.length > 0
        ?(
          <table className="center">
            <tbody>
              <tr>
                <th>#</th>
                <th className="center">Coin</th>
                <th>Mkt cap</th>
                <th>Price</th>
              </tr>
              {coins.map((coin, index) => (               
                <CoinRow name={coin.name} 
                      price={coin.current_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      imageURL={coin.image}
                      symbol={coin.symbol}
                      market_cap={coin.market_cap.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      index={index}
                      rank={index+1}
                />
              ))}
              </tbody>
          </table>
        ) : (
          <p></p>
        )
    }
    </div>
    </>
  )
}

export default App;
