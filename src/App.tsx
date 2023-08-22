import React from 'react';
import { BrowserRouter, Route ,Routes } from 'react-router-dom';
import Index from './page/index'
import DiscordLogin from './services/discordLogin';
import DiscordCallback from './services/discordCallback';
import TestForm from './page/testform'
import Guilds from './page/guilds';
//import logo from './logo.svg';
import './css/App.css';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path={"/"} element={<Index/>}/>
                <Route path={"/discord-login"} element={<DiscordLogin/>}/>
                <Route path={"/discord-callback"} element={<DiscordCallback/>}/>
                <Route path={"/test-form"} element={<TestForm/>}/>
                <Route path={"/guilds"} element={<Guilds/>}/>
            </Routes>
        </BrowserRouter>
    );
}
export default App;
