// px2rem
let pxToRem = function (pwidth, prem) {
    let setFontSize = function () {
        let html = document.getElementsByTagName("html")[0];
        let oWidth = window.innerWidth;
        html.style.fontSize = oWidth / pwidth * prem + "px";
    };
    setFontSize();
    window.onresize = function () {setFontSize();};
    window.οnlοad = function () {setTimeout(function () {window.scrollTo(0, 1)}, 0);};
};
export {
    pxToRem
}