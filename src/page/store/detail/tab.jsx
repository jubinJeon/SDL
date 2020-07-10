import React, { useState } from 'react';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

const scrollMenu = (newValue = 0) =>{
  let list = document.querySelectorAll(".menuItems .itemsList > li")
  window.scrollTo({
    top:list[newValue].offsetTop - 201
  })
}

export default function ListTabMenu(props) {
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
    scrollMenu(newValue)
  };
  let mainMenu = ""

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
              mainMenu = props.mainMenu.filter(it => new RegExp(data.brdCtgId, "i").test(it.brdCtgId))
              if(mainMenu.length <= 0) return null
              return (
                <Tab key={"category_tab_" + i} label={data.brdCtgNm}/>
              )
            })
          }
        </Tabs>
    </div>
  );
}