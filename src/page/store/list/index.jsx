import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

import * as ACTION from '../../../common/ActionTypes'
import useAsync from '../../../hook/useAcync'
import * as API from '../../../Api'

import CircularProgress from '@material-ui/core/CircularProgress';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import ListComponent from '../../../components/listComponent'
import useAddress from '../../../hook/useAddress';
import { pullDefaultAddress, pullShowScreen, pushDefaultAddress, pushShowScreen } from '../../../util/Utils'


const Stores = ({ history, location }) => {
    
    // 주소정보
    const storedDefaultAddress = pullDefaultAddress()

    const type = Object.keys(storedDefaultAddress).length === 0 ? 1 : 4;
    const addressParams =  {type : type}
    const defaultAddress = useAddress(addressParams,[])

    const [categoriesState] = useAsync(()=>API.getCatogories(),[]);
    const {loading, data,error} = categoriesState;

    const screenData = pullShowScreen()
    const setScreenData = {
        bizCtgDtl : screenData.bizCtgDtl,
        orderType : 0,
        searchKeyword : screenData.searchKeyword
    }
    pushShowScreen(setScreenData)

    // 저장된 주소정보가 없을 경우 저장한다.
    if(type ===1){
        pushDefaultAddress(defaultAddress)
    }

    if(Object.keys(defaultAddress).length === 0){
        return null
    }

    if (loading) return (
        <div className="pageLoding">
            <div className="stateWrap">
                <div className="loading">로딩중..</div>
            </div>
        </div>
    );
    if (error) return (
        <div className="pageLoding">
            <div className="stateWrap">
                <div className="error">에러가 발생했습니다</div>
            </div>
        </div>
    );
    if (!data) return null;

    return (
        <>
            <Header defaultAddress = {defaultAddress} history = {history} />
            <ContentSection defaultAddress = {defaultAddress} categoryData = {data.data} bizCtgDtlData = {screenData.bizCtgDtl}/>
        </>
    );
};

const Header = ({defaultAddress, history})=>{

    const onClickBackBtn = (e) => {
        e.preventDefault();
        history.goBack();
    };

    let address = '';

    if(Object.keys(defaultAddress).length !== 0){
        if(defaultAddress.road_address){
            address = defaultAddress.road_address.address_name
        }else{
            address = defaultAddress.address.address_name
        }
    }
    
    return (
        <div id="header">
            <div className="headerTop">
                <div className="leftArea">
                        <button /*href="#" */ className="icon pageBack" onClick={onClickBackBtn}>Back</button>
                    </div>           
                <div className="middleArea">
                <Link to={{pathname: ACTION.LINK_ADDRESS_SETTING}} className="addressBox">{address}</Link>
                </div>
            </div>
        </div>
    );
}

const ContentSection = ({defaultAddress, categoryData, bizCtgDtlData}) => {

    const [bizCtgDtl, setBizCtgDtl] = useState(bizCtgDtlData)

    return(
        <>
        <div id="wrap">
            <div id="container">
                <div id="content">
                    <div>
                        <CategorySection callback = {setBizCtgDtl} categoryData = {categoryData} bizCtgDtlData={bizCtgDtl}/>
                        {
                            bizCtgDtl === "2029" ?
                            <StationListSection bizCtgDtl={bizCtgDtl} defaultAddress = {defaultAddress}/>
                            :
                            <ListSection bizCtgDtl={bizCtgDtl} defaultAddress = {defaultAddress}/>
                        }
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

const CategorySection = ({ callback, categoryData, bizCtgDtlData}) => {

    const handleTabChange1 = (event, newValue) => {
        callback(categoryData[newValue].bizCtgDtl)
        
        const screenData = pullShowScreen()
        const data = {
            bizCtgDtl : categoryData[newValue].bizCtgDtl,
            orderType : 0,
            searchKeyword : screenData.searchKeyword
        }
        pushShowScreen(data)
    };

    let tabIndex = -1;

    categoryData.some((obj)=> {
        tabIndex = tabIndex + 1
        if(obj.bizCtgDtl === bizCtgDtlData)
        return (obj.bizCtgDtl === bizCtgDtlData)
    })
    

    return(
        <>
            <div className="listMenu fixed withMaterial">
                <Tabs
                    value={tabIndex}
                    onChange={handleTabChange1}
                    variant="scrollable"
                    scrollButtons="auto"
                    aria-label=""
                    indicatorColor="primary"
                >
                { 
                    categoryData !== null && categoryData.length > 0 ?
                    categoryData.map((label) => {
                        return (
                            <Tab key={label.bizCtgDtl} label={label.bizCtgGrpNm}/>
                        )
                    })
                    :
                    null
                }
                </Tabs>
            </div>
        </>
    )
}

const ListSection = ({bizCtgDtl, defaultAddress})=>{

    const [result, setResult] = useState(null)

    useEffect (() => {
        API.getStores(defaultAddress.y, defaultAddress.x, bizCtgDtl, "", "", "")
            .then((data)=>{
                setResult(data);
            })
            .catch((error) => {
                setResult([]);
            })
    }, [bizCtgDtl]);

    const selectFilterResult = useCallback((nFilter)=>{
        API.getStores(defaultAddress.y, defaultAddress.x, bizCtgDtl, "", nFilter, "")
        .then((data)=>{
            setResult(data)
        })
        .catch((error) => {
            setResult([])
        })
    })

    if(result === null) return null

    return(
        <ListComponent data={result.data} bizCtgDtl={bizCtgDtl} callback = {changeFilter}/>
    )

    function changeFilter(filter) {
        let nFilter
        if(filter === "avrgStarPnt") {
            nFilter = 1
        }
        else if(filter === "rvwCnt") {
            nFilter = 2
        }
        else if(filter === "distance") {
            nFilter = 3
        }
        
        selectFilterResult(nFilter)
    }
}

const StationListSection = ({bizCtgDtl, defaultAddress})=>{

    console.log('StationListSection data', bizCtgDtl)
    console.log('StationListSection data', defaultAddress)

    const [state, setState] = useAsync(()=>API.getRestAreas("", "", ""),[bizCtgDtl]);
    const {loading, data, error} = state;

    const selectRestAreas = useCallback((exWayCd)=>{
        API.getRestAreas(exWayCd, "", "")
        .then((data)=>{
            setState(data)
        })
        .catch((error) => {
            setState([])
        })
    })

    if (loading) return (
        <>
            <div className="pageLoding">
                <div className="stateWrap">
                    <div className='loading'>로딩중..</div>
                </div>
            </div>
        </>
    );

    if (error) return (
        <>
            <div className="pageLoding">
                <div className="stateWrap">
                    <div className='loading'>에러가 발생했습니다</div>
                </div>
            </div>
        </>
    );

    if (!data) return null;

    return(
        <ListComponent data={data.data} bizCtgDtl={bizCtgDtl} callback = {selectRestAreas}/>
    )
}

export default Stores;