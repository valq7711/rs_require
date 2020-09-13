define(['bar'], function(bar ){
    log('sub/sub_bar <- bar:' + bar());
    return ()=> 'sub/sub_bar';   
});


