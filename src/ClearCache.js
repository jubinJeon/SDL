import React, { useState, useEffect } from "react";
import packageJson from "../package.json";
import moment from "moment";

const buildDateGreaterThan = (latestDate, currentDate) => {
  const momLatestDateTime = moment(latestDate);
  const momCurrentDateTime = moment(currentDate);

  if (momLatestDateTime.isAfter(momCurrentDateTime)) {
    return true;
  } else {
    return false;
  }
};

function withClearCache(Component) {
  function ClearCacheComponent(props) {
    const [isLatestBuildDate, setIsLatestBuildDate] = useState(false);

    useEffect(() => {
      console.log('### version checking!');

      fetch(`/meta.json?${new Date().getTime()}`, {cache: 'no-cache'})
        .then((response) => response.json())
        .then((meta) => {
          const latestVersionDate = meta.buildDate;
          const currentVersionDate = packageJson.buildDate;

          const shouldForceRefresh = buildDateGreaterThan(
            latestVersionDate,
            currentVersionDate
          );

          if (shouldForceRefresh) {
            console.log('### version mismatch!');
            setIsLatestBuildDate(false);
            refreshCacheAndReload();
          } else {
            console.log('### version match!');
            setIsLatestBuildDate(true);
          }
        });
    }, []);

    const refreshCacheAndReload = () => {
      if (window.caches) {
        // Service worker cache should be cleared with caches.delete()
        window.caches.keys().then(async (names) => {
          await Promise.all(names.map(name => window.caches.delete(name)));        
          window.location.reload();            
        });        
      } else {
        // delete browser cache and hard reload
        window.location.reload();
      }
    };

    return (
      <React.Fragment>
        {isLatestBuildDate ? <Component {...props} /> : null}
      </React.Fragment>
    );
  }

  return ClearCacheComponent;
}

export default withClearCache;