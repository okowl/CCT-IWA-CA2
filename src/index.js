import React from 'react';
import ReactDOM from 'react-dom';
import Button from '@material-ui/core/Button';
import 'typeface-roboto';
import CreateResultCard from './client/CreateResultCard.react';
import PlaylistTable from './client/PlaylistTable.react';



const getAllEntries = (setFetchResult) => {
 fetch("/api/playlist").then(
        (res) => {
            if (res.status !== 200) {
                setFetchResult({err: `Looks like there was a problem. Status Code: ${res.status}`});
                return;
            }

            // Examine the text in the response
            res.json().then(function(data) {
                setFetchResult({ data });
            });
        }
    );
}


const App = () => {
    const [fetchResult, setFetchResult] = React.useState(null);
    const refetch = () => getAllEntries(setFetchResult);
    React.useEffect(() => {
      refetch();
    }, []);

    return (
        <PlaylistTable refetch={refetch} fetchResult={fetchResult}/>
    );
}

ReactDOM.render(<App />, document.querySelector('#app'));