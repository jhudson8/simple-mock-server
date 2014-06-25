simple-mock-server
==================

static file and JSON endpoint http server

This is a standalone http server that can serve out standard file contents as well as JSON content matching a mock restful endopint.


Installation
-----------
```
npm install -g simple-mock-server
```


Usage
-----------
The server will serve out files from the directory in which it was started (by typing ```simpl-mock-server```)

If the URI path has no extension, a ```.json``` extension will be appended.  Any query parameters will be removed as well.

If the method is anything other than ```GET```, the method will be added as a suffix to the file name.  Ex: POST to /foo/bar will serve out /foo/bar_POST.json.


Options
-----------
```simpl-mock-server -h``` for help

* ***--silent***: Disable logging [false]
* ***-p***: Port to use [8080]
* ***--cors***: Allow CORS [false]

