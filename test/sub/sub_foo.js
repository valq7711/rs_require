define(['foo', './sub_bar', 'there/foo'], function(foo, sub_bar, there_foo ){
    log('sub/sub_foo <- foo:' + foo());
    log('sub/sub_foo <- sub_bar:' + sub_bar());
    log('sub/sub_foo <- there_foo:' + there_foo());
    return ()=> 'sub/sub_foo';   
});


