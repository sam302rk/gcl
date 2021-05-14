const getJSON = function(url, callback) {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.responseType = 'json'
    xhr.onload = () => {
        if (xhr.status === 200) callback(null, xhr.response)
        else callback(xhr.status, xhr.response)
    };
    xhr.send()
};

const setInstalled = function(installed) {
    document.getElementById("play").hidden = !installed
    document.getElementById("install").hidden = installed
}

window.addEventListener('DOMContentLoaded', () => {
    getJSON("http://127.0.0.1:53170/api/get?t=user", (err, data) => {
        if (err) return
        document.getElementById("name").innerHTML += data
        document.getElementById("id").src = "https://crafatar.com/avatars/" + data.id + "?size=128&default=MHF_Steve&overlay"
    })
    setInstalled(true)
})


document.addEventListener('keyup', (e) => {
    if (e.key === 'm') setInstalled(document.getElementById("play").hidden)
});