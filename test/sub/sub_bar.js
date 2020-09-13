define(['bar', 'foo_as_baz'], function(bar, foo_as_baz ){
    log('sub/sub_bar <- bar:' + bar());
    log('sub/sub_bar <- foo_as_baz:' + foo_as_baz());
    return ()=> 'sub/sub_bar';   
});


