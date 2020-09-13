window.log = function(s){
    window.log.out.push(s);
};
window.log.out = [];

define(['amd'], function(amd){
    amd.config({
        path:{
            'there': 'asset/here'
        }
    });
    p = amd.import(['sub/sub_foo']);
    p.then(()=> window.done(window.log.out))
    .catch((e)=>{ 
        window.onerror(e.stack || e );
    });
});


