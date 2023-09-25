import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/index.css';
import App from './App';
import Header from './components/header';
import Footer from './components/footer';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <>
        <Header />
        <div className='container'>
            <App />
        </div>
        <Footer />
    </>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
