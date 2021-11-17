const serverURL = 'http://54.195.21.14:8080';

const LogService = {
    saveLog: (log) => {
        return fetch(`${serverURL}/logs`, {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({log})
        })
            .then(res => res.json())
            .then(result => console.log(result.logs), error => console.log(error));
    },
    deleteLogs: () => fetch(`${serverURL}/logs`, {method: 'DELETE'}),
    getLogs: () => fetch(`${serverURL}/logs`).then(res => res.json())
}

export default LogService;
