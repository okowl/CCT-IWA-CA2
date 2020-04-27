import React from 'react';
import ReactDOM from 'react-dom';
import Button from '@material-ui/core/Button';
import 'typeface-roboto';
import CreateResultCard from './client/CreateResultCard.react';

const App = () => {
    const [result, setResult] = React.useState(null);
    return (
    <>
        <Button variant="contained" color="primary" onClick={() => {
            fetch("/api/create", {
                method: 'post',
                headers: {
                 "Content-Type": "application/json; charset=UTF-8"
                },
                body: JSON.stringify({
                    channel: "wearepussyriot",
                    published_date: "8/31/2019 9:50:21 a8/p8",
                    title: "Pussy Riot - Police State",
                    url: "https://www.youtube.com/watch?v=oaZl12Z5P7g"
                })
            }).then(
                (response) => {
                    if (response.status !== 200) {
                        setResult('Looks like there was a problem. Status Code: ' +
                        response.status);
                        return;
                    }

                    // Examine the text in the response
                    response.json().then(function(data) {
                        setResult(data);
                    });
                }
            );
        }}>
        Create Pussy Riot entry: 
        </Button>
        <CreateResultCard result={result}/>
    </>
  );
}

ReactDOM.render(<App />, document.querySelector('#app'));