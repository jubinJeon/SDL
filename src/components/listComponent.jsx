import React , { useState, useEffect}from 'react';
import SingleMarketCmpnt from './SingleMarketCmpnt'
import LazyLoad from 'react-lazyload';


const ListComponent = ({data}) => {
    
    const [componentData, setComponentData] = useState({sortFlag: 'all' , storesData: data});

    const sortStores = (type) => {
        if(type === 'all'){
            setComponentData({sortFlag: type , storesData: data})
        }else if(type === 'dlv'){

            setComponentData({sortFlag: type , storesData: data.filter((store)=>{
                return store.dlvYn === 'Y'
            })})

        }else if(type === 'pic'){

            setComponentData({sortFlag: type , storesData: data.filter((store)=>{
                return store.pickYn === 'Y'
            })})
            
        }
    }

    console.log('============ componentData ',componentData)

    return (

        <>
            <div className="listSort">
                <div className="btnWrap leftCol">
                    <button type="button" onClick={(e) => {sortStores(e.currentTarget.value)}} value="all"
                        className={componentData.sortFlag === "all" ? "btn active" : "btn"}>전체</button>
                    <button type="button" onClick={(e) => {sortStores(e.currentTarget.value)}} value="dlv"
                        className={componentData.sortFlag === "dlv" ? "btn active" : "btn"}>배달</button>
                    <button type="button" onClick={(e) => {sortStores(e.currentTarget.value)}} value="pic"
                        className={componentData.sortFlag === "pic" ? "btn active" : "btn"}>픽업</button>
                </div>
            </div>
            <div className="listWrap">
                <ul className="listContent">
                    {
                        componentData.storesData !== null && componentData.storesData.map((market)=>
                        <LazyLoad>
                            <li key = {market.strId}>
                                <SingleMarketCmpnt  market={market} restYN ='N'/>
                            </li>
                        </LazyLoad>
                        )
                    }
                </ul>
            </div>
        </>
    )
}


export default ListComponent