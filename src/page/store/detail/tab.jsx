import React, { useState } from 'react';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {unescapehtmlcode} from '../../../util/Utils'



export default function ListTabMenu(props) {

  const [value, setValue] = React.useState(0);
  
  const handleChange = (event, newValue) => {
    props.inputSearchRef.current.value = ""
    props.setKeyWord("")
    props.setShowButton(false)

    setValue(newValue);

    const timer = setTimeout(()=>{
      scrollMenu(newValue)
      clearTimeout(timer)
    },100)
    
  };

  const scrollMenu = (newValue = 0) =>{
    let list = document.querySelectorAll(".menuItems .itemsList > li")
    if(list.length > 0) {
      window.scrollTo({
        top:list[newValue].offsetTop - 201,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className="menuListTab pageTabMenu  withMaterial">
        <Tabs
            value={value}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label=""
            indicatorColor="primary"
        >
          {
            props.category.map((data, i) => {
              const mainMenu = props.mainMenu.filter(it => new RegExp(data.brdCtgId, "i").test(it.brdCtgId))
              if(mainMenu.length <= 0) return null
              return (
                <Tab key={"category_tab_" + i} label={unescapehtmlcode(data.brdCtgNm)}/>
              )
            })
          }
        </Tabs>
    </div>
  );
}