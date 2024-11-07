import './App.css'
import {useState, useEffect} from 'react';
import Tabs from './Tabs';
import A from './A'
import Ka from './Ka'
import Sa from './Sa'
import Nav from './Nav'
import React from 'react';


function App() {
  const tabsData = [
    {
      tabLabel: 'あ',
      tabContent: <A/>
    },
    {
      tabLabel: 'か',
      tabContent: <Ka/>,
    },
    {
      tabLabel: 'さ',
      tabContent: <Sa/>,
    },
    {
      tabLabel: '4',
      tabContent: <A/>
    },
    {
      tabLabel: '5',
      tabContent: <div>This is content for Tab 2.</div>,
    },
    {
      tabLabel: '6',
      tabContent: <div>This is content for Tab 3.</div>,
    },
    {
      tabLabel: 'か',
      tabContent: <div>This is content for Tab 2.</div>,
    },
    {
      tabLabel: '3',
      tabContent: <div>This is content for Tab 3.</div>,
    },
    {
      tabLabel: '4',
      tabContent: <A/>
    },
    {
      tabLabel: '5',
      tabContent: <div>This is content for Tab 2.</div>,
    },
    {
      tabLabel: '6',
      tabContent: <div>This is content for Tab 3.</div>,
    },
  ];




  return (
    <div className='bg-stone-900 h-screen'>
      <Nav/>
      <Tabs tabsData={tabsData} />
    </div>
  )
}

export default App
