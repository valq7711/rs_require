define(['foo'], function(foo ){
    log('here/foo <- foo:' + foo());
    return ()=> 'here/foo'; 
});


