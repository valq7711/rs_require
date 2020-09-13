window.log = function(s){
    window.log.out.push(s);
};
window.log.out = [];

define(['amd'], function(amd){
    amd.config({
        path:{
            'there': 'asset/here'
        },
        map:(path, requester)=>(path === 'foo_as_baz' ? 'foo' : path)
    });
    p1 = amd.import('sub/sub_foo');
    p2 = amd.import({'sub/sub_foo':''});
    Promise.all([p1, p2]).then(arr => {
        sub_foo1 = arr[0];
        sub_foo2 = arr[1].sub_foo; // package
        window.log.out.push('sub/sub_foo: ' + sub_foo1());
        window.log.out.push('sub/sub_foo{}: ' + sub_foo2());
        window.done(window.log.out);
    })
    .catch((e)=>{ 
        console.log('catch');
        window.onerror(e.message || e, null, null, null, e);
    });
});


