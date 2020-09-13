rs_require
===========

![Build status](https://api.travis-ci.com/valq7711/rs_require.svg?branch=master)

Simple amd-loader written on [Rapydscript](https://github.com/atsepkov/RapydScript). 


Usage:
```html
...
<script src="rs_require.js"></script>
<script src="index.js"></script>
...
```
or
```html
...
<script src="rs_require.js" data-main = "path/to/index.js"></script>
...
```

```javascript
//index.js
define(['vue', 'vue-router'], function(vue, v_router){
    ... // do something using vue and v_router
});
```
if some configuration is required
```javascript
//index.js
define(['amd'], function(amd){
    // amd is special built-in module with props: {version, config, import}
    amd.config({
        base_url: 'main_path/to/scripts' // default is parent location of data-main (if set) or rs_require.js 
        path:{
            'here': 'path/to/there',
            'cdnjs': 'https://cdnjs.cloudflare.com/ajax/libs' // so you can: define(['cdnjs/vue/2.6.12/vue.min.js'], function(vue){...})
        },
        map:{
            'here/this_module':'path/to/there/that_module' 
        }
        // or  
        // map: function(path_to_module, requester){ ...; return mapped_path_to_module}
        // requester is 'path/to/requester_module' that asks path_to_module
    });
    amd.import('app'); // start main code
    //or assuming app-module returns class   
    amd.import('app').then(App => {
        const app = new App(); 
        app.mount('#app');
        ... 
    })
});
```
also, instead of traditional `define(['a','b','c'], function(a, b, c))` you can
```javascript
define(['amd'], function(amd){
    amd.import({
        'path/to/vue':'',   // in case of empty string, the module name in package will be the tail of the path 
        'path/to/vue-router':'v_router'
    }).then(pack = > {
        pack.vue
        pack.v_router
    })
}) 
```
or 
```javascript
define({
        'path/to/vue':'',
        'path/to/vue-router':'v_router'
    }, 
    function(pack){
        pack.vue
        pack.v_router
    }
) 
```



