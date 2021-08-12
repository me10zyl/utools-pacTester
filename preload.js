(function(window) {
    var pac = function() {};
    var proto = window;
    var pacFunctions = [
        'alert',
        'dateRange',
        'dnsDomainIs',
        'dnsDomainLevels',
        'dnsResolve',
        'isInNet',
        'isPlainHostName',
        'isResolvable',
        'localHostOrDomainIs',
        'myIpAddress',
        'shExpMatch',
        'timeRange',
        'weekdayRange'
    ];

    var TODO = function() { return true; }

    proto.test = function(_code, url, host) {
        var i, re, code = _code.replace(/\bFindProxyForURL\b/, '');

        for (i = 0; i < pacFunctions.length; i++) {
            re = new RegExp('\\b' + pacFunctions[i] + '\\s*\\(', 'g');
            code = code.replace(re, 'this.' + pacFunctions[i] + '(');
        }

        code = code.replace(/\b(new\s|document\.|window\.|cookie\b)/, 'ILLEGAL');
        code = eval('(' + code + ');');
        return code.call(this, url, host);
    };

    proto.alert = function(str) {
        alert(str);
    };

    proto.dateRange = TODO;

    proto.dnsDomainIs = function(host, domain) {
        return host.length >= domain.length && host.substring(host.length - domain.length) == domain;
    };

    proto.dnsDomainLevels = function(host) {
        var m = host.match(/\./g);
        return m ? m.length - 1 : 0;
    };

    proto.dnsResolve = function(host) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', '/proxyforurl/gethostbyname?host=' + host, false);
        xhr.send(null);
        return xhr.status == 200 ? xhr.responseText : false;
    };

    proto.isInNet = function(ip, net, mask) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', '/proxyforurl/within?ip=' + ip + '&net=' + net + '&mask=' + mask, false);
        xhr.send(null);
        return xhr.status == 200 && parseInt(xhr.responseText) ? true : false;
    };

    proto.isResolvable = function(host) {
        return dnsResolve(host) ? true : false;
    }

    proto.isPlainHostName = function(str) {
        return str.match(/\./) ? false : true;
    };

    proto.localHostOrDomainIs = function(host, str) {
        return str.match(/^\./) ? dnsDomainIs(host, str) : host == str ? true : host == host.split('.')[0];
    };

    proto.myIpAddress = function() {
        return '172.20.0.1';
    };

    proto.shExpMatch = function(str, re) {
        return str.match(new RegExp(re.replace(/\*/, '.*?'), 'i'));
    };

    proto.timeRange = TODO;
    proto.weekdayRange = TODO;

    //window.Pac = pac;
})(window);
window.onload = 
function(){
    let pacURL = document.getElementById('pacURL')
    let result = document.getElementById('result');
    let url = document.getElementById('url');
    let host = document.getElementById('host');
    let checkURL = document.getElementById('checkURL');
    if(localStorage['tmp1']){
        url.value = localStorage['tmp1']
    }
    if(localStorage['tmp2']){
        pacURL.value = localStorage['tmp2']
    }
    checkURL.onclick = async ()=> {
        /*let elem = document.getElementById('pacScript');
        if(elem){
            elem.remove()
        }
        let script = document.createElement('script');
        script.src = pacURL.value
        script.id= 'pacScript'
        let head = document.getElementsByTagName('head')[0];
        head.appendChild(script);
        await new Promise((r1,r2)=>{script.onload = function (){
            r1()
        }});*/
        var xhr = new XMLHttpRequest();
        xhr.open('GET',  pacURL.value, false);
        xhr.send(null);
        let response = xhr.responseText
        eval(response)
        let indexOf = url.value.replace(/^http(s)?:\/\//,'').indexOf('/');
        host.value = url.value.replace(/^http(s)?:\/\//,'').substr(0, indexOf > 0 ? indexOf : url.value.length)
        //console.log('scripts',  script.innerText)
        let data = FindProxyForURL(url.value, host.value);
        result.innerText = url.value + ":" + "\n" + data
        console.log(data)
        localStorage['tmp1'] = url.value
        localStorage['tmp2'] = pacURL.value
    }
}