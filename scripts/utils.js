function getUrlByParameter (name) {
    const url = new URL(window.location.href);
    return url.searchParams.get(name);
}

if(typeof module !=="undefined") {module.exports = {getUrlByParameter:getUrlByParameter};}